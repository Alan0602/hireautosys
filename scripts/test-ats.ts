/**
 * ATS Scoring Test Suite
 * Tests 10 resume/job combinations against the Gemini AI scoring engine.
 *
 * Usage: pnpm test:ats
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Inline the core AI analysis to avoid "use server" import issues ──────────

interface ATSResult {
    score: number;
    skillsFound: string[];
    missingSkills: string[];
    tips: string[];
    summary: string;
    status: "High Match" | "Medium Match" | "Low Match";
    semanticAnalysis: string;
    projects: { title: string; description: string; technologies?: string[] }[];
}

function sanitizeForPrompt(input: string, maxLength = 8000): string {
    return input
        .replace(/[`${}\\\<\>]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, maxLength);
}

async function analyzeApplicationAI(
    requiredSkills: string[],
    resumeText: string
): Promise<ATSResult> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY not found in .env.local");

    const safeResumeText = sanitizeForPrompt(resumeText, 8000);
    const safeSkills = requiredSkills
        .slice(0, 30)
        .map((s) => sanitizeForPrompt(s, 50))
        .filter((s) => s.length > 0);

    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
    let lastError: any = null;

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
          "semanticAnalysis": string (A thoughtful paragraph analyzing the context),
          "projects": [ { "title": string, "description": string, "technologies": string[] } ]
        }
    `;

    for (const modelName of modelsToTry) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" },
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return JSON.parse(text) as ATSResult;
        } catch (error: any) {
            lastError = error;
            const isRateLimited =
                error.status === 429 || error.message?.includes("429") || error.message?.includes("quota");
            const isNotFound = error.status === 404 || error.message?.includes("not found");
            if (isRateLimited || isNotFound) {
                console.warn(`  ⚠ Model ${modelName} failed (${error.status ?? "quota"}), trying next...`);
                await new Promise((res) => setTimeout(res, 1000));
                continue;
            }
            throw error;
        }
    }
    throw lastError || new Error("All AI models failed");
}

// ── Test Data ────────────────────────────────────────────────────────────────

type ExpectedLevel = "HIGH" | "MEDIUM" | "LOW";

interface TestCase {
    resumeName: string;
    jobTitle: string;
    skills: string[];
    resumeText: string;
    expectedLevel: ExpectedLevel;
}

const REACT_SKILLS = ["React", "TypeScript", "Redux", "Jest", "Node.js", "REST APIs", "Git", "Tailwind CSS"];
const ML_SKILLS = ["Python", "PyTorch", "scikit-learn", "NLP", "Docker", "FastAPI", "SQL", "Hugging Face"];
const FULLSTACK_SKILLS = ["React", "Node.js", "Express", "PostgreSQL", "Docker", "AWS", "TypeScript", "Redis"];
const DEVOPS_SKILLS = ["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins", "Linux", "Python", "Ansible"];
const DATA_SKILLS = ["SQL", "Python", "Tableau", "Excel", "Pandas", "Statistics", "Power BI", "Google Analytics"];

const TEST_CASES: TestCase[] = [
    {
        resumeName: "Arjun Sharma",
        jobTitle: "Senior React Developer",
        skills: REACT_SKILLS,
        resumeText: "Arjun Sharma, 4 years experience. Skills: React, TypeScript, Redux, Jest, Node.js, REST APIs, Git, Tailwind CSS. Led React frontend at Infosys. Built TypeScript dashboards. Unit testing with Jest. Redux state management.",
        expectedLevel: "HIGH",
    },
    {
        resumeName: "Priya Nair",
        jobTitle: "Senior React Developer",
        skills: REACT_SKILLS,
        resumeText: "Priya Nair, 2 years experience. Skills: React, JavaScript, HTML, CSS, Bootstrap. Built React components. No TypeScript experience. No Redux.",
        expectedLevel: "MEDIUM",
    },
    {
        resumeName: "Rahul Das",
        jobTitle: "Senior React Developer",
        skills: REACT_SKILLS,
        resumeText: "Rahul Das, 3 years experience. Skills: Java, Spring Boot, MySQL, Hibernate. Backend Java developer. No frontend experience.",
        expectedLevel: "LOW",
    },
    {
        resumeName: "Meera Iyer",
        jobTitle: "Python ML Engineer",
        skills: ML_SKILLS,
        resumeText: "Meera Iyer, 3 years ML Engineer. Skills: Python, PyTorch, scikit-learn, NLP, Docker, FastAPI, SQL, Hugging Face. Built NLP models. Deployed FastAPI services.",
        expectedLevel: "HIGH",
    },
    {
        resumeName: "Sanjay Krishnan",
        jobTitle: "Python ML Engineer",
        skills: ML_SKILLS,
        resumeText: "Sanjay Krishnan, 2 years. Skills: Python, TensorFlow, NumPy, Pandas. Academic ML projects. No NLP, Docker, FastAPI, Hugging Face.",
        expectedLevel: "MEDIUM",
    },
    {
        resumeName: "Aisha Khan",
        jobTitle: "Full Stack Engineer",
        skills: FULLSTACK_SKILLS,
        resumeText: "Aisha Khan, 3 years full stack. Skills: React, Node.js, Express, PostgreSQL, Docker, AWS, TypeScript, Redis. Microservices architecture.",
        expectedLevel: "HIGH",
    },
    {
        resumeName: "Vikram Patel",
        jobTitle: "Full Stack Engineer",
        skills: FULLSTACK_SKILLS,
        resumeText: "Vikram Patel, 4 years PHP developer. Skills: PHP, Laravel, MySQL, jQuery. No React, Node, Docker, AWS.",
        expectedLevel: "LOW",
    },
    {
        resumeName: "Deepa Suresh",
        jobTitle: "DevOps Engineer",
        skills: DEVOPS_SKILLS,
        resumeText: "Deepa Suresh, 5 years DevOps. Skills: Kubernetes, Docker, AWS, Terraform, Jenkins, Linux, Python, Ansible. Managed K8s on EKS.",
        expectedLevel: "HIGH",
    },
    {
        resumeName: "Karthik Raj",
        jobTitle: "Data Analyst",
        skills: DATA_SKILLS,
        resumeText: "Karthik Raj, 3 years analyst. Skills: SQL, Python, Tableau, Excel, Pandas, Power BI, Google Analytics. Built KPI dashboards.",
        expectedLevel: "HIGH",
    },
    {
        resumeName: "Shreya Menon",
        jobTitle: "Data Analyst",
        skills: DATA_SKILLS,
        resumeText: "Shreya Menon, 2 years business analyst. Skills: Excel, PowerPoint, basic SQL. No Python, Tableau, Power BI.",
        expectedLevel: "LOW",
    },
];

// ── Pass/Fail logic ─────────────────────────────────────────────────────────

function didPass(expected: ExpectedLevel, score: number): boolean {
    switch (expected) {
        case "HIGH":
            return score >= 70;
        case "MEDIUM":
            return score >= 40 && score <= 79;
        case "LOW":
            return score < 50;
    }
}

// ── Runner ───────────────────────────────────────────────────────────────────

interface TestResult {
    index: number;
    name: string;
    job: string;
    expected: ExpectedLevel;
    score: number;
    status: string;
    skillsFound: number;
    missingSkills: number;
    passed: boolean;
    error?: string;
}

async function main() {
    console.log("\n🔬 HireScope ATS Scoring — Automated Test Suite");
    console.log("━".repeat(100));
    console.log(`Running ${TEST_CASES.length} test cases against the Gemini AI scoring engine...\n`);

    const results: TestResult[] = [];

    for (let i = 0; i < TEST_CASES.length; i++) {
        const tc = TEST_CASES[i];
        const label = `[${i + 1}/${TEST_CASES.length}] ${tc.resumeName} → ${tc.jobTitle}`;
        process.stdout.write(`  ⏳ ${label}...`);

        try {
            const ats = await analyzeApplicationAI(tc.skills, tc.resumeText);
            const passed = didPass(tc.expectedLevel, ats.score);

            results.push({
                index: i + 1,
                name: tc.resumeName,
                job: tc.jobTitle,
                expected: tc.expectedLevel,
                score: ats.score,
                status: ats.status,
                skillsFound: ats.skillsFound.length,
                missingSkills: ats.missingSkills.length,
                passed,
            });

            console.log(` ${passed ? "✅" : "❌"} Score: ${ats.score}%`);
        } catch (err: any) {
            results.push({
                index: i + 1,
                name: tc.resumeName,
                job: tc.jobTitle,
                expected: tc.expectedLevel,
                score: -1,
                status: "ERROR",
                skillsFound: 0,
                missingSkills: 0,
                passed: false,
                error: err.message,
            });

            console.log(` 💥 ERROR: ${err.message}`);
        }

        // Small delay to avoid rate-limiting between calls
        if (i < TEST_CASES.length - 1) {
            await new Promise((r) => setTimeout(r, 1500));
        }
    }

    // ── Results Table ───────────────────────────────────────────────────────

    console.log("\n" + "━".repeat(120));
    console.log("📊 RESULTS TABLE");
    console.log("━".repeat(120));

    const header = [
        "#".padStart(3),
        "Name".padEnd(18),
        "Job".padEnd(24),
        "Expected".padEnd(10),
        "AI Score".padEnd(10),
        "Status".padEnd(14),
        "Found".padEnd(7),
        "Missing".padEnd(9),
        "Result".padEnd(6),
    ].join(" | ");

    console.log(header);
    console.log("─".repeat(120));

    for (const r of results) {
        const row = [
            String(r.index).padStart(3),
            r.name.padEnd(18),
            r.job.padEnd(24),
            r.expected.padEnd(10),
            (r.score >= 0 ? `${r.score}%` : "ERR").padEnd(10),
            r.status.padEnd(14),
            String(r.skillsFound).padEnd(7),
            String(r.missingSkills).padEnd(9),
            (r.passed ? "✅ PASS" : "❌ FAIL").padEnd(6),
        ].join(" | ");
        console.log(row);
    }

    // ── Summary ─────────────────────────────────────────────────────────────

    console.log("\n" + "━".repeat(80));
    console.log("📈 SUMMARY");
    console.log("━".repeat(80));

    const passedCount = results.filter((r) => r.passed).length;
    const validResults = results.filter((r) => r.score >= 0);
    const avgScore = validResults.length > 0
        ? Math.round(validResults.reduce((s, r) => s + r.score, 0) / validResults.length)
        : 0;

    console.log(`  Total:    ${passedCount}/${results.length} passed`);
    console.log(`  Avg Score: ${avgScore}%`);

    // Per-expected-level averages
    for (const level of ["HIGH", "MEDIUM", "LOW"] as ExpectedLevel[]) {
        const group = validResults.filter((r) => r.expected === level);
        if (group.length > 0) {
            const levelAvg = Math.round(group.reduce((s, r) => s + r.score, 0) / group.length);
            const levelPassed = group.filter((r) => r.passed).length;
            console.log(`  ${level.padEnd(8)}: avg ${levelAvg}%, ${levelPassed}/${group.length} passed`);
        }
    }

    console.log("\n" + (passedCount === results.length ? "🎉 All tests passed!" : "⚠️  Some tests failed.") + "\n");

    process.exit(passedCount === results.length ? 0 : 1);
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
