"use client"

import GenericDashboardContent from "@/components/dashboard/generic-content"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function CandidateProfilePage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">
                <DashboardHeader title="My Profile" />
                <GenericDashboardContent
                    title="Candidate Profile"
                    description="Manage your personal information, resume, and skills."
                />
            </div>
        </div>
    )
}
