"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function TeamLeadSettingsPage() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">
                <DashboardHeader title="Settings" />
                <main className="p-6 max-w-4xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue="Team Lead" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue="team@example.com" disabled />
                                </div>
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your email notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="new-candidates">New Candidate Alerts</Label>
                                <Switch id="new-candidates" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="interview-reminders">Interview Reminders</Label>
                                <Switch id="interview-reminders" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="marketing">Marketing Emails</Label>
                                <Switch id="marketing" />
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
