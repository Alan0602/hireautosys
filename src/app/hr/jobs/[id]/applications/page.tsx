"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useJobStore, Application } from "@/store/job-store"
import { ArrowLeft, Search, ChevronRight, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle2, Trophy } from "lucide-react"
import { toast } from "sonner"

export default function JobApplicationsPage() {
    const params = useParams()
    const router = useRouter()
    const { jobs, applications, getApplicationsByJob, updateApplicationStatus, isLoading } = useJobStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [processingId, setProcessingId] = useState<string | null>(null)

    const jobId = params.id as string
    const job = jobs.find(j => j.id === jobId)

    useEffect(() => {
        if (jobId) {
            getApplicationsByJob(jobId)
        }
    }, [jobId, getApplicationsByJob])

    const triggerEmail = async (app: Application, emailType: string) => {
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
            toast.error("Status updated, but email failed to send.")
        }
    }

    const handleApprove = async (app: Application) => {
        setProcessingId(app.id)
        try {
            let newStatus = ''
            let emailType = ''

            if (app.status === 'pending') {
                newStatus = 'hr_approve'
                emailType = 'selected'
            } else if (app.status === 'teamlead_approve') {
                newStatus = 'hired'
                emailType = 'hired'
            }

            if (newStatus) {
                const success = await updateApplicationStatus(app.id, newStatus)
                if (success && emailType) {
                    await triggerEmail(app, emailType)
                }
            }
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (app: Application) => {
        setProcessingId(app.id)
        try {
            const success = await updateApplicationStatus(app.id, 'rejected')
            if (success) {
                await triggerEmail(app, 'rejected')
            }
        } finally {
            setProcessingId(null)
        }
    }

    const filteredApplications = applications.filter(app =>
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Split into tabs
    const passedApps = filteredApplications.filter(a => a.status !== 'rejected' && a.status !== 'ats_rejected')
    const atsRejectedApps = filteredApplications.filter(a => a.status === 'ats_rejected')
    const rejectedApps = filteredApplications.filter(a => a.status === 'rejected')

    const renderApplicationCard = (app: Application, showActions: boolean) => (
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

                <div className="flex items-center gap-4">
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
                        {app.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>

                    <ChevronRight className="h-5 w-5 text-muted-foreground" />

                    {/* HR Actions */}
                    {showActions && app.status === 'pending' && (
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(app)}
                                disabled={processingId === app.id}
                            >
                                <ThumbsUp className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(app)}
                                disabled={processingId === app.id}
                            >
                                <ThumbsDown className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                        </div>
                    )}

                    {showActions && app.status === 'teamlead_approve' && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => handleApprove(app)}
                                disabled={processingId === app.id}
                            >
                                <Trophy className="h-3.5 w-3.5 mr-1" /> Finalize Hire
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
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

                    <Tabs defaultValue="passed" className="w-full">
                        <TabsList>
                            <TabsTrigger value="passed" className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Passed Resumes
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{passedApps.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="ats_rejected" className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                ATS Rejected
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{atsRejectedApps.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="rejected" className="flex items-center gap-2">
                                <ThumbsDown className="h-4 w-4" />
                                Rejected
                                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">{rejectedApps.length}</Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="passed" className="space-y-4 mt-4">
                            {passedApps.length > 0 ? (
                                passedApps.map((app) => renderApplicationCard(app, true))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No passed applications found.
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="ats_rejected" className="space-y-4 mt-4">
                            {atsRejectedApps.length > 0 ? (
                                atsRejectedApps.map((app) => (
                                    <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer border-amber-200 dark:border-amber-800/40" onClick={() => router.push(`/hr/applications/${app.id}`)}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 font-bold">
                                                    {app.candidateName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{app.candidateName}</h4>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <span>{app.candidateEmail}</span>
                                                        <span>•</span>
                                                        <span>Score: <span className="text-amber-600 font-bold">{app.atsScore}%</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right text-sm text-muted-foreground max-w-xs">
                                                    {app.missingSkills.length > 0 && (
                                                        <p className="truncate">Missing: {app.missingSkills.join(', ')}</p>
                                                    )}
                                                </div>
                                                <Badge className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">ATS REJECTED</Badge>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No ATS-rejected applications.
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="rejected" className="space-y-4 mt-4">
                            {rejectedApps.length > 0 ? (
                                rejectedApps.map((app) => (
                                    <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/hr/applications/${app.id}`)}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 font-bold">
                                                    {app.candidateName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{app.candidateName}</h4>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <span>{app.candidateEmail}</span>
                                                        <span>•</span>
                                                        <span>Score: <span className="text-red-600 font-bold">{app.atsScore}%</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right text-sm text-muted-foreground max-w-xs">
                                                    {app.missingSkills.length > 0 && (
                                                        <p className="truncate">Missing: {app.missingSkills.join(', ')}</p>
                                                    )}
                                                </div>
                                                <Badge variant="destructive">REJECTED</Badge>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No rejected applications.
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    )
}
