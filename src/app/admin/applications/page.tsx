"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/dashboard/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useJobStore, Application } from "@/store/job-store"
import { useAuthStore } from "@/store/auth-store"
import { Search, Check, X, FileText, Download, ExternalLink } from "lucide-react"

export default function AdminApplicationsPage() {
    const router = useRouter()
    const { currentUser } = useAuthStore()
    const { applications, getApplicationsByOrg, updateApplicationStatus, getResumeSignedUrl, isLoading } = useJobStore()
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>('all')

    // Resume preview state
    const [previewApp, setPreviewApp] = useState<Application | null>(null)
    const [resumeUrl, setResumeUrl] = useState<string | null>(null)
    const [isLoadingResume, setIsLoadingResume] = useState(false)

    useEffect(() => {
        if (currentUser?.organisationId) {
            getApplicationsByOrg(currentUser.organisationId)
        }
    }, [currentUser, getApplicationsByOrg])

    const handleUpdateStatus = async (appId: string, status: any) => {
        await updateApplicationStatus(appId, status)
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

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' ? true : app.status === filterStatus
        return matchesSearch && matchesStatus
    })

    // Sort: pending first
    const sortedApplications = [...filteredApplications].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (a.status !== 'pending' && b.status === 'pending') return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const hasResume = (app: Application) => app.resumeUrl && app.resumeUrl.includes('/')

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
                        <div className="flex gap-2">
                            <Button variant={filterStatus === 'all' ? 'primary' : 'outline'} onClick={() => setFilterStatus('all')} size="sm">All</Button>
                            <Button variant={filterStatus === 'pending' ? 'primary' : 'outline'} onClick={() => setFilterStatus('pending')} size="sm" className="relative">
                                Pending Approval
                                {applications.filter(a => a.status === 'pending').length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sortedApplications.length > 0 ? (
                            sortedApplications.map((app) => (
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
                                                            app.status === 'pending' ? 'secondary' : 'outline'
                                            }>
                                                {app.status.replace(/_/g, ' ').toUpperCase()}
                                            </Badge>

                                            {/* Preview Resume Button */}
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

                                            {/* Admin Actions */}
                                            {app.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleUpdateStatus(app.id, 'hr_approve')}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                No applications found.
                            </div>
                        )}
                    </div>
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
                                    <p className="font-semibold">{previewApp.candidateName}'s Resume</p>
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
