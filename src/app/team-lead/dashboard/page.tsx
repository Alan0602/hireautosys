"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useJobStore } from "@/store/job-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, CheckCircle, Clock } from "lucide-react"

export default function TeamLeadDashboard() {
    const { applications, jobs, updateApplicationStatus } = useJobStore()

    // Mock filtering for team lead
    // In real app, we would filter by jobs assigned to this team lead.
    // For now, show all.
    const pendingReviews = applications.filter(a => a.status === 'hr_approve').length
    const interviewed = applications.filter(a => a.status === 'ready_for_checkin').length

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">
                <DashboardHeader
                    title="Team Lead Dashboard"
                    subtitle="Manage your team's hiring pipeline and reviews."
                />

                <main className="p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingReviews}</div>
                                <p className="text-xs text-muted-foreground">Candidates awaiting screen</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{interviewed}</div>
                                <p className="text-xs text-muted-foreground">Scheduled this week</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{jobs.length}</div>
                                <p className="text-xs text-muted-foreground">Open requisitions</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Hired</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{applications.filter(a => a.status === 'hired').length}</div>
                                <p className="text-xs text-muted-foreground">This quarter</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pending Reviews List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Candidates for Review</CardTitle>
                            <CardDescription>Candidates passed ATS screening</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {applications.filter(a => a.status === 'hr_approve').slice(0, 5).map(app => {
                                    const job = jobs.find(j => j.id === app.jobId)
                                    return (
                                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">{app.candidateName}</p>
                                                <p className="text-sm text-muted-foreground">{job?.title}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant="outline">{app.status.replace('_', ' ')}</Badge>
                                                <Button size="sm" onClick={() => updateApplicationStatus(app.id, 'teamlead_approve')}>Approve</Button>
                                            </div>
                                        </div>
                                    )
                                })}
                                {applications.length === 0 && <p className="text-muted-foreground text-center py-4">No pending candidates.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
