"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  FileText,
  Sparkles,
  Brain,
  Users,
  Zap,
  CheckCircle,
  Menu,
  Gem,
  Edit,
  UploadCloud,
  Check,
  TrendingUp,
  Clock,
  Target,
  FileSearch,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-obsidian text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[80px] flex items-center justify-center px-6 pt-4">
        <div className="w-full max-w-5xl glass-panel-obsidian rounded-2xl px-6 h-full flex items-center justify-between shadow-2xl shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-glow">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">HireScope</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-white hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-glow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-[140px] px-6 pb-24">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center mb-32">
          {/* Badge */}
          <div className="relative group mb-8 inline-flex">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative px-4 py-2 glass-panel-obsidian rounded-full border border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-white/90">AI-Powered Hiring Intelligence</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white leading-[1.1]">
            Transform Your <br className="hidden md:block" />
            Recruitment with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400 text-glow">Intelligent Matching</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Cut hiring time by 75% and find the perfect candidates with AI-powered resume analysis and intelligent scoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md mx-auto">
            <Link href="/register" className="flex-1">
              <button className="group relative w-full h-[56px] rounded-full bg-primary text-white font-semibold text-lg shadow-glow transition-all duration-300 active:scale-95 hover:shadow-[0_0_50px_-5px_rgba(99,102,241,0.6)] overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <Link href="#demo" className="flex-1">
              <button className="w-full h-[56px] rounded-full border border-white/10 glass-panel-obsidian text-white font-semibold text-lg hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-2">
                Watch Demo
              </button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
            {[
              { value: "75%", label: "Time Saved", delay: "0s" },
              { value: "80%", label: "Accuracy", delay: "0.1s" },
              { value: "10k+", label: "Resumes Analyzed", delay: "0.2s" }
            ].map((stat, i) => (
              <div key={i} className="glass-panel-obsidian rounded-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: stat.delay }}>
                <div className="text-4xl font-bold text-white mb-1 text-glow">{stat.value}</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Features</h2>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to hire smarter</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Powerful AI-driven features designed to streamline your entire recruitment process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <FeatureCard
              icon={Brain}
              color="text-[#D946EF]"
              glowColor="rgba(217,70,239,0.2)"
              title="AI Resume Analysis"
              desc="Advanced ML algorithms analyze resumes in seconds, extracting key skills and experience."
              benefits={["Skill matching & gap analysis", "Experience relevance scoring", "Cultural fit assessment"]}
            />

            {/* Feature 2 */}
            <FeatureCard
              icon={FileSearch}
              color="text-[#10B981]"
              glowColor="rgba(16,185,129,0.2)"
              title="Intelligent Scoring"
              desc="Candidates receive comprehensive scores based on multiple dimensions."
              benefits={["Multi-factor scoring system", "Transparent explanations", "Customizable weights"]}
            />

            {/* Feature 3 */}
            <FeatureCard
              icon={TrendingUp}
              color="text-[#F59E0B]"
              glowColor="rgba(245,158,11,0.2)"
              title="Real-time Analytics"
              desc="Track your hiring pipeline with beautiful, actionable dashboards."
              benefits={["Application funnel tracking", "Candidate score distribution", "Time-to-hire metrics"]}
            />

            {/* Feature 4 */}
            <FeatureCard
              icon={Zap}
              color="text-primary"
              glowColor="rgba(99,102,241,0.2)"
              title="Automated Workflows"
              desc="Streamline repetitive tasks and focus on what matters most."
              benefits={["Bulk resume processing", "Auto-rejection filters", "Email notifications"]}
            />

            {/* Feature 5 */}
            <FeatureCard
              icon={Users}
              color="text-[#EC4899]"
              glowColor="rgba(236,72,153,0.2)"
              title="Team Collaboration"
              desc="Work seamlessly with your hiring team with shared workflows."
              benefits={["Role-based access control", "Internal notes & feedback", "Approval workflows"]}
            />

            {/* Feature 6 */}
            <FeatureCard
              icon={Clock}
              color="text-[#3B82F6]"
              glowColor="rgba(59,130,246,0.2)"
              title="Fast & Accurate"
              desc="Process hundreds of resumes in minutes with high accuracy."
              benefits={["Sub-second analysis", "99.5% uptime SLA", "Scalable infrastructure"]}
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="max-w-4xl mx-auto mb-32 relative">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">The Workflow</h2>
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-6">How It Works</h2>
            <p className="text-slate-400 text-lg">From chaotic inbox to ranked shortlist in three simple steps.</p>
          </div>

          <div className="relative pl-8 md:pl-0">
            {/* Timeline Line (Center on desktop, left on mobile) */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] timeline-line md:-ml-[1px]"></div>

            {/* Step 1 */}
            <TimelineItem
              num="01"
              title="Create Job Posting"
              desc="Define requirements, skills, and experience needed. Our AI helps you craft the perfect job description."
              icon={Edit}
              alignment="left"
            />

            {/* Step 2 */}
            <TimelineItem
              num="02"
              title="Upload Resumes"
              desc="Bulk upload candidate resumes. Our AI analyzes each one in seconds, extracting key information."
              icon={UploadCloud}
              alignment="right"
            />

            {/* Step 3 */}
            <TimelineItem
              num="03"
              title="Review & Hire"
              desc="Get ranked candidates with detailed scores. Review insights and make data-driven hiring decisions."
              icon={Check}
              alignment="left"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="glass-panel-obsidian rounded-[32px] p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full -ml-20 -mb-20"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-glow">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to revolutionize your hiring?</h2>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
                Join hundreds of companies using HireScope to find the perfect candidates faster.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/register">
                  <button className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-glow hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.5)] transition-all transform active:scale-95">
                    Start Free Trial
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors">
                    Contact Sales
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-16 pb-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">HireScope</span>
              </div>
              <p className="text-slate-500 text-sm">
                AI-powered hiring intelligence platform.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-primary transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-slate-600 text-sm">
            © 2026 HireScope. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  )
}

