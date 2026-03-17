import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createServerClient } from "@supabase/ssr";
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
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {}
                    },
                },
            }
        );

        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
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
                prompt = `${systemInstruction}\nAnalyze this resume against the following required skills.
                Required Skills: ${JSON.stringify(data.requiredSkills)}
                Resume Text: ${data.resumeText}

                Return a detailed JSON response exactly in this format:
                {
                  "score": number (0-100),
                  "skillsFound": string[],
                  "missingSkills": string[],
                  "tips": string[],
                  "summary": string,
                  "status": "High Match" | "Medium Match" | "Low Match",
                  "semanticAnalysis": "A paragraph explaining why the candidate is or isn't a good fit."
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
