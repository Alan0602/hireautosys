"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ATSResult } from "@/lib/ats-scoring";

// Sanitize user-supplied text before interpolating into AI prompts
// This prevents prompt injection attacks
function sanitizeForPrompt(input: string, maxLength = 8000): string {
    return input
        .replace(/[`${}\\<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, maxLength);
}

export async function analyzeApplicationAI(
    requiredSkills: string[],
    resumeText: string
): Promise<ATSResult> {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error("AI service not configured");
    }

    // Sanitize inputs to prevent prompt injection
    const safeResumeText = sanitizeForPrompt(resumeText, 8000);
    const safeSkills = requiredSkills
        .slice(0, 30)
        .map(s => sanitizeForPrompt(s, 50))
        .filter(s => s.length > 0);

    // gemini-2.5-flash is the primary model; 2.0-flash as quota fallback
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-pro"];
    let lastError = null;

    const prompt = `
You are an expert ATS (Applicant Tracking System) with advanced semantic understanding. Go beyond keyword matching and infer related knowledge from adjacent skills.

## Semantic Skill Synonym Rules
Apply these when a required skill is not explicitly mentioned but a clearly related skill IS present on the resume:
- Supabase → infer PostgreSQL at 50–65% confidence (Supabase is built on PostgreSQL)
- Next.js → infer React.js at 85–95% confidence (Next.js is a React framework)
- React.js → infer Next.js awareness at 40–55% confidence
- Playwright → infer Jest/testing knowledge at 55–70% confidence
- Tailwind CSS → infer CSS proficiency at 80–90% confidence
- TypeScript → infer JavaScript proficiency at 95% confidence
- GraphQL → infer REST API familiarity at 60–70% confidence
- AWS/GCP/Azure → infer cloud infrastructure knowledge at 75% confidence
- Figma → infer UI/UX design awareness at 65% confidence
- Apply similar reasoning for any other clearly adjacent skill pairs you identify.

## Scoring Algorithm
1. Explicitly found required skill: full points
2. Semantically inferred skill: partial points (full_points × confidence ÷ 100)
3. No evidence of skill: 0 points
Final score = (total earned ÷ total possible) × 100, rounded to nearest integer.

Required Skills: ${safeSkills.join(", ")}
Resume Text: ${safeResumeText}

Return ONLY a valid JSON object with NO markdown or code fences:
{
  "score": number (0-100),
  "skillsFound": string[] (required skills explicitly present in the resume),
  "partialSkills": [ { "skill": string, "confidence": number (0-100), "reason": string } ],
  "missingSkills": string[] (required skills with no direct or indirect evidence),
  "tips": string[] (3-5 actionable improvement tips),
  "summary": string (2-3 sentence overall match summary),
  "status": "High Match" | "Medium Match" | "Low Match",
  "semanticAnalysis": string (paragraph explaining semantic inferences and overall fit),
  "projects": [ { "title": string, "description": string, "technologies": string[] } ]
}
    `;

    for (const modelName of modelsToTry) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return JSON.parse(text) as ATSResult;
        } catch (error: any) {
            lastError = error;
            const isRateLimited = error.status === 429 || error.message?.includes("429") || error.message?.includes("quota");
            const isNotFound = error.status === 404 || error.message?.includes("not found");
            // Fall through to the next model on quota/rate limit or not-found errors
            if (isRateLimited || isNotFound) {
                console.warn(`Model ${modelName} failed (${error.status ?? "quota"}), trying next...`);
                // Small delay before trying next model to avoid hammering the API
                await new Promise(res => setTimeout(res, 500));
                continue;
            }
            throw error;
        }
    }

    throw lastError || new Error("All AI models failed");
}
