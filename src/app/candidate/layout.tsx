"use client"

import { RoleGuard } from "@/components/auth/role-guard"

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRoles={["candidate"]}>
            {children}
        </RoleGuard>
    )
}
