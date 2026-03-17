"use client"

import { useEffect } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { useJobStore } from "@/store/job-store"
import {
    Plus, MapPin, Clock, Users, ExternalLink, Briefcase,
    Calendar, Target
} from "lucide-react"
import { AIAssistant } from "@/components/ai/ai-assistant"

export default function HRJobsPage() {
    const { currentUser } = useAuthStore()
    const { jobs, applications, getJobsByOrg, getApplicationsByOrg } = useJobStore()

    useEffect(() => {
        if (currentUser?.organisationId) {
            getJobsByOrg(currentUser.organisationId)
            getApplicationsByOrg(currentUser.organisationId)
        }
    }, [currentUser, getJobsByOrg, getApplicationsByOrg])

    const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader title="Jobs Management" />

                <main className="flex-1 p-6 space-y-6">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Your Job Postings</h2>
                            <p className="text-muted-foreground text-sm">
                                {sortedJobs.length} job{sortedJobs.length !== 1 ? 's' : ''} total
                            </p>
                        </div>
                        <Link href="/hr/jobs/new">
                            <Button className="bg-primary hover:bg-primary/90 shadow-glow">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Job
                            </Button>
                        </Link>
                    </div>

                    {/* Jobs Grid */}
                    {sortedJobs.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sortedJobs.map((job) => {
                                const apps = applications.filter(a => a.jobId === job.id)
                                const passedApps = apps.filter(a => a.status !== 'rejected')
                                const isExpired = job.status === 'expired' || new Date(job.expiryDate) < new Date()

                                return (
                                    <Card key={job.id} className={`hover:shadow-lg transition-shadow flex flex-col h-full ${isExpired ? 'opacity-60' : ''}`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base line-clamp-1">{job.title}</CardTitle>
                                                    <CardDescription className="mt-1">{job.department}</CardDescription>
                                                </div>
                                                <Badge
                                                    variant={isExpired ? "destructive" : "success"}
                                                    className="shrink-0 text-[10px]"
                                                >
                                                    {isExpired ? 'Expired' : 'Active'}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Meta */}
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {job.location}
                                                </span>
                                                {job.experience && (
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="h-3 w-3" /> {job.experience}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(job.expiryDate).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Skills */}
                                            {job.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {job.skills.slice(0, 4).map((skill, i) => (
                                                        <Badge key={i} variant="outline" className="text-[10px] px-2 py-0 font-normal">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {job.skills.length > 4 && (
                                                        <Badge variant="outline" className="text-[10px] px-2 py-0 font-normal">
                                                            +{job.skills.length - 4}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Stats */}
                                            {/* Stats & Actions */}
                                            <div className="mt-auto pt-4 border-t space-y-3">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                                        <Users className="h-3.5 w-3.5" />
                                                        {apps.length} Applicant{apps.length !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-green-500 font-medium">
                                                        <Target className="h-3.5 w-3.5" />
                                                        {passedApps.length} Active
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Link href={`/hr/jobs/${job.id}/applications`} className="w-full">
                                                        <Button size="sm" variant="outline" className="w-full h-8 text-xs font-medium">
                                                            View Apps
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-xs font-medium border border-dashed border-border"
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/apply/${job.slug}`
                                                            navigator.clipboard.writeText(url)
                                                        }}
                                                    >
                                                        <ExternalLink className="h-3 w-3 mr-1.5" />
                                                        Copy Link
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Briefcase className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">No jobs yet</h3>
                                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                                    Create your first job posting and share it with candidates
                                </p>
                                <Link href="/hr/jobs/new">
                                    <Button className="bg-primary hover:bg-primary/90 shadow-glow">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Job
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </main>
                <AIAssistant 
                    mode="job_description" 
                    placeholder="Provide a job title and key requirements to get help with job descriptions..."
                />
            </div >
        </div >
    )
}
