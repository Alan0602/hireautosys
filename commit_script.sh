#!/bin/bash

# Configuration and Base
git add .gitignore README.md package.json pnpm-lock.yaml tsconfig.json next.config.ts eslint.config.mjs postcss.config.mjs pnpm-workspace.yaml
git commit -m "Initial project configuration and dependencies"

# Assets
git add public/
git commit -m "Add public assets and SVGs"

# Utilities
git add src/lib/utils.ts
git commit -m "Add utility functions and cn helper"

# Global Styles & Layout
git add src/app/globals.css
git commit -m "Add global styles with glassmorphism design system"

git add src/app/layout.tsx
git commit -m "Add root layout with font configuration and ThemeProvider"

# UI Components (Individual commits)
git add src/components/ui/button.tsx
git commit -m "Add Button component with variants"

git add src/components/ui/input.tsx
git commit -m "Add Input component with password visibility toggle"

git add src/components/ui/label.tsx
git commit -m "Add Label component"

git add src/components/ui/card.tsx
git commit -m "Add Card component with glass variant"

git add src/components/ui/badge.tsx
git commit -m "Add Badge component with variants"

git add src/components/ui/progress.tsx
git commit -m "Add Progress component with color coding"

# Note: Dialog involves multiple files depending on implementation, assuming standard shadcn-like structure or just one file
git add src/components/ui/dialog.tsx
git commit -m "Add Dialog component for modals"

git add src/components/ui/file-upload.tsx
git commit -m "Add File Upload component with drag and drop"

# Theme Components
git add src/components/theme-provider.tsx
git commit -m "Add Theme Provider context"

git add src/components/shared/theme-toggle.tsx
git commit -m "Add Theme Toggle component"

# Dashboard Components
git add src/components/dashboard/stat-card.tsx
git commit -m "Add Stat Card component with trend indicators"

git add src/components/dashboard/header.tsx
git commit -m "Add Dashboard Header component"

git add src/components/dashboard/sidebar.tsx
git commit -m "Add Dashboard Sidebar with glass effect and role-based navigation"

git add src/components/dashboard/generic-content.tsx
git commit -m "Add Generic Dashboard Content component"
# Check if generic-page exists, otherwise skip
if [ -f "src/components/dashboard/generic-page.tsx" ]; then
    git add src/components/dashboard/generic-page.tsx
    git commit -m "Add Generic Dashboard Page template"
fi

# Landing Page
git add src/app/page.tsx
git commit -m "Add Landing Page with hero section and glassmorphic UI"

# Auth Pages
git add src/app/login/page.tsx
git commit -m "Add Login Page with split layout design"

# Component Showcase
git add src/app/components/page.tsx
git commit -m "Add Component Showcase page for testing UI elements"

# Dashboard Pages - HR
git add src/app/hr/dashboard/page.tsx
git commit -m "Add HR Dashboard main page"

git add src/app/hr/jobs/page.tsx
git commit -m "Add HR Jobs management page"

git add src/app/hr/candidates/page.tsx
git commit -m "Add HR Candidates database page"

git add src/app/hr/analytics/page.tsx
git commit -m "Add HR Analytics page"

git add src/app/hr/settings/page.tsx
git commit -m "Add HR Settings page"

# Dashboard Pages - Candidate
git add src/app/candidate/dashboard/page.tsx
git commit -m "Add Candidate Dashboard main page"

git add src/app/candidate/applications/page.tsx
git commit -m "Add Candidate Applications history page"

git add src/app/candidate/profile/page.tsx
git commit -m "Add Candidate Profile management page"

git add src/app/candidate/settings/page.tsx
git commit -m "Add Candidate Settings page"

# Catch all remaining
git add .
git commit -m "Add remaining project files and configurations"

# Push
git push origin main
