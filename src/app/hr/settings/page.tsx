"use client"

import GenericDashboardContent from "@/components/dashboard/generic-content"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function HRSettingsPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole="hr" />
            <div className="flex-1">
                <DashboardHeader title="Settings" />
                <GenericDashboardContent
                    title="HR Settings"
                    description="Configure your hiring preferences and account settings."
                />
            </div>
        </div>
    )
}
