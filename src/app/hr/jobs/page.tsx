"use client"

import GenericDashboardContent from "@/components/dashboard/generic-content"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function HRJobsPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole="hr" />
            <div className="flex-1">
                <DashboardHeader title="Jobs Management" />
                <GenericDashboardContent
                    title="Jobs"
                    description="Manage your job postings and requirements."
                />
            </div>
        </div>
    )
}
