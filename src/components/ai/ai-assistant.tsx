"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Loader2, X, MessageSquare, Briefcase, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AIAssistantProps {
    mode: "resume_analysis" | "job_description" | "general_hr_help" | "algorithm" | "code"
    initialData?: any
    placeholder?: string
}

export function AIAssistant({ mode, initialData, placeholder }: AIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [feedback, setFeedback] = useState<any>(null)
    const [query, setQuery] = useState("")

    const handleGetHelp = async () => {
        setIsLoading(true)
        setFeedback(null)
        try {
            const body = {
                mode,
                ...initialData,
                query: mode === "general_hr_help" ? query : undefined
            }

            const response = await fetch("/api/ai/assist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            setFeedback(data.feedback)
        } catch (error) {
            console.error("AI Error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-80 md:w-96"
                    >
                        <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md overflow-hidden">
                            <CardHeader className="bg-primary/5 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <CardTitle className="text-sm">HireAuto AI Assistant</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsOpen(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardDescription className="text-xs pt-1">
                                    {mode === "resume_analysis" ? "Candidate Insights & Scoring" : 
                                     mode === "job_description" ? "Optimize your job postings" : 
                                     mode === "algorithm" ? "Algorithm Review & Hints" :
                                     mode === "code" ? "Code Logic & Complexity Review" :
                                     "General hiring & HR advice"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                                {(mode === "general_hr_help" || mode === "algorithm" || mode === "code") && !feedback && (
                                    <div className="space-y-3">
                                        <textarea
                                            className="w-full min-h-[80px] p-2 text-sm rounded-md border bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder={placeholder || 
                                                (mode === "algorithm" ? "Explain your logic or paste your pseudo-code..." : 
                                                 mode === "code" ? "Paste your code snippet here for review..." : 
                                                 "Ask me anything about hiring...")
                                            }
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                        />
                                        <Button 
                                            className="w-full text-xs" 
                                            size="sm" 
                                            disabled={!query || isLoading}
                                            onClick={handleGetHelp}
                                        >
                                            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <MessageSquare className="h-3 w-3 mr-2" />}
                                            Get AI Assessment
                                        </Button>
                                    </div>
                                )}

                                {(mode !== "general_hr_help" || (mode === "general_hr_help" && feedback)) && (
                                    <div className="space-y-4">
                                        {!feedback && !isLoading && (
                                            <Button className="w-full text-xs" size="sm" onClick={handleGetHelp}>
                                                <Sparkles className="h-3 w-3 mr-2" />
                                                Generate AI Insights
                                            </Button>
                                        )}

                                        {isLoading && (
                                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                                <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary/40" />
                                                <p className="text-xs animate-pulse">Thinking with Gemini...</p>
                                            </div>
                                        )}

                                        {feedback && (
                                            <div className="text-sm space-y-3">
                                                {typeof feedback === 'string' ? (
                                                    <div className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                                        {feedback}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ATS Score</span>
                                                            <span className={`text-lg font-bold ${feedback.score > 70 ? 'text-green-500' : 'text-amber-500'}`}>
                                                                {feedback.score}%
                                                            </span>
                                                        </div>
                                                        <div className="bg-muted/50 p-3 rounded-lg border border-border/50 italic text-xs leading-relaxed">
                                                            "{feedback.summary}"
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="text-[10px] font-bold uppercase text-primary/80">Key Analysis</h4>
                                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                                {feedback.semanticAnalysis}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="text-[10px] font-bold uppercase text-primary/80">Actionable Tips</h4>
                                                            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                                                                {feedback.tips.map((tip: string, i: number) => (
                                                                    <li key={i}>{tip}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                                <Button variant="outline" size="sm" className="w-full text-[10px] h-7" onClick={() => setFeedback(null)}>
                                                    Ask Again
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="lg"
                className={`rounded-full h-14 w-14 shadow-2xl transition-all duration-300 ${isOpen ? 'rotate-90 bg-muted text-muted-foreground hover:bg-muted' : 'bg-primary hover:bg-primary/90 hover:scale-105 shadow-primary/20'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Sparkles className={`h-6 w-6 transition-transform ${isLoading ? 'animate-pulse' : ''}`} />
            </Button>
        </div>
    )
}
