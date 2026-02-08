"use client"

import * as React from "react"
import { Briefcase, Users, UserCheck, Clock } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function HRDashboard() {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole="hr" />

            <div className="flex-1">
                <DashboardHeader
                    title="HR Dashboard"
                    subtitle="Welcome back! Here's what's happening with your hiring."
                />

                <main className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Active Jobs"
                            value={12}
                            change={{ value: 8, type: "increase" }}
                            icon={<Briefcase className="h-5 w-5 text-primary" />}
                            iconColor="bg-primary/10"
                        />
                        <StatCard
                            title="Total Applications"
                            value={256}
                            change={{ value: 12, type: "increase" }}
                            icon={<Users className="h-5 w-5 text-accent-3" />}
                            iconColor="bg-accent-3/10"
                        />
                        <StatCard
                            title="Candidates Hired"
                            value={18}
                            change={{ value: 5, type: "increase" }}
                            icon={<UserCheck className="h-5 w-5 text-success" />}
                            iconColor="bg-success/10"
                        />
                        <StatCard
                            title="Avg. Time to Hire"
                            value="14 days"
                            change={{ value: -15, type: "decrease" }}
                            icon={<Clock className="h-5 w-5 text-accent-4" />}
                            iconColor="bg-accent-4/10"
                        />
                    </div>

                    {/* Recent Applications */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Applications</CardTitle>
                                    <CardDescription>Latest candidate applications across all jobs</CardDescription>
                                </div>
                                <Button variant="outline">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { name: "Sarah Johnson", position: "Senior Frontend Developer", score: 92, status: "pending" },
                                    { name: "Michael Chen", position: "Product Manager", score: 88, status: "reviewing" },
                                    { name: "Emily Davis", position: "UX Designer", score: 85, status: "approved" },
                                    { name: "James Wilson", position: "Backend Engineer", score: 78, status: "pending" },
                                    { name: "Anna Martinez", position: "Data Scientist", score: 95, status: "approved" },
                                ].map((application, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {application.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{application.name}</p>
                                                <p className="text-sm text-muted-foreground">{application.position}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium">Match Score</p>
                                                <Progress value={application.score} className="w-24 mt-1" size="sm" />
                                            </div>
                                            <Badge
                                                variant={
                                                    application.status === "approved" ? "success" :
                                                        application.status === "reviewing" ? "warning" :
                                                            "secondary"
                                                }
                                            >
                                                {application.status}
                                            </Badge>
                                            <Button size="sm" variant="outline">Review</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions & Stats */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Jobs</CardTitle>
                                <CardDescription>Jobs with highest applicant quality</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { title: "Senior Frontend Developer", applicants: 45, avgScore: 84 },
                                    { title: "Product Manager", applicants: 38, avgScore: 82 },
                                    { title: "Data Scientist", applicants: 29, avgScore: 88 },
                                ].map((job, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-sm text-muted-foreground">{job.applicants} applicants</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-primary">{job.avgScore}%</p>
                                            <p className="text-xs text-muted-foreground">Avg Score</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Application Pipeline</CardTitle>
                                <CardDescription>Current stage distribution</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { stage: "Applied", count: 124, color: "bg-neutral-400" },
                                    { stage: "Screening", count: 68, color: "bg-primary" },
                                    { stage: "Interview", count: 34, color: "bg-accent-3" },
                                    { stage: "Offer", count: 12, color: "bg-success" },
                                ].map((stage, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{stage.stage}</span>
                                            <span className="text-muted-foreground">{stage.count}</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all", stage.color)}
                                                style={{ width: `${(stage.count / 124) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
