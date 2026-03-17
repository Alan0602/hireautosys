"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useJobStore } from "@/store/job-store"
import { ArrowLeft, Search, Filter, Calendar, BarChart, ChevronRight } from "lucide-react"
import { toast } from "sonner"

export default function JobApplicationsPage() {
    const params = useParams()
    const router = useRouter()
    const { jobs, applications, getJobBySlug, getApplicationsByJob, updateApplicationStatus, isLoading } = useJobStore()
    const [searchTerm, setSearchTerm] = useState("")

    const jobId = params.id as string
    const job = jobs.find(j => j.id === jobId)

    const handleUpdateStatus = async (appId: string, status: any) => {
        const success = await updateApplicationStatus(appId, status)
        if (success) {
            const app = applications.find(a => a.id === appId)
            if (app) {
                let emailType = ''
                if (status === 'hr_approve' || status === 'hired') emailType = 'selected'
                else if (status === 'rejected') emailType = 'rejected'
                else if (status === 'ready_for_checkin') emailType = 'interview'
                
                if (emailType) {
                    try {
                        const res = await fetch('/api/send-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                applicationId: app.id,
                                candidateName: app.candidateName,
                                candidateEmail: app.candidateEmail,
                                status: emailType
                            })
                        })
                        if (!res.ok) throw new Error('Failed to send email')
                        toast.success("Email sent to candidate.")
                    } catch {
                        toast.error("Status updated, but email failed to send. Please visit the application details page to retry.")
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (jobId) {
            getApplicationsByJob(jobId)
        }
    }, [jobId, getApplicationsByJob])

    // Fetch job details if not in store (e.g. direct load)
    // Note: getApplicationsByJob does not fetch job info.
    // We might need to fetch job if missing. 
    // Ideally we rely on global sync or fetch single job.
    // But `getJobBySlug` takes slug. `getJobsByOrg` fetches all.
    // We don't have getJobById in store yet. 
    // We can just rely on `jobs` if populated, or fetch all jobs for org if empty.
    // For now assuming user navigated from Jobs list so `jobs` is populated.

    const filteredApplications = applications.filter(app =>
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader
                    title="Applications"
                    subtitle={job ? `Manage applications for ${job.title}` : 'Manage applications'}
                />

                <main className="flex-1 p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <div className="flex-1">
                            <div className="relative max-w-md">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search candidates..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app) => (
                                <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/hr/applications/${app.id}`)}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {app.candidateName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{app.candidateName}</h4>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span>{app.candidateEmail}</span>
                                                    <span>•</span>
                                                    <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm font-medium">ATS Score</div>
                                                <div className={`text-lg font-bold ${app.atsScore >= 80 ? 'text-green-600' :
                                                    app.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {app.atsScore}%
                                                </div>
                                            </div>

                                            <Badge variant={
                                                app.status === 'hired' ? 'success' :
                                                    app.status === 'rejected' ? 'destructive' :
                                                        app.status === 'hr_approve' ? 'secondary' :
                                                            app.status === 'teamlead_approve' ? 'outline' : 'secondary'
                                            }>
                                                {app.status.replace('_', ' ').toUpperCase()}
                                            </Badge>

                                            <ChevronRight className="h-5 w-5 text-muted-foreground mr-2" />

                                            {/* HR Actions */}
                                            {app.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleUpdateStatus(app.id, 'hr_approve')
                                                    }}
                                                >
                                                    Approve
                                                </Button>
                                            )}
                                            {app.status === 'teamlead_approve' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleUpdateStatus(app.id, 'ready_for_checkin')
                                                    }}
                                                >
                                                    Schedule Interview
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                No applications found matching your criteria.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
