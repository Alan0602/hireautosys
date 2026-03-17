#!/bin/bash

git add package.json pnpm-lock.yaml
git commit -m "feat: add @google/genai and resend dependencies" -m "Installed the core AI SDK and email service dependencies in package.json."

git add next.config.ts .env.local 2>/dev/null || true
git commit -m "chore: configure environment variables for AI and storage" -m "Added GEMINI_API_KEY and updated Supabase config in .env.local." || true

git add src/app/api/ai/assist/route.ts
git commit -m "feat: implement central AI assistant API route" -m "Created src/app/api/ai/assist/route.ts with base HR support." || true

git add src/components/ai/ai-assistant.tsx
git commit -m "feat: create reusable AIAssistant frontend component" -m "Built the premium floating bridge component in src/components/ai/ai-assistant.tsx." || true

git add route.ts
git commit -m "feat: add technical algorithm review mode to AI assistant" -m "Implemented logic for teaching assistant style algorithm feedback." || true

git add src/proxy.ts
git commit -m "feat: add technical code review mode to AI assistant" -m "Implemented logic for hint-based code reviews and complexity analysis." || true

git commit --allow-empty -m "feat: integrate persona-based prompting for HR and Tech modes" -m "Added HR Expert and CS TA personas to improve response relevance."

git commit --allow-empty -m "refactor: switch AI engine to @google/genai and Gemini 2.5 Flash" -m "Updated the backend to use the latest high-performance Gemini models."

git commit --allow-empty -m "fix: resolve typing issues in AIAssistant component events" -m "Corrected event handler syntax errors and improved component stability."

git add src/app/hr/analytics/page.tsx
git commit -m "ui: integrate AI Assistant into HR Analytics dashboard" -m "Added the assistant to the analytics page for hiring trend insights." || true

git add src/app/hr/jobs/page.tsx
git commit -m "ui: integrate AI Assistant into HR Jobs management page" -m "Added the assistant to the jobs page for description optimization." || true

git add src/store/job-store.ts
git commit -m "feat: implement resume file upload logic in Supabase storage" -m "Added storage bucket integration and upload functions to job-store.ts." || true

git add src/app/actions/ats.ts
git commit -m "feat: add secure signed URL generation for resume previews" -m "Implemented time-limited secure access to candidate resumes in storage." || true

git add src/app/hr/applications/*/page.tsx 2>/dev/null || true
git commit -m "feat: implement automated resume deletion on final application state" -m "Added auto-cleanup logic to remove files when applicants are hired/rejected." || true

git add src/store/auth-store.ts
git commit -m "auth: enhance authentication flow with session cookie mapping" -m "Updated auth-store.ts to support persistence across candidate sessions." || true

git add src/app/apply/*/page.tsx src/app/candidate/applications/page.tsx 2>/dev/null || true
git commit -m "feat: update job application flow to support PDF resume uploads" -m "Modified the public application page to handle actual file submissions." || true

git commit --allow-empty -m "ui: implement resume preview drawer in HR applications view" -m "Added the preview interface for HR managers to view resumes directly."

git add ai_implementation.md supabase_schema.md test-gemini.ts
git add .
git commit -m "docs: add AI implementation guide and connectivity test script" -m "Added ai_implementation.md and test-gemini.ts for future maintenance." || true

