"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, Brain, Zap, Target } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import { cn } from "@/lib/utils"

export default function ResumeAnalysisPage() {
    const [isAnalyzing, setIsAnalyzing] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [analysisResult, setAnalysisResult] = React.useState<null | {
        score: number
        skills: string[]
        missingKeywords: string[]
        formatting: "good" | "issues"
    }>(null)

    const handleUpload = (files: File[]) => {
        if (files.length > 0) {
            startAnalysis()
        }
    }

    const startAnalysis = () => {
        setIsAnalyzing(true)
        setProgress(0)

        // Simulate analysis process
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    finishAnalysis()
                    return 100
                }
                return prev + 2
            })
        }, 50)
    }

    const finishAnalysis = () => {
        setIsAnalyzing(false)
        setAnalysisResult({
            score: 85,
            skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Next.js"],
            missingKeywords: ["GraphQL", "AWS", "Docker"],
            formatting: "good"
        })
    }

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
                <DashboardHeader title="Resume Analysis" subtitle="AI-powered feedback on your resume" />

                <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
                    {!analysisResult && !isAnalyzing && (
                        <div className="grid gap-6 animate-fade-in">
                            <Card className="glass-card border-dashed border-2">
                                <CardHeader>
                                    <CardTitle>Upload Your Resume</CardTitle>
                                    <CardDescription>
                                        We support PDF and DOCX formats. Max file size 5MB.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FileUpload onFilesChange={handleUpload} />
                                </CardContent>
                            </Card>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { icon: Brain, title: "Smart Parsing", desc: "Extracts skills and experience automatically" },
                                    { icon: Target, title: "Keyword Matching", desc: "Compares against top job requirements" },
                                    { icon: Zap, title: "Instant Feedback", desc: "Get actionable insights in seconds" }
                                ].map((feature, i) => (
                                    <Card key={i} className="glass-card">
                                        <CardHeader>
                                            <feature.icon className="h-8 w-8 text-primary mb-2" />
                                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                                            <CardDescription>{feature.desc}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {isAnalyzing && (
                        <Card className="max-w-md mx-auto mt-12 glass-card animate-fade-in">
                            <CardContent className="pt-6 text-center space-y-6">
                                <div className="relative h-24 w-24 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                                    <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                                    <Brain className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-xl font-bold">Analyzing Resume...</h3>
                                    <p className="text-muted-foreground">Extracting skills and checking formatting</p>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </CardContent>
                        </Card>
                    )}

                    {analysisResult && (
                        <div className="space-y-6 animate-slide-in-up">
                            {/* Score Overview */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card className="glass-card md:col-span-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                                    <CardHeader>
                                        <CardTitle>Overall Score</CardTitle>
                                        <CardDescription>Based on industry standards</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center py-6">
                                        <div className="relative flex items-center justify-center">
                                            <svg className="h-32 w-32 transform -rotate-90">
                                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * analysisResult.score) / 100} />
                                            </svg>
                                            <span className="absolute text-4xl font-bold">{analysisResult.score}</span>
                                        </div>
                                        <p className="mt-4 text-sm font-medium text-primary">Excellent!</p>
                                    </CardContent>
                                </Card>

                                <Card className="glass-card md:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Analysis Summary</CardTitle>
                                        <CardDescription>Key findings from your resume</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-5 w-5 text-success" />
                                            <span>Formatting and layout are ATS-friendly</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-5 w-5 text-success" />
                                            <span>Good use of action verbs</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <AlertCircle className="h-5 w-5 text-warning" />
                                            <span>Consider adding more quantitative results</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" onClick={() => setAnalysisResult(null)}>
                                            Upload New Version
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            {/* Detailed Breakdown */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="glass-card">
                                    <CardHeader>
                                        <CardTitle>Skills Detected</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.skills.map(skill => (
                                                <Badge key={skill} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="glass-card">
                                    <CardHeader>
                                        <CardTitle>Missing Keywords</CardTitle>
                                        <CardDescription>Consider adding these if relevant</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.missingKeywords.map(keyword => (
                                                <Badge key={keyword} variant="outline" className="px-3 py-1 border-dashed">
                                                    + {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
