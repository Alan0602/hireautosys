# HireScope (hireautosys) 🚀

HireScope is an AI-powered Applicant Tracking System (ATS) built to streamline the hiring process with intelligent candidate matching, resume parsing, and role-based access control.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage)
- **AI Integration**: [Google Generative AI](https://ai.google.dev/) (Gemini 2.5 Flash)
- **Styling**: Tailwind CSS + Radix UI Primitives
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

## 👥 User Roles

The platform supports multiple user roles, each with tailored UI and permissions:

1. **Admin**: Manages organizations, overall users, and platform-wide settings.
2. **HR**: Creates and manages job postings, reviews candidates, bulk-uploads resumes, and configures ATS thresholds.
3. **Team Lead**: Collaborates with HR to review short-listed applications and provide specific feedback. 
4. **Applicant / Candidate**: Applies to jobs, uploads resumes, rounds of interviews, and tracks application status.

## 🧠 Core AI Features

The platform leverages Gemini 2.5 Flash (`@google/genai`) to automate heavy-lifting HR tasks:

- **Resume Analysis & Scoring**: AI analyzes uploaded resumes against job requirements, providing a match score (0-100), missing skills, found skills, and a semantic analysis of candidate fit.
- **Job Description Generation**: AI assists HR in drafting or improving clear, detailed job descriptions and requirements.
- **General HR Help**: Available conversational AI for handling various HR-related queries.

*Note: The AI endpoint handles requests centrally at `/api/ai/assist/route.ts` with rate-limiting and persona-based system prompts.*

## 🔄 Functional Flow

1. **Job Creation**: HR logs in, specifies job requirements, and uses AI assistance to finalize the job posting.
2. **Application**: Candidates view active jobs and apply by uploading their resumes.
3. **AI Processing**: 
   - The system sends the candidate's resume text and job requirements to the Gemini AI.
   - The AI generates a structured JSON payload containing an `ats_score`, `skillsFound`, `missingSkills`, and `status` (High/Medium/Low Match).
4. **Review**:
   - HR views a dashboard of applicants sorted by their AI-generated `ats_score`.
   - Team Leads can review and leave `comments` on highly-scored candidates.
5. **Decision**: The application `status` is updated through stages (e.g., pending, interviewing, hired, rejected) by HR.

## 🗄️ Database Architecture (Supabase)

The core entities revolve around standard relations:
- `organisations` - Companies using the platform.
- `users` - All authenticated personnel, mapping to roles.
- `jobs` - Published positions with requirements, responsibilities, and an `ats_threshold`.
- `applications` - Links a candidate (`candidate_id`) to a job (`job_id`), storing the `resume_url`, `ats_score`, `ats_result` (JSON feedback from Gemini), and current `status`.

## 🚀 Getting Started

First, ensure you have set up your `.env.local` variables. You will need:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`)

Then, run the development server:

```bash
npm install
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
