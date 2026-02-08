"use client"

import * as React from "react"
import { Upload, Briefcase, TrendingUp, FileText, CheckCircle, Clock, XCircle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function CandidateDashboard() {
    const profileCompletion = 75

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar userRole="candidate" />

            <div className="flex-1">
                <DashboardHeader
                    title="Candidate Dashboard"
                    subtitle="Track your applications and find your next opportunity"
                />

                <main className="p-6 space-y-6">
                    {/* Welcome Card with Profile Completion */}
                    <Card variant="glass" className="gradient-mesh">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-heading font-bold">Welcome back, John!</h2>
                                    <p className="text-muted-foreground">Complete your profile to get better job matches</p>
                                </div>
                                <Button>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Resume
                                </Button>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Profile Completion</span>
                                    <span className="text-muted-foreground">{profileCompletion}%</span>
                                </div>
                                <Progress value={profileCompletion} size="lg" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Status */}
                    <div>
                        <h3 className="text-lg font-heading font-semibold mb-4">Your Applications</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Active
                                    </CardTitle>
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-heading font-bold">5</div>
                                    <p className="text-sm text-muted-foreground mt-1">In review</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Interviews
                                    </CardTitle>
                                    <div className="h-10 w-10 rounded-lg bg-accent-3/10 flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 text-accent-3" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-heading font-bold">2</div>
                                    <p className="text-sm text-muted-foreground mt-1">Scheduled</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Applied
                                    </CardTitle>
                                    <div className="h-10 w-10 rounded-lg bg-accent-4/10 flex items-center justify-center">
                                        <Briefcase className="h-5 w-5 text-accent-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-heading font-bold">12</div>
                                    <p className="text-sm text-muted-foreground mt-1">This month</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Application Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Applications</CardTitle>
                            <CardDescription>Track the status of your job applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    {
                                        company: "TechCorp",
                                        position: "Senior Frontend Developer",
                                        applied: "2 days ago",
                                        status: "reviewing",
                                        stages: ["Applied", "Screening", "Interview", "Offer"],
                                        currentStage: 1
                                    },
                                    {
                                        company: "StartupXYZ",
                                        position: "Product Designer",
                                        applied: "5 days ago",
                                        status: "interview",
                                        stages: ["Applied", "Screening", "Interview", "Offer"],
                                        currentStage: 2
                                    },
                                    {
                                        company: "DesignHub",
                                        position: "UX Researcher",
                                        applied: "1 week ago",
                                        status: "rejected",
                                        stages: ["Applied", "Screening", "Interview", "Offer"],
                                        currentStage: 1
                                    },
                                ].map((app, index) => (
                                    <div key={index} className="p-4 rounded-lg border">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-medium">{app.position}</h4>
                                                <p className="text-sm text-muted-foreground">{app.company} • {app.applied}</p>
                                            </div>
                                            <Badge variant={
                                                app.status === "interview" ? "success" :
                                                    app.status === "reviewing" ? "warning" :
                                                        "destructive"
                                            }>
                                                {app.status}
                                            </Badge>
                                        </div>

                                        {/* Timeline */}
                                        <div className="flex items-center gap-2">
                                            {app.stages.map((stage, stageIndex) => (
                                                <React.Fragment key={stageIndex}>
                                                    <div className="flex flex-col items-center">
                                                        <div className={cn(
                                                            "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                                                            stageIndex <= app.currentStage && app.status !== "rejected"
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-secondary text-muted-foreground"
                                                        )}>
                                                            {stageIndex + 1}
                                                        </div>
                                                        <span className="text-xs mt-1 text-muted-foreground">{stage}</span>
                                                    </div>
                                                    {stageIndex < app.stages.length - 1 && (
                                                        <div className={cn(
                                                            "h-1 flex-1 rounded",
                                                            stageIndex < app.currentStage && app.status !== "rejected"
                                                                ? "bg-primary"
                                                                : "bg-secondary"
                                                        )} />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommended Jobs */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recommended Jobs</CardTitle>
                                    <CardDescription>Based on your profile and preferences</CardDescription>
                                </div>
                                <Button variant="outline">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    {
                                        company: "InnovateTech",
                                        position: "Lead Frontend Engineer",
                                        location: "Remote",
                                        match: 95,
                                        skills: ["React", "TypeScript", "Next.js"]
                                    },
                                    {
                                        company: "CloudSystems",
                                        position: "Senior Full Stack Developer",
                                        location: "San Francisco, CA",
                                        match: 88,
                                        skills: ["Node.js", "React", "AWS"]
                                    },
                                    {
                                        company: "DataFlow",
                                        position: "Frontend Architect",
                                        location: "New York, NY",
                                        match: 85,
                                        skills: ["React", "GraphQL", "TypeScript"]
                                    },
                                    {
                                        company: "FinTech Solutions",
                                        position: "UI/UX Engineer",
                                        location: "Remote",
                                        match: 82,
                                        skills: ["React", "Figma", "CSS"]
                                    },
                                ].map((job, index) => (
                                    <Card key={index} variant="interactive">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-base">{job.position}</CardTitle>
                                                    <CardDescription>{job.company} • {job.location}</CardDescription>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-heading font-bold text-primary">{job.match}%</div>
                                                    <div className="text-xs text-muted-foreground">Match</div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {job.skills.map((skill, skillIndex) => (
                                                    <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>
                                            <Button className="w-full">Apply Now</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
