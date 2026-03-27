"use client"

import { useEffect, useMemo } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Activity, Trophy, ArrowRight, ArrowDown } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useJobStore } from "@/store/job-store"

export default function AnalyticsDashboard() {
    const { currentUser } = useAuthStore()
    const { applications, getJobsByOrg, getApplicationsByOrg } = useJobStore()

    useEffect(() => {
        if (currentUser?.organisationId) {
            getJobsByOrg(currentUser.organisationId)
            getApplicationsByOrg(currentUser.organisationId)
        }
    }, [currentUser, getJobsByOrg, getApplicationsByOrg])

    // Compute Metrics safely inside useMemo
    const metrics = useMemo(() => {
        const total = applications.length
        const passedApps = applications.filter(a => a.status !== 'rejected')
        const hrApprovedApps = applications.filter(a => ['interviewing', 'offered', 'hired'].includes(a.status))
        const hiredApps = applications.filter(a => a.status === 'hired')

        const totalScore = applications.reduce((sum, app) => sum + (app.atsScore || 0), 0)
        const averageScore = total > 0 ? Math.round(totalScore / total) : 0
        const passRate = total > 0 ? Math.round((passedApps.length / total) * 100) : 0

        const distribution = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0
        }

        applications.forEach(a => {
            const score = a.atsScore || 0
            if (score <= 20) distribution['0-20']++
            else if (score <= 40) distribution['21-40']++
            else if (score <= 60) distribution['41-60']++
            else if (score <= 80) distribution['61-80']++
            else distribution['81-100']++
        })

        const maxDistCount = Math.max(...Object.values(distribution))

        return {
            totalApplications: total,
            passedApplications: passedApps.length,
            hrApproved: hrApprovedApps.length,
            hired: hiredApps.length,
            passRate,
            averageScore,
            distribution,
            maxDistCount
        }
    }, [applications])

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />

            <div className="flex-1 overflow-x-hidden">
                <DashboardHeader
                    title="Analytics Dashboard"
                    subtitle="Track your hiring performance and AI screening metrics."
                />

                <main className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Applications"
                            value={metrics.totalApplications}
                            icon={<Users className="h-5 w-5 text-primary" />}
                            iconColor="bg-primary/10"
                        />
                        <StatCard
                            title="Average ATS Score"
                            value={`${metrics.averageScore}%`}
                            icon={<Target className="h-5 w-5 text-accent-4" />}
                            iconColor="bg-accent-4/10"
                        />
                        <StatCard
                            title="Pass Rate"
                            value={`${metrics.passRate}%`}
                            icon={<Activity className="h-5 w-5 text-accent-3" />}
                            iconColor="bg-accent-3/10"
                        />
                        <StatCard
                            title="Hired Count"
                            value={metrics.hired}
                            icon={<Trophy className="h-5 w-5 text-success" />}
                            iconColor="bg-success/10"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Hiring Funnel */}
                        <Card className="col-span-1 border-white/10 glass-panel-obsidian">
                            <CardHeader>
                                <CardTitle className="text-white">Overall Hiring Funnel</CardTitle>
                                <CardDescription className="text-slate-400">Candidate progression flow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                                    <div className="flex-1 w-full bg-white/5 p-4 rounded-xl text-center border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-sm text-slate-400 relative z-10">Applied</p>
                                        <p className="text-3xl font-bold mt-1 text-white relative z-10">{metrics.totalApplications}</p>
                                    </div>
                                    
                                    <ArrowRight className="hidden sm:block text-slate-500 flex-shrink-0" />
                                    <ArrowDown className="sm:hidden text-slate-500 flex-shrink-0" />

                                    <div className="flex-1 w-full bg-white/5 p-4 rounded-xl text-center border border-white/10 relative overflow-hidden group hover:border-accent-3/50 transition-colors">
                                        <div className="absolute inset-0 bg-accent-3/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-sm text-slate-400 relative z-10">AI Passed</p>
                                        <p className="text-3xl font-bold mt-1 text-white relative z-10">{metrics.passedApplications}</p>
                                    </div>

                                    <ArrowRight className="hidden sm:block text-slate-500 flex-shrink-0" />
                                    <ArrowDown className="sm:hidden text-slate-500 flex-shrink-0" />

                                    <div className="flex-1 w-full bg-white/5 p-4 rounded-xl text-center border border-white/10 relative overflow-hidden group hover:border-accent-4/50 transition-colors">
                                        <div className="absolute inset-0 bg-accent-4/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-sm text-slate-400 relative z-10">HR Approved</p>
                                        <p className="text-3xl font-bold mt-1 text-white relative z-10">{metrics.hrApproved}</p>
                                    </div>

                                    <ArrowRight className="hidden sm:block text-slate-500 flex-shrink-0" />
                                    <ArrowDown className="sm:hidden text-slate-500 flex-shrink-0" />

                                    <div className="flex-1 w-full bg-white/5 p-4 rounded-xl text-center border border-success/30 relative overflow-hidden group hover:border-success transition-colors">
                                        <div className="absolute inset-0 bg-success/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-sm text-slate-400 relative z-10">Hired</p>
                                        <p className="text-3xl font-bold mt-1 text-success relative z-10">{metrics.hired}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ATS Score Distribution */}
                        <Card className="col-span-1 border-white/10 glass-panel-obsidian">
                            <CardHeader>
                                <CardTitle className="text-white">ATS Score Distribution</CardTitle>
                                <CardDescription className="text-slate-400">Total number of applications by score range</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pr-4">
                                    {Object.entries(metrics.distribution).map(([range, count]) => {
                                        const percentage = metrics.maxDistCount > 0 
                                            ? Math.max(2, (count / metrics.maxDistCount) * 100) 
                                            : 0;
                                        
                                        return (
                                            <div key={range} className="flex items-center gap-4 group">
                                                <div className="w-[80px] text-sm text-slate-400 text-right group-hover:text-white transition-colors">
                                                    {range}
                                                </div>
                                                <div className="flex-1 h-8 bg-white/5 rounded-r-md flex items-center">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-primary to-accent-4 rounded-r-md transition-all duration-500 relative"
                                                        style={{ width: `${percentage}%` }}
                                                    >
                                                        {percentage > 0 && (
                                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-md" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-[30px] text-sm font-medium text-white group-hover:text-primary transition-colors">
                                                    {count}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
