"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, ExternalLink, ThumbsUp, ThumbsDown, FileText, Calendar, X } from "lucide-react"
import { useJobStore, Application } from "@/store/job-store"
import { useAuthStore } from "@/store/auth-store"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ApplicationReviewPage() {
    const params = useParams()
    const router = useRouter()

    const { currentUser } = useAuthStore()
    const { applications, jobs, getApplicationsByOrg, getJobsByOrg, updateApplicationStatus, getResumeSignedUrl } = useJobStore()
    const [application, setApplication] = React.useState<Application | null>(null)

    // UI State
    const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false)
    const [rejectReason, setRejectReason] = React.useState("")
    const [isProcessing, setIsProcessing] = React.useState(false)

    // Resume preview state
    const [resumeSignedUrl, setResumeSignedUrl] = React.useState<string | null>(null)
    const [isResumeModalOpen, setIsResumeModalOpen] = React.useState(false)
    const [isLoadingResume, setIsLoadingResume] = React.useState(false)

    React.useEffect(() => {
        if (currentUser?.organisationId) {
            getApplicationsByOrg(currentUser.organisationId)
            getJobsByOrg(currentUser.organisationId)
        }
    }, [currentUser, getApplicationsByOrg, getJobsByOrg])

    React.useEffect(() => {
        if (params.id && applications.length > 0) {
            const found = applications.find(a => a.id === params.id)
            if (found) setApplication(found)
        }
    }, [params.id, applications])

    const handleOpenResume = async () => {
        if (!application?.resumeUrl) return
        setIsLoadingResume(true)
        try {
            const url = await getResumeSignedUrl(application.resumeUrl)
            if (url) {
                setResumeSignedUrl(url)
                setIsResumeModalOpen(true)
            }
        } finally {
            setIsLoadingResume(false)
        }
    }

    const handleReject = async () => {
        if (!application) return
        setIsProcessing(true)
        await updateApplicationStatus(application.id, 'rejected', rejectReason)
        setIsProcessing(false)
        setIsRejectDialogOpen(false)
        router.push(`/hr/jobs/${application.jobId}/applications`)
    }

    const handleAccept = async () => {
        if (!application) return
        setIsProcessing(true)
        if (application.status === 'pending') {
            await updateApplicationStatus(application.id, 'hr_approve')
        } else if (application.status === 'teamlead_approve') {
            await updateApplicationStatus(application.id, 'ready_for_checkin')
        }
        setIsProcessing(false)
    }

    if (!application) {
        return (
            <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
                <DashboardSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Loading Application...</h2>
                        <p className="text-muted-foreground">Please wait while we fetch the details.</p>
                    </div>
                </div>
            </div>
        )
    }

    const job = jobs.find(j => j.id === application.jobId)
    const hasResume = application.resumeUrl && application.resumeUrl.includes('/')

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <DashboardHeader
                    title="Application Review"
                    subtitle={`Reviewing candidate for ${job?.title || 'Unknown Role'}`}
                />

                <main className="flex-1 overflow-hidden p-6 gap-6 grid grid-cols-12">
                    {/* Left Column: Candidate Info & Actions */}
                    <div className="col-span-12 lg:col-span-4 space-y-6 overflow-y-auto pr-2">
                        <Button variant="ghost" className="pl-0 mb-2" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                        </Button>

                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{application.candidateName}</CardTitle>
                                        <CardDescription>{application.candidateEmail}</CardDescription>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                                        {application.candidateName.charAt(0)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">ATS Match Score</span>
                                        <span className="font-bold">{application.atsScore}%</span>
                                    </div>
                                    <Progress value={application.atsScore} className="h-2" />
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Badge variant={application.atsScore > 80 ? "default" : "secondary"}>
                                        {application.atsScore > 80 ? "High Match" : "Potential Match"}
                                    </Badge>
                                    <Badge variant="outline">{application.status.replace(/_/g, ' ').toUpperCase()}</Badge>
                                    <Badge variant="outline">Applied {new Date(application.createdAt).toLocaleDateString()}</Badge>
                                </div>

                                {/* Resume Preview Button */}
                                <div className="pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleOpenResume}
                                        disabled={!hasResume || isLoadingResume}
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        {isLoadingResume ? 'Loading...' : hasResume ? 'Preview Resume' : 'No Resume Uploaded'}
                                    </Button>
                                    {hasResume && (
                                        <p className="text-xs text-muted-foreground text-center mt-1">
                                            Opens a secure PDF preview
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 border-t space-y-2">
                                    {application.status !== 'rejected' && application.status !== 'hired' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {(application.status === 'pending' || application.status === 'teamlead_approve') && (
                                                <Button
                                                    variant="outline"
                                                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/10"
                                                    onClick={handleAccept}
                                                    disabled={isProcessing}
                                                >
                                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                                    {application.status === 'pending' ? 'Approve' : 'Finalize'}
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                onClick={() => setIsRejectDialogOpen(true)}
                                                disabled={isProcessing}
                                            >
                                                <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                                            </Button>
                                        </div>
                                    )}
                                    {application.status === 'teamlead_approve' && (
                                        <Button
                                            className="w-full"
                                            variant="secondary"
                                            onClick={() => updateApplicationStatus(application.id, 'ready_for_checkin')}
                                            disabled={isProcessing}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" /> Schedule Interview
                                        </Button>
                                    )}
                                </div>

                                {application.status === 'rejected' && (
                                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-sm text-red-800 dark:text-red-200">
                                        <strong>Rejected:</strong> {application.comments || "No reason provided."}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>AI Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-1">Matched Skills</h4>
                                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                        {application.skillsFound.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                        {application.skillsFound.length === 0 && <li>No specific strengths identified.</li>}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Missing Skills</h4>
                                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                        {application.missingSkills.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                        {application.missingSkills.length === 0 && <li>No missing skills identified.</li>}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Resume Info */}
                    <div className="col-span-12 lg:col-span-8 h-full min-h-[500px]">
                        <Card className="h-full flex flex-col">
                            <CardHeader className="border-b py-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle>Resume</CardTitle>
                                    <div className="flex gap-2">
                                        {hasResume && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleOpenResume}
                                                disabled={isLoadingResume}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                {isLoadingResume ? 'Loading...' : 'Open Preview'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col items-center justify-center gap-4 bg-neutral-100 dark:bg-neutral-900 p-8">
                                {hasResume ? (
                                    <>
                                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <FileText className="h-10 w-10 text-primary" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-foreground mb-1">{application.candidateName}'s Resume</p>
                                            <p className="text-sm text-muted-foreground mb-4">PDF — Stored securely in Supabase Storage</p>
                                            <Button onClick={handleOpenResume} disabled={isLoadingResume} className="shadow">
                                                <FileText className="mr-2 h-4 w-4" />
                                                {isLoadingResume ? 'Loading...' : 'Preview PDF'}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No resume available</p>
                                        <p className="text-sm mt-1">This candidate submitted their application before file upload was enabled.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>

                {/* Reject Dialog */}
                {isRejectDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Reject Application</CardTitle>
                                <CardDescription>
                                    Are you sure you want to reject {application.candidateName}? This action cannot be undone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-md border text-sm"
                                    placeholder="Reason for rejection (optional)..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                                        {isProcessing ? 'Rejecting...' : 'Confirm Reject'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Resume Preview Modal */}
                {isResumeModalOpen && resumeSignedUrl && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-semibold text-foreground">{application.candidateName}'s Resume</p>
                                        <p className="text-xs text-muted-foreground">Secure preview — link expires in 1 hour</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={resumeSignedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Open in Tab
                                    </a>
                                    <a
                                        href={resumeSignedUrl}
                                        download
                                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Download
                                    </a>
                                    <Button size="icon" variant="ghost" onClick={() => setIsResumeModalOpen(false)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* PDF Iframe */}
                            <div className="flex-1 bg-neutral-100 dark:bg-neutral-950">
                                <iframe
                                    src={`${resumeSignedUrl}#toolbar=1&navpanes=0`}
                                    className="w-full h-full border-0"
                                    title={`${application.candidateName}'s Resume`}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
