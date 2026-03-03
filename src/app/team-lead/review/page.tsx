"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import GenericDashboardContent from "@/components/dashboard/generic-content"

export default function TeamLeadReviewPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">
                <DashboardHeader title="Review Queue" />
                <GenericDashboardContent
                    title="Pending Reviews"
                    description="Candidates awaiting your technical evaluation."
                />
            </div>
        </div>
    )
}
