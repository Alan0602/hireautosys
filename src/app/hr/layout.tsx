"use client"

import { AuthGuard } from "@/components/auth-guard"

export default function HRLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={["hr"]}>
            {children}
        </AuthGuard>
    )
}
