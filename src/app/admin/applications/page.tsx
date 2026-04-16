"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/dashboard/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useJobStore, Application } from "@/store/job-store"
import { useAuthStore } from "@/store/auth-store"
import { Search, Check, X, FileText, Download, ExternalLink, Clock, CheckCircle2, Trophy, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function AdminApplicationsPage() {
    const router = useRouter()
    const { currentUser } = useAuthStore()
    const { applications, getApplicationsByOrg, updateApplicationStatus, getResumeSignedUrl, isLoading } = useJobStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [processingId, setProcessingId] = useState<string | null>(null)

    // Resume preview state
    const [previewApp, setPreviewApp] = useState<Application | null>(null)
    const [resumeUrl, setResumeUrl] = useState<string | null>(null)
    const [isLoadingResume, setIsLoadingResume] = useState(false)

    useEffect(() => {
        if (currentUser?.organisationId) {
            getApplicationsByOrg(currentUser.organisationId)
        }
    }, [currentUser, getApplicationsByOrg])

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
            if (!res.ok) throw new Error('Email send failed')
            toast.success("Email sent to candidate.")
        } catch {
            toast.error("Status updated, but email failed to send.")
        }
    }

    const handleAdminApprove = async (app: Application) => {
        setProcessingId(app.id)
        try {
            const success = await updateApplicationStatus(app.id, 'teamlead_approve')
            if (success) {
                await triggerEmail(app, 'admin_approved')
            }
        } finally {
            setProcessingId(null)
        }
    }

    const handleAdminReject = async (app: Application) => {
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

    const handlePreviewResume = async (app: Application) => {
        setPreviewApp(app)
        setResumeUrl(null)
        setIsLoadingResume(true)
        try {
            const url = await getResumeSignedUrl(app.resumeUrl)
            setResumeUrl(url)
        } finally {
            setIsLoadingResume(false)
        }
    }

    const hasResume = (app: Application) => app.resumeUrl && app.resumeUrl.includes('/')

    const filtered = applications.filter(app =>
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Split by status for tabs
    const awaitingAdmin = filtered.filter(a => a.status === 'hr_approve')
    const approved = filtered.filter(a => a.status === 'teamlead_approve' || a.status === 'hired')
    const rejected = filtered.filter(a => a.status === 'rejected')
    const atsRejected = filtered.filter(a => a.status === 'ats_rejected')

    const renderCard = (app: Application, actions: React.ReactNode | null) => (
        <Card key={app.id} className="hover:shadow-md transition-shadow">
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
                            <span>ATS: <span className={app.atsScore >= 80 ? 'text-green-600 font-bold' : 'text-yellow-600'}>{app.atsScore}%</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant={
                        app.status === 'hired' ? 'success' :
                            app.status === 'hr_approve' ? 'default' :
                                app.status === 'rejected' ? 'destructive' :
                                    app.status === 'ats_rejected' ? 'warning' :
                                        app.status === 'teamlead_approve' ? 'outline' : 'secondary'
                    }>
                        {app.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>

                    {hasResume(app) && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePreviewResume(app)}
                        >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            Resume
                        </Button>
                    )}

                    {actions}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader title="Application Review" subtitle="Manage candidate approvals" />

                <main className="flex-1 p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search candidates..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="awaiting" className="w-full">
                        <TabsList>
                            <TabsTrigger value="awaiting" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Passed — Awaiting Approval
                                {awaitingAdmin.length > 0 && (
                                    <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">{awaitingAdmin.length}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="approved" className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Approved / Hired
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{approved.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="rejected" className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Rejected
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{rejected.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="ats_rejected" className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                ATS Rejected
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{atsRejected.length}</Badge>
                            </TabsTrigger>
                        </TabsList>

                        {/* Awaiting Admin Approval (hr_approve) */}
                        <TabsContent value="awaiting" className="space-y-4 mt-4">
                            {awaitingAdmin.length > 0 ? (
                                awaitingAdmin.map(app => renderCard(app, (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleAdminReject(app)}
                                            disabled={processingId === app.id}
                                        >
                                            <X className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleAdminApprove(app)}
                                            disabled={processingId === app.id}
                                        >
                                            <Check className="h-4 w-4 mr-1" /> Approve
                                        </Button>
                                    </div>
                                )))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No applications awaiting admin approval.
                                </div>
                            )}
                        </TabsContent>

                        {/* Approved / Hired */}
                        <TabsContent value="approved" className="space-y-4 mt-4">
                            {approved.length > 0 ? (
                                approved.map(app => renderCard(app, null))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No approved or hired applications.
                                </div>
                            )}
                        </TabsContent>

                        {/* Rejected */}
                        <TabsContent value="rejected" className="space-y-4 mt-4">
                            {rejected.length > 0 ? (
                                rejected.map(app => renderCard(app, null))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No rejected applications.
                                </div>
                            )}
                        </TabsContent>

                        {/* ATS Rejected */}
                        <TabsContent value="ats_rejected" className="space-y-4 mt-4">
                            {atsRejected.length > 0 ? (
                                atsRejected.map(app => renderCard(app, null))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No ATS-rejected applications.
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* Resume Preview Modal */}
            {previewApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">{previewApp.candidateName}&apos;s Resume</p>
                                    <p className="text-xs text-muted-foreground">Secure preview — link expires in 1 hour</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {resumeUrl && (
                                    <>
                                        <a
                                            href={resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" /> Open in Tab
                                        </a>
                                        <a
                                            href={resumeUrl}
                                            download
                                            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            <Download className="h-3.5 w-3.5" /> Download
                                        </a>
                                    </>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => { setPreviewApp(null); setResumeUrl(null) }}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* PDF Content */}
                        <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
                            {isLoadingResume ? (
                                <div className="text-center text-muted-foreground">
                                    <FileText className="h-10 w-10 mx-auto mb-3 animate-pulse text-primary" />
                                    <p>Loading resume...</p>
                                </div>
                            ) : resumeUrl ? (
                                <iframe
                                    src={`${resumeUrl}#toolbar=1&navpanes=0`}
                                    className="w-full h-full border-0"
                                    title={`${previewApp.candidateName}'s Resume`}
                                />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p>Could not load resume preview.</p>
                                    <p className="text-sm mt-1">The file may have been deleted or is unavailable.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
