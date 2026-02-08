"use client"

import GenericDashboardContent from "@/components/dashboard/generic-content"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function CandidateApplicationsPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole="candidate" />
            <div className="flex-1">
                <DashboardHeader title="My Applications" />
                <GenericDashboardContent
                    title="Applications History"
                    description="Track the status of all your job applications."
                />
            </div>
        </div>
    )
}
