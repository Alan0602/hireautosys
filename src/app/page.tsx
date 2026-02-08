"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, FileText, FileSearch, TrendingUp, Zap, Users, Clock, Target, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold">HireScope</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-mesh py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Hiring Intelligence
            </Badge>
            <h1 className="display text-balance">
              Transform Your Recruitment with{" "}
              <span className="bg-gradient-to-r from-primary-500 to-accent-1 bg-clip-text text-transparent">
                Intelligent Matching
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Cut hiring time by 75% and find the perfect candidates with AI-powered resume analysis and intelligent scoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/register">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline">Watch Demo</Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary">75%</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary">80%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Resumes Analyzed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Everything you need to hire smarter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven features designed to streamline your entire recruitment process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="elevated" className="animate-slide-in-up">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Resume Analysis</CardTitle>
                <CardDescription>
                  Advanced ML algorithms analyze resumes in seconds, extracting key skills and experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Skill matching & gap analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Experience relevance scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Cultural fit assessment
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent-3/10 flex items-center justify-center mb-4">
                  <FileSearch className="h-6 w-6 text-accent-3" />
                </div>
                <CardTitle>Intelligent Scoring</CardTitle>
                <CardDescription>
                  Candidates receive comprehensive scores based on multiple dimensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Multi-factor scoring system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Transparent explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Customizable weights
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent-4/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent-4" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Track your hiring pipeline with beautiful, actionable dashboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Application funnel tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Candidate score distribution
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Time-to-hire metrics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent-2/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent-2" />
                </div>
                <CardTitle>Automated Workflows</CardTitle>
                <CardDescription>
                  Streamline repetitive tasks and focus on what matters most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Bulk resume processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Auto-rejection filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Email notifications
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent-1/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent-1" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work seamlessly with your hiring team with shared workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Role-based access control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Internal notes & feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Approval workflows
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated" className="animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Fast & Accurate</CardTitle>
                <CardDescription>
                  Process hundreds of resumes in minutes with high accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Sub-second analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    99.5% uptime SLA
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Scalable infrastructure
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Simple, powerful, effective
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and transform your hiring process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-heading font-bold text-primary">
                1
              </div>
              <h3 className="text-xl font-heading font-semibold">Create Job Posting</h3>
              <p className="text-muted-foreground">
                Define requirements, skills, and experience needed. Our AI helps you craft the perfect job description.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-heading font-bold text-primary">
                2
              </div>
              <h3 className="text-xl font-heading font-semibold">Upload Resumes</h3>
              <p className="text-muted-foreground">
                Bulk upload candidate resumes. Our AI analyzes each one in seconds, extracting key information.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-heading font-bold text-primary">
                3
              </div>
              <h3 className="text-xl font-heading font-semibold">Review & Hire</h3>
              <p className="text-muted-foreground">
                Get ranked candidates with detailed scores. Review insights and make data-driven hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card variant="glass" className="p-12 text-center space-y-6 gradient-mesh">
            <Target className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Ready to revolutionize your hiring?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of companies using HireScope to find the perfect candidates faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Contact Sales</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 w-full">
        <div className="container px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-heading font-bold">HireScope</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered hiring intelligence platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2026 HireScope. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