// Components

function FeatureCard({ icon: Icon, color, glowColor, title, desc, benefits }: any) {
  return (
    <div className="glass-panel-obsidian rounded-[24px] p-8 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
      {/* Hover Glow */}
      <div
        className="absolute -right-20 -top-20 h-64 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      ></div>

      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 shadow-[0_0_15px_${glowColor}] ${color}`}>
          <Icon className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>

        <ul className="space-y-3">
          {benefits.map((benefit: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle className={`w-4 h-4 mt-0.5 ${color}`} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TimelineItem({ num, title, desc, icon: Icon, alignment }: any) {
  return (
    <div className={`relative mb-16 md:mb-24 group ${alignment === 'right' ? 'md:text-left' : 'md:text-left'}`}>
      <div className={`hidden md:flex absolute top-8 w-full items-center ${alignment === 'right' ? 'justify-start' : 'justify-end'}`}>
        {/* Desktop connector lines could go here */}
      </div>

      <div className={`flex flex-col md:flex-row items-center gap-8 ${alignment === 'right' ? 'md:flex-row-reverse' : ''}`}>

        {/* Content Side */}
        <div className={`flex-1 w-full ${alignment === 'right' ? 'md:pl-16' : 'md:pr-16 text-right'}`}>
          {/* Mobile View: Card takes full width, Desktop: Card takes half */}
          <div className={`glass-panel-obsidian rounded-[24px] p-8 relative overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:translate-x-1 ${alignment === 'left' ? 'md:mr-0' : 'md:ml-0'}`}>
            <div className="absolute -right-4 -bottom-6 text-[100px] font-bold text-white opacity-[0.03] leading-none select-none pointer-events-none">
              {num}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
              <Icon className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        </div>

        {/* Center Node */}
        <div className="absolute left-8 md:left-1/2 top-10 md:top-1/2 md:-translate-y-1/2 w-6 h-6 rounded-full bg-bg-obsidian border-2 border-primary flex items-center justify-center z-20 shadow-[0_0_15px_rgba(99,102,241,0.8)] -translate-x-[11px] md:-translate-x-[11px]">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Empty side for balance on desktop */}
        <div className="hidden md:block flex-1"></div>
      </div>
    </div>
  )
}
