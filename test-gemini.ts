import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv"

dotenv.config({ path: '.env.local' });

async function testModel() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log("Found API Key:", !!apiKey);
    
    if (!apiKey) return;

    const ai = new GoogleGenAI({ apiKey });

    try {
        console.log("Testing gemini-2.5-flash...");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "hello, confirm you are working",
        });
        console.log("Success! Response:", response.text);
    } catch (err: any) {
        console.error("Error testing model:", err.message);
    }
}

testModel();
