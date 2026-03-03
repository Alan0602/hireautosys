"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useJobStore, Application, Job } from "@/store/job-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Loader2, ArrowLeft, Share2, Briefcase, Search,
    MessageSquare, User, Check, Lock, Trophy, Info, ChevronDown
} from "lucide-react"

// --- Status helpers ---
type AppStatus = Application["status"]

const STATUS_STAGES = [
    { key: "applied", label: "Applied", description: (app: Application) => `Submitted on ${new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` },
    { key: "ai_screening", label: "AI Screening", description: (app: Application) => app.atsScore >= 70 ? `Passed • Score: ${app.atsScore}/100` : `Score: ${app.atsScore}/100` },
    { key: "hr_review", label: "HR Review", description: () => "Under manual review by the HR team" },
    { key: "team_lead", label: "Team Lead Review", description: () => "Being reviewed by the team lead" },
    { key: "final", label: "Final Check-in", description: () => "Ready for the final interview stage" },
] as const

function getStageIndex(status: AppStatus): number {
    switch (status) {
        case "pending": return 2    // At HR Review
        case "hr_approve": return 3 // At Team Lead
        case "teamlead_approve": return 4 // At Final
        case "ready_for_checkin": return 4 // At Final (completed)
        case "hired": return 5      // All done
        case "rejected": return -1  // Special
        default: return 0
    }
}

function getStatusLabel(status: AppStatus): string {
    switch (status) {
        case "pending": return "In Review"
        case "hr_approve": return "HR Approved"
        case "teamlead_approve": return "Team Approved"
        case "ready_for_checkin": return "Interview Stage"
        case "hired": return "Hired!"
        case "rejected": return "Rejected"
        default: return status
    }
}

function getStatusColor(status: AppStatus) {
    switch (status) {
        case "pending": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
        case "hr_approve": return "bg-blue-500/10 border-blue-500/20 text-blue-400"
        case "teamlead_approve": return "bg-purple-500/10 border-purple-500/20 text-purple-400"
        case "ready_for_checkin": return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
        case "hired": return "bg-green-500/10 border-green-500/20 text-green-400"
        case "rejected": return "bg-red-500/10 border-red-500/20 text-red-400"
        default: return "bg-white/10 border-white/20 text-slate-400"
    }
}

// --- Circular Progress Ring ---
function AtsRing({ score }: { score: number }) {
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference
    const label = score >= 80 ? "High Match" : score >= 60 ? "Good Match" : "Low Match"

    return (
        <div className="relative flex items-center justify-center">
            <svg className="w-40 h-40" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={radius} fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                <circle
                    cx="80" cy="80" r={radius} fill="transparent"
                    stroke="url(#ats-gradient)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
                <defs>
                    <linearGradient id="ats-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#D946EF" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-4xl font-extrabold text-white tracking-tighter">{score}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">{label}</span>
            </div>
        </div>
    )
}

