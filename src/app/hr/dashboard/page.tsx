"use client"

import * as React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { Briefcase, Users, UserCheck, Clock, Plus, Target, TrendingUp } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { useAuthStore } from "@/store/auth-store"
import { useJobStore } from "@/store/job-store"

export default function HRDashboard() {
    const { currentUser } = useAuthStore()
    const { jobs, applications, getJobsByOrg, getApplicationsByOrg } = useJobStore()

    useEffect(() => {
        if (currentUser?.organisationId) {
            getJobsByOrg(currentUser.organisationId)
            getApplicationsByOrg(currentUser.organisationId)
        }
    }, [currentUser, getJobsByOrg, getApplicationsByOrg])

    const orgJobs = jobs
    const orgApps = applications
    const activeJobs = orgJobs.filter(j => j.status === 'active' && new Date(j.expiryDate) > new Date())
    const activeApps = orgApps.filter(a => a.status !== 'rejected')

    // Recent applications (last 10)
    const recentApps = [...orgApps]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    // Top performing jobs by number of applicants
    const jobStats = orgJobs.map(job => {
        const apps = orgApps.filter(a => a.jobId === job.id)
        const avgScore = apps.length > 0 ? Math.round(apps.reduce((s, a) => s + a.atsScore, 0) / apps.length) : 0
        return { ...job, appCount: apps.length, avgScore }
    }).sort((a, b) => b.appCount - a.appCount).slice(0, 3)

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />

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
                            value={activeJobs.length}
                            change={{ value: activeJobs.length, type: "increase" }}
                            icon={<Briefcase className="h-5 w-5 text-primary" />}
                            iconColor="bg-primary/10"
                        />
                        <StatCard
                            title="Total Applications"
                            value={orgApps.length}
                            change={{ value: orgApps.length, type: "increase" }}
                            icon={<Users className="h-5 w-5 text-accent-3" />}
                            iconColor="bg-accent-3/10"
                        />
                        <StatCard
                            title="Active Applications"
                            value={activeApps.length}
                            change={{ value: activeApps.length, type: "increase" }}
                            icon={<UserCheck className="h-5 w-5 text-success" />}
                            iconColor="bg-success/10"
                        />
                        <StatCard
                            title="Total Jobs"
                            value={orgJobs.length}
                            icon={<Target className="h-5 w-5 text-accent-4" />}
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
                                <Link href="/hr/jobs">
                                    <Button variant="outline">View Jobs</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentApps.map((app, index) => {
                                    const job = orgJobs.find(j => j.id === app.jobId)
                                    return (
                                        <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-primary">
                                                        {app.candidateEmail.substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{app.candidateEmail}</p>
                                                    <p className="text-sm text-muted-foreground">{job?.title || 'Unknown Role'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">{app.atsScore}%</p>
                                                    <Progress value={app.atsScore} className="w-24 mt-1" size="sm" />
                                                </div>
                                                <Badge
                                                    variant={
                                                        app.status === 'hired' ? 'success' :
                                                            app.status === 'rejected' ? 'destructive' :
                                                                app.status === 'ats_rejected' ? 'warning' :
                                                                    app.status === 'pending' ? 'warning' : 'info'
                                                    }
                                                >
                                                    {app.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                </Badge>
                                            </div>
                                        </div>
                                    )
                                })}
                                {orgApps.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No applications yet. Create a job and share the link!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions & Stats */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Jobs</CardTitle>
                                <CardDescription>Jobs with highest applicant count</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {jobStats.length > 0 ? (
                                    jobStats.map((job, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium truncate max-w-[200px]">{job.title}</p>
                                                <p className="text-sm text-muted-foreground">{job.appCount} applicant{job.appCount !== 1 ? 's' : ''}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-primary">{job.avgScore}%</p>
                                                <p className="text-xs text-muted-foreground">Avg Score</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                        No jobs created yet
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Get started in one click</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/hr/jobs/new" className="block">
                                    <Button className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20" variant="ghost">
                                        <Plus className="h-4 w-4" />
                                        Create New Job Posting
                                    </Button>
                                </Link>
                                <Link href="/hr/jobs" className="block">
                                    <Button className="w-full justify-start gap-3 hover:bg-accent" variant="ghost">
                                        <Briefcase className="h-4 w-4" />
                                        Manage Job Postings
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
