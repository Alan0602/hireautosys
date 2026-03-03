"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth-store"
import { useJobStore } from "@/store/job-store"
import {
    Briefcase, MapPin, Clock, Calendar, Sparkles, CheckCircle2,
    Copy, ExternalLink, X, Plus, Building2, GraduationCap, Target
} from "lucide-react"

export default function CreateJobPage() {
    const router = useRouter()
    const { currentUser, organisation } = useAuthStore()
    const { createJob } = useJobStore()

    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "Remote",
        experience: "",
        skills: "",
        description: "",
        responsibilities: [""],
        requirements: [""],
        benefits: [""],
        atsThreshold: 70,
        expiryDate: "",
    })

    const [showSuccess, setShowSuccess] = useState(false)
    const [createdSlug, setCreatedSlug] = useState("")
    const [copied, setCopied] = useState(false)

    // Set default expiry date to 30 days from now
    useEffect(() => {
        const d = new Date()
        d.setDate(d.getDate() + 30)
        setFormData(prev => ({ ...prev, expiryDate: d.toISOString().split('T')[0] }))
    }, [])

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const addListItem = (field: 'responsibilities' | 'requirements' | 'benefits') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }))
    }

    const updateListItem = (field: 'responsibilities' | 'requirements' | 'benefits', index: number, value: string) => {
        setFormData(prev => {
            const updated = [...prev[field]]
            updated[index] = value
            return { ...prev, [field]: updated }
        })
    }

    const removeListItem = (field: 'responsibilities' | 'requirements' | 'benefits', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

    const handleGenerate = async () => {
        if (!currentUser || !organisation) return
        if (!formData.title.trim() || !formData.department.trim()) return

        const job = await createJob({
            organisationId: currentUser.organisationId,
            orgName: organisation.name,
            title: formData.title.trim(),
            department: formData.department.trim(),
            location: formData.location,
            experience: formData.experience.trim(),
            skills: skillsArray,
            description: formData.description.trim(),
            responsibilities: formData.responsibilities.filter(Boolean),
            requirements: formData.requirements.filter(Boolean),
            benefits: formData.benefits.filter(Boolean),
            atsThreshold: formData.atsThreshold,
            expiryDate: new Date(formData.expiryDate).toISOString(),
        }, currentUser.id)

        if (job) {
            setCreatedSlug(job.slug)
            setShowSuccess(true)
        }
    }

    const publicUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/apply/${createdSlug}`
        : `/apply/${createdSlug}`

    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader title="Create New Job" />

                <main className="flex-1 p-6">
                    <div className="grid lg:grid-cols-5 gap-6 max-w-[1400px] mx-auto">

                        {/* ============ LEFT: FORM ============ */}
                        <div className="lg:col-span-3 space-y-6">

                            {/* Basics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        Job Basics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Job Title *</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Senior Frontend Developer"
                                            value={formData.title}
                                            onChange={(e) => updateField("title", e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="department">Department *</Label>
                                            <Input
                                                id="department"
                                                placeholder="e.g. Engineering"
                                                value={formData.department}
                                                onChange={(e) => updateField("department", e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="experience">Experience Level</Label>
                                            <Input
                                                id="experience"
                                                placeholder="e.g. 3-5 years"
                                                value={formData.experience}
                                                onChange={(e) => updateField("experience", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Location</Label>
                                        <div className="flex gap-2">
                                            {["Remote", "Onsite", "Hybrid"].map((loc) => (
                                                <Button
                                                    key={loc}
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => updateField("location", loc)}
                                                    className="rounded-full"
                                                >
                                                    {loc}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Skills */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Target className="h-5 w-5 text-primary" />
                                        Required Skills
                                    </CardTitle>
                                    <CardDescription>Comma-separated list — these are matched against applicant resumes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        placeholder="React, TypeScript, Node.js, AWS, Figma"
                                        value={formData.skills}
                                        onChange={(e) => updateField("skills", e.target.value)}
                                    />
                                    {skillsArray.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {skillsArray.map((skill, i) => (
                                                <Badge key={i} variant="secondary" className="px-3 py-1">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        Job Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label>About the Role</Label>
                                        <textarea
                                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                                            placeholder="Describe the role and what makes it exciting..."
                                            value={formData.description}
                                            onChange={(e) => updateField("description", e.target.value)}
                                        />
                                    </div>

                                    {/* Responsibilities */}
                                    <div className="grid gap-2">
                                        <Label>Key Responsibilities</Label>
                                        {formData.responsibilities.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => updateListItem("responsibilities", i, e.target.value)}
                                                    placeholder="e.g. Build and maintain frontend features..."
                                                />
                                                {formData.responsibilities.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeListItem("responsibilities", i)}
                                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addListItem("responsibilities")}
                                            className="w-fit"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    {/* Requirements */}
                                    <div className="grid gap-2">
                                        <Label>Requirements</Label>
                                        {formData.requirements.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => updateListItem("requirements", i, e.target.value)}
                                                    placeholder="e.g. 3+ years of React experience..."
                                                />
                                                {formData.requirements.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeListItem("requirements", i)}
                                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addListItem("requirements")}
                                            className="w-fit"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    {/* Benefits */}
                                    <div className="grid gap-2">
                                        <Label>Benefits & Perks</Label>
                                        {formData.benefits.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => updateListItem("benefits", i, e.target.value)}
                                                    placeholder="e.g. Remote work, health insurance..."
                                                />
                                                {formData.benefits.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeListItem("benefits", i)}
                                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addListItem("benefits")}
                                            className="w-fit"
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ATS & Expiry */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        ATS & Scheduling
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3">
                                        <div className="flex items-center justify-between">
                                            <Label>ATS Threshold Score</Label>
                                            <span className="text-sm font-bold text-primary">{formData.atsThreshold}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="30"
                                            max="100"
                                            value={formData.atsThreshold}
                                            onChange={(e) => updateField("atsThreshold", parseInt(e.target.value))}
                                            className="w-full accent-primary h-2 rounded-full cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Applicants scoring below this threshold will receive improvement suggestions
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            type="date"
                                            value={formData.expiryDate}
                                            onChange={(e) => updateField("expiryDate", e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={!formData.title.trim() || !formData.department.trim()}
                                className="w-full h-12 text-lg bg-primary hover:bg-primary/90 shadow-glow"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate Public Link
                            </Button>
                        </div>

                        {/* ============ RIGHT: LIVE PREVIEW ============ */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-6 space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Live Preview
                                </h3>

                                <Card className="overflow-hidden border-primary/20">
                                    {/* Preview Header */}
                                    <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 border-b">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                                <Building2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium">{organisation?.name || "Your Company"}</span>
                                            <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                                                Now Hiring
                                            </Badge>
                                        </div>
                                        <h2 className="text-xl font-bold mb-2">
                                            {formData.title || "Job Title"}
                                        </h2>
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {formData.location || "Location"}
                                            </span>
                                            {formData.experience && (
                                                <span className="flex items-center gap-1">
                                                    <GraduationCap className="h-3 w-3" /> {formData.experience}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="h-3 w-3" /> {formData.department || "Department"}
                                            </span>
                                            {formData.expiryDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Expires {new Date(formData.expiryDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <CardContent className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                                        {/* Skills Tags */}
                                        {skillsArray.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Required Skills</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {skillsArray.map((skill, i) => (
                                                        <Badge key={i} variant="outline" className="text-xs px-2.5 py-0.5 font-normal">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Description */}
                                        {formData.description && (
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">About the Role</p>
                                                <p className="text-sm leading-relaxed">{formData.description}</p>
                                            </div>
                                        )}

                                        {/* Responsibilities */}
                                        {formData.responsibilities.some(Boolean) && (
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Responsibilities</p>
                                                <ul className="space-y-1.5">
                                                    {formData.responsibilities.filter(Boolean).map((item, i) => (
                                                        <li key={i} className="flex gap-2 text-sm">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Requirements */}
                                        {formData.requirements.some(Boolean) && (
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Requirements</p>
                                                <ul className="space-y-1.5">
                                                    {formData.requirements.filter(Boolean).map((item, i) => (
                                                        <li key={i} className="flex gap-2 text-sm">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Benefits */}
                                        {formData.benefits.some(Boolean) && (
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Benefits</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {formData.benefits.filter(Boolean).map((item, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* ATS note */}
                                        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs">
                                            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">
                                                AI-powered screening with <span className="text-primary font-medium">{formData.atsThreshold}%</span> threshold
                                            </span>
                                        </div>

                                        {/* Empty state */}
                                        {!formData.title && !formData.description && skillsArray.length === 0 && (
                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                Start filling the form to see a live preview here
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* ============ SUCCESS MODAL ============ */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <Card className="w-full max-w-md shadow-2xl animate-fade-in border-primary/20">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                <CheckCircle2 className="h-8 w-8 text-green-400" />
                            </div>
                            <CardTitle className="text-xl">Job Published!</CardTitle>
                            <CardDescription>
                                Your job posting is live. Share the link with candidates.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border text-sm font-mono break-all">
                                <span className="flex-1 text-xs">{publicUrl}</span>
                                <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
                                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => window.open(`/apply/${createdSlug}`, '_blank')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Preview
                                </Button>
                                <Button
                                    onClick={() => router.push('/hr/jobs')}
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                >
                                    Go to Jobs
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
