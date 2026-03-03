#!/bin/bash

# 1. Initial project configuration and dependencies
git add .gitignore README.md package.json pnpm-lock.yaml tsconfig.json next.config.ts eslint.config.mjs postcss.config.mjs pnpm-workspace.yaml
git commit -m "Initial project configuration and dependencies"

# 2. Add public assets and SVGs
git add public/
git commit -m "Add public assets and SVGs"

# 3. Add utility functions and helper hooks
git add src/lib/utils.ts
git commit -m "Add utility functions and helper hooks"

# 4. Add global styles and design tokens
git add src/app/globals.css
git commit -m "Add global styles and design tokens"

# 5. Add root layout and provider setup
git add src/app/layout.tsx src/app/providers.tsx
git commit -m "Add root layout and provider setup"

# 6. Add Button and dynamic list components
git add src/components/ui/button.tsx src/components/ui/dynamic-list.tsx
git commit -m "Add Button and dynamic list components"

# 7. Add Input and label components
git add src/components/ui/input.tsx src/components/ui/label.tsx
git commit -m "Add Input and label components"

# 8. Add Card and status badge components
git add src/components/ui/card.tsx src/components/ui/badge.tsx
git commit -m "Add Card and status badge components"

# 9. Add Progress and scroll area components
git add src/components/ui/progress.tsx src/components/ui/scroll-area.tsx
git commit -m "Add Progress and scroll area components"

# 10. Add Dialog and modal components
git add src/components/ui/dialog.tsx src/components/ui/modal.tsx
git commit -m "Add Dialog and modal components"

# 11. Add Select and switch components
git add src/components/ui/select.tsx src/components/ui/switch.tsx
git commit -m "Add Select and switch components"

# 12. Add Tabs and stepper components
git add src/components/ui/tabs.tsx src/components/ui/wizard-stepper.tsx
git commit -m "Add Tabs and stepper components"

# 13. Add Sonner notification provider
git add src/components/ui/sonner.tsx
git commit -m "Add Sonner notification provider"

# 14. Add File Upload with drag-and-drop
git add src/components/ui/file-upload.tsx
git commit -m "Add File Upload with drag-and-drop"

# 15. Add Theme Provider and toggle
git add src/components/theme-provider.tsx src/components/shared/theme-toggle.tsx
git commit -m "Add Theme Provider and toggle"

# 16. Add Stat Card with dashboard metrics
git add src/components/dashboard/stat-card.tsx
git commit -m "Add Stat Card with dashboard metrics"

# 17. Add Dashboard Header with user controls
git add src/components/dashboard/header.tsx
git commit -m "Add Dashboard Header with user controls"

# 18. Add Sidebar with role-based navigation
git add src/components/dashboard/sidebar.tsx
git commit -m "Add Sidebar with role-based navigation"

# 19. Add Admin Sidebar component
git add src/components/dashboard/admin-sidebar.tsx
git commit -m "Add Admin Sidebar component"

# 20. Add Generic Dashboard Content template
git add src/components/dashboard/generic-content.tsx
git commit -m "Add Generic Dashboard Content template"

# 21. Add Auth and Role guards
git add src/components/auth-guard.tsx src/components/auth/role-guard.tsx
git commit -m "Add Auth and Role guards"

# 22. Add Landing Page with glassmorphic sections
git add src/app/page.tsx
git commit -m "Add Landing Page with glassmorphic sections"

# 23. Add Login Page with split layout
git add src/app/login/page.tsx
git commit -m "Add Login Page with split layout"

# 24. Add UI Component Showcase page
git add src/app/components/page.tsx
git commit -m "Add UI Component Showcase page"

# 25. Add Setup and initialization page
git add src/app/setup/page.tsx
git commit -m "Add Setup and initialization page"

# 26. Add ATS scoring server-side actions
git add src/app/actions/ats.ts
git commit -m "Add ATS scoring server-side actions"

# 27. Add HR Dashboard main overview
git add src/app/hr/dashboard/page.tsx
git commit -m "Add HR Dashboard main overview"

# 28. Add HR Job management and listing
git add src/app/hr/jobs/page.tsx
git commit -m "Add HR Job management and listing"

# 29. Add HR Create new job workflow
git add src/app/hr/jobs/new/page.tsx
git commit -m "Add HR Create new job workflow"

# 30. Add HR Job detail and application views
git add src/app/hr/jobs/[id]/page.tsx src/app/hr/jobs/[id]/applications/page.tsx
git commit -m "Add HR Job detail and application views"

# 31. Add HR Candidates database interface
git add src/app/hr/candidates/page.tsx
git commit -m "Add HR Candidates database interface"

# 32. Add HR Application processing and reviews
git add src/app/hr/applications/page.tsx src/app/hr/applications/[id]/page.tsx
git commit -m "Add HR Application processing and reviews"

# 33. Add HR Analytics and performance metrics
git add src/app/hr/analytics/page.tsx
git commit -m "Add HR Analytics and performance metrics"

# 34. Add HR Settings and preferences
git add src/app/hr/settings/page.tsx
git commit -m "Add HR Settings and preferences"

# 35. Add HR Shared layout container
git add src/app/hr/layout.tsx
git commit -m "Add HR Shared layout container"

# 36. Add Candidate Dashboard main page
git add src/app/candidate/dashboard/page.tsx
git commit -m "Add Candidate Dashboard main page"

# 37. Add Candidate Application tracking
git add src/app/candidate/applications/page.tsx
git commit -m "Add Candidate Application tracking"

# 38. Add Candidate Resume analysis results
git add src/app/candidate/analysis/page.tsx
git commit -m "Add Candidate Resume analysis results"

# 39. Add Candidate Profile management
git add src/app/candidate/profile/page.tsx
git commit -m "Add Candidate Profile management"

# 40. Add Candidate Settings and security
git add src/app/candidate/settings/page.tsx
git commit -m "Add Candidate Settings and security"

# 41. Add Candidate Shared layout container
git add src/app/candidate/layout.tsx
git commit -m "Add Candidate Shared layout container"

# 42. Add Public Job application page
git add src/app/apply/[slug]/page.tsx
git commit -m "Add Public Job application page"

# 43. Add Team Lead Dashboard overview
git add src/app/team-lead/dashboard/page.tsx
git commit -m "Add Team Lead Dashboard overview"

# 44. Add Team Lead Application review
git add src/app/team-lead/review/page.tsx
git commit -m "Add Team Lead Application review"

# 45. Add Team Lead Settings page
git add src/app/team-lead/settings/page.tsx
git commit -m "Add Team Lead Settings page"

# 46. Add Team Lead Shared layout
git add src/app/team-lead/layout.tsx
git commit -m "Add Team Lead Shared layout"

# 47. Add Admin Management dashboard
git add src/app/admin/dashboard/page.tsx src/app/admin/layout.tsx
git commit -m "Add Admin Management dashboard"

# 48. Add Admin Application and User management
git add src/app/admin/applications/page.tsx src/app/admin/add-hr/page.tsx
git commit -m "Add Admin Application and User management"

# 49. Add State Management with Zustand stores
git add src/store/auth-store.ts src/store/job-store.ts src/store/useUserStore.ts
git commit -m "Add State Management with Zustand stores"

# 50. Finalize core utilities and types
git add src/lib/ats-scoring.ts src/lib/supabase.ts src/types/index.ts
git add .
git commit -m "Finalize core utilities and types"
