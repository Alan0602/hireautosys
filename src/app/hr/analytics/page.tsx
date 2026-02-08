"use client"

import GenericDashboardContent from "@/components/dashboard/generic-content"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function HRAnalyticsPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole="hr" />
            <div className="flex-1">
                <DashboardHeader title="Analytics" />
                <GenericDashboardContent
                    title="Hiring Analytics"
                    description="View detailed reports and insights about your hiring process."
                />
            </div>
        </div>
    )
}
