"use client"

import GenericDashboardContent from "@/components/dashboard/generic-content"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function CandidateSettingsPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">
                <DashboardHeader title="Settings" />
                <GenericDashboardContent
                    title="Account Settings"
                    description="Manage your notification preferences and account security."
                />
            </div>
        </div>
    )
}
