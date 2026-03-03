"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ATSResult } from "@/lib/ats-scoring";

export async function analyzeApplicationAI(
    requiredSkills: string[],
    resumeText: string
): Promise<ATSResult> {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        console.error("GOOGLE_API_KEY is not set");
        throw new Error("AI service not configured");
    }

    console.log("Using API Key starting with:", apiKey.substring(0, 7) + "...");

    // Using models discovered via ListModels for this 2026 context
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-001", "gemini-2.5-flash", "gemini-1.5-flash"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting analysis with model: ${modelName}`);
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            const prompt = `
                You are an expert ATS (Applicant Tracking System) parser. Analyze the provided resume text against the list of required skills.
                
                Required Skills: ${requiredSkills.join(", ")}
                Resume Text: ${resumeText}
                
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

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log(`Success with ${modelName}! Response length:`, text.length);
            return JSON.parse(text) as ATSResult;
        } catch (error: any) {
            console.warn(`Model ${modelName} failed:`, error.message || error);
            lastError = error;
            if (error.status === 404 || error.message?.includes("not found")) continue;
            throw error;
        }
    }

    throw lastError || new Error("All AI models failed");
}