// --- Timeline Stage ---
function TimelineStage({
    stage, index, currentStageIndex, isRejected, isLast, app
}: {
    stage: typeof STATUS_STAGES[number]
    index: number
    currentStageIndex: number
    isRejected: boolean
    isLast: boolean
    app: Application
}) {
    const isDone = index < currentStageIndex
    const isCurrent = index === currentStageIndex && !isRejected
    const isLocked = index > currentStageIndex || isRejected

    return (
        <div className={`flex gap-4 ${isLast ? "" : "min-h-[80px]"}`}>
            <div className="flex flex-col items-center">
                {/* Node */}
                {isDone ? (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                        <Check className="h-4 w-4 text-white" />
                    </div>
                ) : isCurrent ? (
                    <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center z-10 bg-[#0F1115] shadow-[0_0_20px_rgba(99,102,241,0.3)] -ml-1">
                        <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                    </div>
                ) : (
                    <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-10 ${isRejected && index > 0 ? "opacity-30" : ""}`}>
                        {isLast ? <Trophy className="h-3.5 w-3.5 text-slate-600" /> : <Lock className="h-3.5 w-3.5 text-slate-600" />}
                    </div>
                )}
                {/* Connector */}
                {!isLast && (
                    <div className={`w-0.5 h-full -mt-1 ${isDone && !isRejected ? "bg-primary/30" : "bg-white/10"}`} />
                )}
            </div>

            <div className={`flex flex-col pb-6 ${isCurrent ? "-mt-1" : ""}`}>
                <h4 className={`font-bold ${isCurrent ? "text-primary text-lg" : isDone ? "text-white text-base" : "text-slate-400 text-base"} ${isLocked ? "opacity-50" : ""}`}>
                    {stage.label}
                </h4>
                <p className={`text-xs ${isCurrent ? "text-slate-300 text-sm" : isDone ? "text-slate-500" : "text-slate-600"} ${isLocked ? "opacity-50" : ""}`}>
                    {isLocked ? "Pending previous steps" : stage.description(app)}
                </p>
                {/* Info callout on current stage */}
                {isCurrent && (
                    <div className="mt-3 glass-panel-obsidian border border-primary/20 p-3 rounded-2xl flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                            The hiring team usually responds within <span className="text-white font-medium">2-3 business days</span> at this stage.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// --- Application Card (for multi-app selector) ---
function AppSelector({
    applications, jobs, selectedId, onSelect
}: {
    applications: Application[], jobs: Job[], selectedId: string, onSelect: (id: string) => void
}) {
    const [open, setOpen] = useState(false)
    if (applications.length <= 1) return null

    return (
        <div className="px-4 mb-2">
            <button
                onClick={() => setOpen(!open)}
                className="w-full glass-panel-obsidian rounded-2xl p-3 flex items-center justify-between text-sm text-slate-300 hover:border-white/20 transition-colors"
            >
                <span>{applications.length} Applications — tap to switch</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="mt-2 glass-panel-obsidian rounded-2xl overflow-hidden divide-y divide-white/5 animate-fade-in">
                    {applications.map(app => {
                        const job = jobs.find(j => j.id === app.jobId)
                        return (
                            <button
                                key={app.id}
                                onClick={() => { onSelect(app.id); setOpen(false) }}
                                className={`w-full text-left p-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${app.id === selectedId ? "bg-primary/10" : ""}`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                                    {job?.title?.charAt(0) || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{job?.title || "Unknown Role"}</p>
                                    <p className="text-slate-500 text-xs">{job?.orgName || ""}</p>
                                </div>
                                <Badge className={`text-[10px] px-2 py-0.5 border ${getStatusColor(app.status)}`}>
                                    {getStatusLabel(app.status)}
                                </Badge>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// ========================
// MAIN COMPONENT
// ========================
export default function CandidateDashboard() {
    const { currentUser, isAuthenticated, logout, isLoading: authLoading, checkSession } = useAuthStore()
    const { applications, jobs, getCandidateApplications, isLoading: jobsLoading } = useJobStore()
    const router = useRouter()

    const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
    const hasFetched = React.useRef(false)

    useEffect(() => {
        if (currentUser && currentUser.role === "candidate" && !hasFetched.current) {
            console.log("CandidateDashboard: Triggering fetch for", currentUser.id)
            hasFetched.current = true
            getCandidateApplications(currentUser.id)
        }
    }, [currentUser, getCandidateApplications])

    // Auto-select first app
    useEffect(() => {
        if (applications.length > 0 && !selectedAppId) {
            setSelectedAppId(applications[0].id)
        }
    }, [applications, selectedAppId])

    // --- Loading ---
    if (authLoading || jobsLoading) {
        return (
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!currentUser) return null

    const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0]
    const job = selectedApp ? jobs.find(j => j.id === selectedApp.jobId) : null

    // --- Empty State ---
    if (!selectedApp) {
        return (
            <div className="min-h-screen bg-[#0F1115] text-white flex flex-col">
                <Header onLogout={() => { logout(); router.push("/") }} userName={currentUser.name} />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Briefcase className="h-10 w-10 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
                    <p className="text-slate-400 mb-8 max-w-sm">
                        You haven&apos;t applied to any jobs yet. Browse open positions to get started.
                    </p>
                    <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90 text-white px-8">
                        Browse Jobs
                    </Button>
                </div>
            </div>
        )
    }

    const stageIndex = getStageIndex(selectedApp.status)
    const isRejected = selectedApp.status === "rejected"

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#0F1115] overflow-x-hidden text-white">
            {/* Background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="orb orb-1 opacity-20" />
                <div className="orb orb-2 opacity-20" />
            </div>

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 w-full glass-panel-obsidian px-4 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.push("/")}
                    className="flex w-10 h-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-white" />
                </button>
                <h1 className="font-heading text-lg font-bold tracking-tight text-white">Application Status</h1>
                <button
                    onClick={() => { logout(); router.push("/") }}
                    className="flex w-10 h-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <User className="h-5 w-5 text-white" />
                </button>
            </header>

            <main className="flex-1 flex flex-col gap-6 p-4 pb-32 relative z-10">
                {/* Multi-app selector */}
                <AppSelector
                    applications={applications}
                    jobs={jobs}
                    selectedId={selectedApp.id}
                    onSelect={setSelectedAppId}
                />

                {/* Job Summary Card */}
                <section className="glass-panel-obsidian rounded-3xl p-5 flex flex-col gap-4 animate-fade-in">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 p-[1px] shrink-0">
                            <div className="w-full h-full bg-[#0F1115] rounded-[15px] flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{job?.title?.charAt(0) || "?"}</span>
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h2 className="font-heading text-xl font-bold text-white truncate">{job?.title || "Unknown Role"}</h2>
                            <p className="text-slate-400 text-sm">{job?.orgName || "Unknown Company"} • {job?.location || "Remote"}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(selectedApp.status)}`}>
                            {selectedApp.status === "pending" && <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                            {selectedApp.status === "hired" && <span className="w-2 h-2 rounded-full bg-green-500" />}
                            {selectedApp.status === "rejected" && <span className="w-2 h-2 rounded-full bg-red-500" />}
                            <span className="text-xs font-bold uppercase tracking-wider">{getStatusLabel(selectedApp.status)}</span>
                        </div>
                        <span className="text-slate-500 text-xs">
                            Applied {Math.ceil((Date.now() - new Date(selectedApp.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </span>
                    </div>
                </section>

                {/* ATS Match Insights */}
                <section className="glass-panel-obsidian rounded-3xl p-6 flex flex-col items-center gap-4 relative overflow-hidden animate-slide-in-up">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-fuchsia-500/10 blur-3xl rounded-full" />
                    <h3 className="font-heading text-base font-semibold text-slate-300 self-start">ATS Profile Match</h3>
                    <AtsRing score={selectedApp.atsScore} />

                    {/* Skills insight */}
                    {selectedApp.skillsFound.length > 0 && (
                        <div className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-sm text-slate-300 text-center">
                                Your skills in{" "}
                                {selectedApp.skillsFound.slice(0, 3).map((skill, i) => (
                                    <React.Fragment key={skill}>
                                        <span className={i % 2 === 0 ? "text-fuchsia-400 font-semibold" : "text-primary font-semibold"}>{skill}</span>
                                        {i < Math.min(selectedApp.skillsFound.length, 3) - 1 && (i === Math.min(selectedApp.skillsFound.length, 3) - 2 ? " and " : ", ")}
                                    </React.Fragment>
                                ))}{" "}
                                match this role well.
                            </p>
                        </div>
                    )}

                    {/* Missing skills */}
                    {selectedApp.missingSkills.length > 0 && (
                        <div className="w-full p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                            <p className="text-sm text-slate-400 text-center">
                                Consider adding: {selectedApp.missingSkills.map((s, i) => (
                                    <span key={s} className="text-red-400 font-medium">{s}{i < selectedApp.missingSkills.length - 1 ? ", " : ""}</span>
                                ))}
                            </p>
                        </div>
                    )}
                </section>

                {/* Timeline */}
                <section className="flex flex-col gap-4 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
                    <h3 className="font-heading text-lg font-bold text-white px-1">Timeline</h3>

                    {isRejected && (
                        <div className="mx-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <Info className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-300 font-medium text-sm">Application Not Selected</p>
                                <p className="text-red-200/60 text-xs mt-1">
                                    {selectedApp.comments || "Unfortunately, your application was not selected to move forward. Consider updating your resume and reapplying."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-0 px-2">
                        {STATUS_STAGES.map((stage, i) => (
                            <TimelineStage
                                key={stage.key}
                                stage={stage}
                                index={i}
                                currentStageIndex={stageIndex}
                                isRejected={isRejected}
                                isLast={i === STATUS_STAGES.length - 1}
                                app={selectedApp}
                            />
                        ))}
                    </div>
                </section>

                {/* Hired celebration */}
                {selectedApp.status === "hired" && (
                    <section className="glass-panel-obsidian rounded-3xl p-6 text-center border border-green-500/20 animate-scale-in">
                        <div className="text-4xl mb-3">🎉</div>
                        <h3 className="font-heading text-xl font-bold text-green-400 mb-2">Congratulations!</h3>
                        <p className="text-slate-400 text-sm">You&apos;ve been hired! Check your email for next steps.</p>
                    </section>
                )}

                {/* Improvement tips */}
                {selectedApp.tips && selectedApp.tips.length > 0 && (
                    <section className="glass-panel-obsidian rounded-3xl p-5 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
                        <h3 className="font-heading text-base font-semibold text-slate-300 mb-3">💡 Improvement Tips</h3>
                        <ul className="space-y-2">
                            {selectedApp.tips.map((tip, i) => (
                                <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </div>
    )
}

// --- Header for empty state ---
function Header({ onLogout, userName }: { onLogout: () => void; userName: string }) {
    return (
        <header className="sticky top-0 z-50 w-full glass-panel-obsidian px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                    H
                </div>
                <span className="font-bold text-lg text-white">HireScope</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 hidden sm:inline">{userName}</span>
                <button onClick={onLogout} className="text-slate-400 hover:text-white text-sm transition-colors">Log Out</button>
            </div>
        </header>
    )
}


