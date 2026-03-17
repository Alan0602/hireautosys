# AI Implementation in Digital Record

This document explains how the AI assistant is initialized and implemented in the Digital Record project, including the response handling logic.

## 1. Architectural Overview

The AI features are built using the **Google Generative AI (Gemini)** API. The implementation follows a client-server pattern using Next.js route handlers:

- **Frontend**: Student and Teacher pages send requests to a central API route.
- **Backend**: A Next.js API route (`/api/ai/assist/route.ts`) interacts with the Gemini API and returns structured feedback.

## 2. Initialization

AI is initialized on the server side using the `@google/genai` library. The system requires an environment variable `GEMINI_API_KEY`.

### Server-Side Initialization
In [app/api/ai/assist/route.ts](file:///Users/alan/Documents/Private%20projects/d-rec/app/api/ai/assist/route.ts):

```typescript
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  // ... check API key
  const ai = new GoogleGenAI({ apiKey });
  // ...
}
```

## 3. Implementation Details

### Central API Route: `/api/ai/assist`
This route handles all AI requests. It utilizes "mode-based" logic to distinguish between reviewing an **algorithm** (plain text) or **source code**.

### Prompt Engineering
The system uses "Persona-based" prompting to ensure the AI acts as a "strict but helpful computer science teaching assistant."

#### Example: Algorithm Review Prompt
```typescript
prompt = `You are a strict but helpful computer science teaching assistant. Review the following student's algorithm for solving the problem. 
Do NOT write code for them. Provide constructive feedback, highlighting missing edge cases, time/space complexity issues, or logical flaws. 
If the algorithm is perfect, explicitly state "APPROVED" at the very beginning of your response.
Keep it short, clear and concise.`;
```

## 4. Response Handling

### Backend Processing
The backend calls `ai.models.generateContent` and returns the text response as a JSON object.

```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash", // Utilizes the high-performance flash model
  contents: prompt,
});

return NextResponse.json({
  feedback: response.text || "No feedback generated.",
});
```

### Frontend Implementation
The frontend handles loading states and displays the suggestion in a dedicated UI card.

#### Student Side ([app/[orgId]/student/questions/[id]/algorithm/page.tsx](file:///Users/alan/Documents/Private%20projects/d-rec/app/%5BorgId%5D/student/questions/%5Bid%5D/algorithm/page.tsx))
```typescript
const handleGetAiHelp = async () => {
  setIsAiLoading(true);
  try {
    const response = await fetch("/api/ai/assist", {
      method: "POST",
      body: JSON.stringify({ mode: "algorithm", algorithm, description: questionText }),
    });
    const data = await response.json();
    setAiSuggestion(data.feedback);
  } finally {
    setIsAiLoading(false);
  }
};
```

#### Teacher Side ([app/[orgId]/teacher/reviews/[programId]/[studentId]/page.tsx](file:///Users/alan/Documents/Private%20projects/d-rec/app/%5BorgId%5D/teacher/reviews/%5BprogramId%5D/%5BstudentId%5D/page.tsx))
Teachers can also trigger the AI to get a "second opinion" on student work before manually approving or rejecting it.

```typescript
const handleGetAIFeedback = async (mode: "algorithm" | "code") => {
  setIsGettingFeedback(true);
  const response = await fetch("/api/ai/assist", { ... });
  const data = await response.json();
  setAiFeedback(data.feedback);
  setIsGettingFeedback(false);
};
```

## 5. Summary of AI Features
- **Algorithm Hinting**: Helps students improve their logic without giving away the final answer.
- **Code Review**: Points out syntax and logic errors in the code editor.
- **Teacher Assistant**: Provides quick analysis for educators during grading.
