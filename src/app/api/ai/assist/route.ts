import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Persona-based prompting constants for HR modes
const PERSONAS = {
    HR_ASSISTANT: "You are an expert HR Consultant and Hiring Manager. Your goal is to help streamline the hiring process with professional, insightful, and actionable advice.",
    ATS_EXPERT: "You are a specialized Applicant Tracking System (ATS) optimization expert. You analyze resumes against job descriptions with extreme precision, focusing on skill matching, experience relevance, and potential candidate fit."
};

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function POST(req: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Custom cookie-based auth (not Supabase Auth)
        const cookieStore = await cookies();
        const userId = cookieStore.get('hs_user_id')?.value;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: authUser, error: authError } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', userId)
            .eq('is_active', true)
            .maybeSingle();

        if (authError || !authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate limiting using verified userId
        const now = Date.now();
        const userRateLimit = rateLimitMap.get(userId);

        if (userRateLimit) {
            if (now > userRateLimit.resetTime) {
                rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
            } else {
                if (userRateLimit.count >= RATE_LIMIT_MAX) {
                    return NextResponse.json({ error: "Too many requests. Please wait before trying again." }, { status: 429 });
                }
                userRateLimit.count += 1;
                rateLimitMap.set(userId, userRateLimit);
            }
        } else {
            rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        }


        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is missing. Add it to .env.local and restart the dev server." },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });
        const { code, algorithm, description, question, language, mode, ...data } = await req.json();

        let prompt = "";
        let systemInstruction = PERSONAS.HR_ASSISTANT;
        let useJson = false;

        switch (mode) {
            case "algorithm":
                const algoDescription = (question || description || "").trim();
                if (!algoDescription || !algorithm?.trim()) {
                    return NextResponse.json({ error: "Description and algorithm content are required." }, { status: 400 });
                }
                prompt = `You are a strict but helpful computer science teaching assistant. Review the following student's algorithm for solving the problem. 
                Do NOT write code for them. Provide constructive feedback, highlighting missing edge cases, time/space complexity issues, or logical flaws. 
                If the algorithm is perfect, explicitly state "APPROVED" at the very beginning of your response.
                Keep it short, clear and concise.
                
                Problem Description:
                ${algoDescription}
                
                Student's Algorithm:
                ${algorithm}`;
                break;

            case "code":
                const codeDescription = (question || description || "").trim();
                if (!codeDescription || !code?.trim()) {
                    return NextResponse.json({ error: "Description and code content are required." }, { status: 400 });
                }
                prompt = `You are a strict but helpful computer science teaching assistant. Review the following student's code. 
                Do NOT write the complete solution for them. Provide small hints, point out syntax or logical errors, and suggest improvements for time/space complexity.
                Keep it short, clear and concise.
                
                Problem Description:
                ${codeDescription}
                
                Language: ${language || "Unknown"}
                
                Student's Code:
                ${code}`;
                break;

            case "resume_analysis":
                systemInstruction = PERSONAS.ATS_EXPERT;
                useJson = true;
                prompt = `${systemInstruction}

You are performing a nuanced, semantic ATS analysis. You MUST go beyond exact keyword matching and infer related knowledge from adjacent skills.

## Semantic Skill Synonym Rules
Apply these rules when a required skill is not explicitly mentioned but a related skill IS present on the resume:
- If resume has **Supabase** → infer **PostgreSQL** knowledge at 50–65% confidence (Supabase is built on top of PostgreSQL).
- If resume has **Next.js** → infer **React.js** knowledge at 85–95% confidence (Next.js is a React framework).
- If resume has **React.js** → infer **Next.js** awareness at 40–55% confidence.
- If resume has **Playwright** → infer **Jest / testing** knowledge at 55–70% confidence.
- If resume has **Tailwind CSS** → infer **CSS** proficiency at 80–90% confidence.
- If resume has **Supabase Auth** or **JWT** → infer **authentication patterns** at 70% confidence.
- If resume has **TypeScript** → infer **JavaScript** proficiency at 95% confidence.
- If resume has **GraphQL** → infer **REST API** familiarity at 60–70% confidence.
- If resume has **AWS / GCP / Azure** → infer **cloud infrastructure** knowledge at 75% confidence.
- If resume has **Figma** → infer **UI/UX design awareness** at 65% confidence.
- Apply similar semantic reasoning for any other clearly adjacent technology pairs you identify.

## Scoring Algorithm
Calculate the score as follows:
1. For each required skill explicitly found in the resume: award **full points**.
2. For each required skill inferred via semantic rules above: award **partial points** (points × confidence% ÷ 100).
3. For each required skill completely absent (no direct or semantic match): award **0 points**.
4. Final score = (total points earned / total possible points) × 100, rounded to nearest integer.

## Required Skills to evaluate:
${JSON.stringify(data.requiredSkills)}

## Resume Text:
${data.resumeText}

## Output Format
Return ONLY a valid JSON object with NO markdown, no code fences, no explanation outside JSON. Use exactly this shape:
{
  "score": number (0-100),
  "skillsFound": ["list of required skills explicitly found in the resume"],
  "partialSkills": [
    {
      "skill": "required skill name",
      "confidence": number (0-100),
      "reason": "one sentence explaining the semantic inference"
    }
  ],
  "missingSkills": ["required skills with no direct or indirect evidence in the resume"],
  "tips": ["3-5 actionable tips for the candidate to improve their ATS score for this role"],
  "summary": "2-3 sentence overall summary of the candidate's fit",
  "status": "High Match" | "Medium Match" | "Low Match",
  "semanticAnalysis": "A paragraph explaining the semantic skill inferences made and why the candidate is or isn't a good fit beyond exact keyword matching."
}`;
                break;

            case "job_description":
                prompt = `${systemInstruction}\nHelp me improve this job description or create a new one.
                Job Title: ${data.title || "Not specified"}
                Key Requirements: ${data.requirements || "Not specified"}
                Existing Draft: ${data.draft || "None"}`;
                break;

            case "general_hr_help":
            default:
                prompt = `${systemInstruction}\nI need help with a general HR task: ${data.query || "No query provided"}`;
                break;
        }

        // The user's snippet uses gemini-2.5-flash.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
        });

        const feedbackText = response.text || "No feedback generated.";

        return NextResponse.json({
            feedback: useJson ? JSON.parse(feedbackText) : feedbackText,
        });

    } catch (error: any) {
        console.error("AI Assist Error:", error);
        return NextResponse.json(
            { error: "Internal server error during AI generation", details: error.message },
            { status: 500 }
        );
    }
}
