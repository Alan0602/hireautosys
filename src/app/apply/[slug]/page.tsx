"use client"

import React, { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useJobStore, Job } from "@/store/job-store"
import { analyzeApplication, ATSResult } from "@/lib/ats-scoring"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import {
    Building2, MapPin, Clock, Briefcase, Calendar, Sparkles,
    Loader2, UploadCloud, CheckCircle2, XCircle, ArrowRight,
    FileText, AlertTriangle, Lightbulb, TrendingUp,
    GraduationCap, Shield
} from "lucide-react"

type PageState = 'loading' | 'not_found' | 'expired' | 'apply' | 'processing' | 'result'

export default function JobApplicationPage() {
    const params = useParams()
    const { hydrate, getJobBySlug, submitApplication, isHydrated } = useJobStore()
    const [pageState, setPageState] = useState<PageState>('loading')
    const [job, setJob] = useState<Job | null>(null)
    const [email, setEmail] = useState("")
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [agreedTerms, setAgreedTerms] = useState(false)
    const [atsResult, setAtsResult] = useState<ATSResult | null>(null)
    const [passed, setPassed] = useState(false)
    const [createdAppId, setCreatedAppId] = useState<string | null>(null)
    const [processingStep, setProcessingStep] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // hydrate() // No longer needed
        const fetchJob = async () => {
            const slug = params.slug as string
            if (!slug) { setPageState('not_found'); return }

            const foundJob = await getJobBySlug(slug)
            if (!foundJob) { setPageState('not_found'); return }

            if (foundJob.status === 'expired' || new Date(foundJob.expiryDate) < new Date()) {
                setJob(foundJob)
                setPageState('expired')
                return
            }

            setJob(foundJob)
            setPageState('apply')
        }
        fetchJob()
    }, [params.slug, getJobBySlug])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!job || !email || !resumeFile || !agreedTerms) return

        // Client-side file validation
        if (resumeFile.size > 5 * 1024 * 1024) {
            toast.error('File too large. Max size is 5MB.')
            return
        }
        if (resumeFile.type !== 'application/pdf') {
            toast.error('Only PDF files are accepted.')
            return
        }

        setPageState('processing')

        // Step 1: Upload simulation
        setProcessingStep("Uploading resume...")
        await new Promise(r => setTimeout(r, 800))

        // Step 2: Extract real text from the PDF
        setProcessingStep("Extracting resume content...")
        let resumeText = ""
        try {
            const fd = new FormData()
            fd.append("file", resumeFile)
            const parseRes = await fetch("/api/parse-resume", { method: "POST", body: fd })
            const parsed = await parseRes.json()
            resumeText = parsed.text || ""
        } catch { resumeText = "" }
        if (!resumeText || resumeText.length < 50) {
            resumeText = `${resumeFile.name} candidate with experience in technology`
        }

        // Step 3: ATS analysis
        setProcessingStep("Running AI analysis...")
        const result = await analyzeApplication(job.skills, resumeText)
        setAtsResult(result)

        // ── Three-tier ATS filtering ──
        const cutoff = job.atsThreshold
        const halfCutoff = cutoff * 0.5

        if (result.score >= cutoff) {
            // ✅ PASS — save application + upload resume
            setPassed(true)
            setProcessingStep("Saving application...")
            const app = await submitApplication({
                jobId: job.id,
                candidateName: email.split('@')[0],
                candidateEmail: email,
                resumeUrl: resumeFile.name,
                atsScore: result.score,
                skillsFound: result.skillsFound,
                missingSkills: result.missingSkills,
                tips: result.tips,
                status: 'pending',
            }, resumeFile)
            if (app) setCreatedAppId(app.id)

        } else if (result.score >= halfCutoff) {
            // ⚠️ SOFT REJECT — save with ats_rejected status + upload resume
            // HR can still review these borderline candidates
            setPassed(false)
            setProcessingStep("Saving application...")
            const app = await submitApplication({
                jobId: job.id,
                candidateName: email.split('@')[0],
                candidateEmail: email,
                resumeUrl: resumeFile.name,
                atsScore: result.score,
                skillsFound: result.skillsFound,
                missingSkills: result.missingSkills,
                tips: result.tips,
                status: 'ats_rejected',
            }, resumeFile)
            if (app) setCreatedAppId(app.id)

        } else {
            // 🚫 HARD REJECT — do NOT save anything to Supabase
            setPassed(false)
        }

        setProcessingStep("")
        setPageState('result')
    }

    const daysLeft = job ? Math.max(0, Math.ceil((new Date(job.expiryDate).getTime() - Date.now()) / 86400000)) : 0
    const postedDate = job ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

    // ── LOADING ──
    if (pageState === 'loading') {
        return (
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // ── NOT FOUND ──
    if (pageState === 'not_found') {
        return (
            <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center text-white p-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
                    <XCircle className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
                <p className="text-slate-400 mb-8 text-center max-w-md">
                    The job posting you are looking for doesn&apos;t exist or has been removed.
                </p>
                <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        )
    }

    // ── EXPIRED ──
    if (pageState === 'expired' && job) {
        return (
            <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center text-white p-4">
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="relative z-10 text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
                        <AlertTriangle className="h-10 w-10 text-orange-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Hiring Closed</h1>
                    <p className="text-lg text-slate-300 mb-2">{job.title}</p>
                    <p className="text-slate-400 mb-8">
                        This position at <span className="text-white font-medium">{job.orgName}</span> is no longer accepting applications.
                        The posting expired on {new Date(job.expiryDate).toLocaleDateString()}.
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Browse Other Opportunities
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (!job) return null

    // ── PROCESSING ──
    if (pageState === 'processing') {
        return (
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-4">
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <Card className="glass-panel-obsidian w-full max-w-md border-white/10 shadow-2xl relative z-10">
                    <CardContent className="pt-8 pb-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/30">
                            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Analyzing Your Application</h2>
                        <p className="text-slate-400 mb-6">{processingStep}</p>
                        <div className="w-full max-w-xs mx-auto">
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── RESULT ──
    if (pageState === 'result' && atsResult) {
        return (
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-4">
                <div className="fixed inset-0 pointer-events-none">
                    <div className={`absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 ${passed ? 'bg-green-500/10' : 'bg-orange-500/10'}`} />
                </div>

                <Card className="glass-panel-obsidian w-full max-w-lg border-white/10 shadow-2xl relative z-10">
                    <CardContent className="pt-8 pb-8 space-y-6">
                        {/* Score Circle */}
                        <div className="text-center">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${passed
                                ? 'bg-green-500/20 border-green-500/40'
                                : 'bg-orange-500/20 border-orange-500/40'
                                }`}>
                                <span className={`text-3xl font-bold ${passed ? 'text-green-400' : 'text-orange-400'}`}>
                                    {atsResult.score}%
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {passed ? 'Great Match!' : 'Room for Improvement'}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {passed
                                    ? `Your profile matches ${atsResult.score}% of the requirements for ${job.title}`
                                    : `Your score of ${atsResult.score}% is below the ${job.atsThreshold}% threshold`
                                }
                            </p>
                        </div>

                        {/* Skills Breakdown */}
                        <div className="space-y-3">
                            {atsResult.skillsFound.length > 0 && (
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <p className="text-xs font-medium text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Skills Matched
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {atsResult.skillsFound.map((skill, i) => (
                                            <Badge key={i} className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {atsResult.partialSkills?.length > 0 && (
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" /> Partial Match (Inferred)
                                    </p>
                                    <div className="space-y-2">
                                        {atsResult.partialSkills.map((item, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs shrink-0">
                                                    {item.skill} · {item.confidence}%
                                                </Badge>
                                                <p className="text-xs text-slate-400 leading-relaxed">{item.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {atsResult.missingSkills.length > 0 && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <p className="text-xs font-medium text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <XCircle className="h-3 w-3" /> Missing Skills
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {atsResult.missingSkills.map((skill, i) => (
                                            <Badge key={i} className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Passed: CTA */}
                        {passed ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                                    <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                                    <p className="text-sm text-white font-medium mb-1">Your application has been submitted</p>
                                    <p className="text-xs text-slate-400 mb-3">We&apos;ll notify you at <span className="text-white">{email}</span> with updates</p>
                                </div>
                                {createdAppId && <CandidateTrackerSignup email={email} applicationId={createdAppId} />}
                                <Link href="/">
                                    <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                                        Return to Home
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            /* Failed: Tips & Reapply */
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs font-medium text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <Lightbulb className="h-3 w-3" /> Improvement Tips
                                    </p>
                                    <ul className="space-y-2">
                                        {atsResult.tips.map((tip, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-slate-300">
                                                <TrendingUp className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    onClick={() => {
                                        setPageState('apply')
                                        setResumeFile(null)
                                        setAgreedTerms(false)
                                        setAtsResult(null)
                                    }}
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                >
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Improve & Reapply
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // ── MAIN: APPLY VIEW ──
    return (
        <div className="min-h-screen bg-[#0F1115] text-white overflow-hidden relative">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Back */}
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm">
                    ← Back to Home
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* ── JOB DETAILS ── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
                                    <Building2 className="h-3 w-3 text-primary" /> {job.orgName}
                                </div>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                    🔥 Now Hiring
                                </Badge>
                                {daysLeft <= 7 && (
                                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                                        ⏳ {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                {job.title}
                            </h1>

                            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                                {job.experience && (
                                    <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {job.experience}</span>
                                )}
                                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.department}</span>
                                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Posted {postedDate}</span>
                            </div>
                        </div>

                        {/* Skills Tags */}
                        {job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-primary/10 hover:border-primary/30 hover:text-white transition-all cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Job Content */}
                        <div className="glass-panel-obsidian p-6 sm:p-8 rounded-2xl space-y-8 border-white/5">
                            {/* About */}
                            {job.description && (
                                <section>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-primary rounded-full" />
                                        About the Role
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">{job.description}</p>
                                </section>
                            )}

                            {/* Responsibilities */}
                            {job.responsibilities.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-primary rounded-full" />
                                        Responsibilities
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {job.responsibilities.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-slate-300">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Requirements */}
                            {job.requirements.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-purple-500 rounded-full" />
                                        Requirements
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {job.requirements.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-slate-300">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Benefits */}
                            {job.benefits.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-green-500 rounded-full" />
                                        Benefits & Perks
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.benefits.map((item, i) => (
                                            <Badge key={i} variant="secondary" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 text-sm">
                                                {item}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* ── APPLY SIDEBAR ── */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card className="glass-panel-obsidian border-white/10 shadow-2xl overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-primary to-purple-600" />
                                <CardHeader>
                                    <CardTitle className="text-xl text-white">Apply Now</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        Start your journey with {job.orgName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Email Address *</Label>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white focus:border-primary/50"
                                            />
                                        </div>

                                        {/* Resume Upload */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Resume (PDF) *</Label>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf"
                                                className="hidden"
                                                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                            />
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-white/10 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 hover:border-primary/30 transition-all group"
                                            >
                                                {resumeFile ? (
                                                    <>
                                                        <FileText className="h-8 w-8 text-green-400 mb-2" />
                                                        <p className="text-sm text-white font-medium truncate max-w-full">{resumeFile.name}</p>
                                                        <p className="text-xs text-slate-500 mt-1">Click to change</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="h-8 w-8 text-slate-500 group-hover:text-primary mb-2 transition-colors" />
                                                        <p className="text-sm text-slate-400 group-hover:text-slate-300">
                                                            Click to upload
                                                        </p>
                                                        <p className="text-xs text-slate-600 mt-1">PDF only, up to 5MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Terms */}
                                        <label className="flex items-start gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={agreedTerms}
                                                onChange={(e) => setAgreedTerms(e.target.checked)}
                                                className="mt-1 accent-primary"
                                            />
                                            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                                                I agree that my resume will be processed by the AI screening system for this application
                                            </span>
                                        </label>

                                        {/* Submit */}
                                        <Button
                                            type="submit"
                                            disabled={!email || !resumeFile || !agreedTerms}
                                            className="w-full bg-primary hover:bg-primary/90 text-white shadow-glow h-12 text-base disabled:opacity-40"
                                        >
                                            Submit Application
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* AI Note */}
                            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 flex gap-2.5 items-start">
                                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    <span className="text-primary font-medium">AI-Powered Screening:</span> Your resume will be instantly analyzed against the job requirements for a fair, fast review.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Apply Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0F1115]/95 backdrop-blur-lg border-t border-white/10 z-50">
                <Button
                    onClick={() => document.querySelector('#apply-card')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-primary hover:bg-primary/90 text-white shadow-glow h-12 text-base"
                >
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

function CandidateTrackerSignup({ email, applicationId }: { email: string, applicationId: string }) {
    const [password, setPassword] = useState("")
    const [isSignedUp, setIsSignedUp] = useState(false)
    const { candidateSignup } = useAuthStore()
    const { linkCandidateToApplication } = useJobStore()
    const router = useRouter()

    const handleSignup = async () => {
        if (!password) return
        const user = await candidateSignup(email, password)
        if (user) {
            // Link application
            await linkCandidateToApplication(applicationId, user.id)
            router.push('/candidate/dashboard')
        }
    }

    if (isSignedUp) {
        return <Button className="w-full" disabled>Tracking Enabled</Button>
    }

    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-sm font-semibold text-white">Track this application</h3>
            <p className="text-xs text-slate-400">Create a password to track your progress and view HR feedback.</p>
            <div className="flex gap-2">
                <Input
                    type="password"
                    placeholder="Create Password"
                    className="bg-black/20 border-white/10 text-white text-xs h-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleSignup} className="bg-primary hover:bg-primary/90 h-9 px-4">
                    Track It
                </Button>
            </div>
        </div>
    )
}

