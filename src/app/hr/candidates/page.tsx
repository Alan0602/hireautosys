"use client"

import GenericDashboardContent from "@/components/dashboard/generic-content"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function HRCandidatesPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">
                <DashboardHeader title="Candidates" />
                <GenericDashboardContent
                    title="Candidates Database"
                    description="Search and filter through your candidate pool."
                />
            </div>
        </div>
    )
}
