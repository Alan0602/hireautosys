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

    // Model fallback order: prefer 1.5-flash (higher free quota), then 2.0-flash, then 2.5-flash
    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
    let lastError = null;

    const prompt = `
        You are an expert ATS (Applicant Tracking System) parser. Analyze the provided resume text against the list of required skills.
        
        Required Skills: ${safeSkills.join(", ")}
        Resume Text: ${safeResumeText}
        
        Return a JSON object with the following structure:
        {
          "score": number (0-100),
          "skillsFound": string[] (skills present in the resume),
          "missingSkills": string[] (skills missing from the resume),
          "tips": string[] (3 actionable improvement tips),
          "summary": string (a short summary of the match),
          "status": "High Match" | "Medium Match" | "Low Match",
          "semanticAnalysis": string (A thoughtful paragraph analyzing the context of the candidate's achievements and alignment),
          "projects": [ { "title": string, "description": string, "technologies": string[] } ] (array of key projects extracted from the resume)
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
