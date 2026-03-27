"use client"

import React from "react"
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#0F1115] text-white">
            {/* Navigation */}
            <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                            <Sparkles className="text-white h-4 w-4" />
                        </div>
                        <span className="font-bold text-lg font-heading tracking-tight">HireScope</span>
                    </Link>
                    <Link 
                        href="/" 
                        className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold font-heading mb-8">Privacy Policy</h1>
                
                <div className="space-y-12 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">1. Data Collection</h2>
                        <p className="mb-4">
                            At HireScope, we collect personal information necessary to facilitate the hiring process between organisations and candidates. This includes account credentials, contact information, and unstructured data such as PDF resumes uploaded by applicants.
                        </p>
                        <p>
                            We also monitor application analytics, hiring funnels, and usage metrics to ensure the platform operates efficiently. All user account data is securely managed through our architecture.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">2. How We Use Data</h2>
                        <p className="mb-4">
                            The data collected is primarily used to parse resumes, match candidate skills to job requirements, and generate AI-driven scoring for HR professionals. We utilise large language models to extract text and provide automated insights, streamlining the recruitment workflow.
                        </p>
                        <p>
                            We do not sell your personal data to third parties. Resume content and employer feedback are strictly used within the context of the explicit job application they were submitted for.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">3. Data Storage and Security</h2>
                        <p className="mb-4">
                            All application documents, including PDF resumes, are stored securely using Supabase Storage with strict access controls. Only authorised HR personnel within the hiring organisation can access your submitted files.
                        </p>
                        <p>
                            We employ industry-standard encryption protocols both in transit and at rest. Resumes and candidate data are retained only as long as necessary for the active recruitment cycle or as mandated by the organisation's retention policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">4. Your Rights (GDPR)</h2>
                        <p className="mb-4">
                            Under the General Data Protection Regulation (GDPR) and similar privacy frameworks, you retain the right to access, rectify, or request the deletion of your personal data held on our platform. Candidates can request an export of their application history at any time.
                        </p>
                        <p>
                            If you wish to exercise these rights or request the permanent deletion of your stored PDF resumes, you may submit a request to the hiring organisation directly, or contact our privacy team for platform-level data removal.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">5. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled by our AI systems, our dedicated privacy team is ready to assist you.
                        </p>
                        <p>
                            You can reach us directly via email at privacy@hirescope.app. We aim to respond to all data inquiries within 48 hours.
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#0F1115] py-8 text-center text-slate-400 mt-12">
                <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-4">
                    <p>© 2025 HireScope. All rights reserved.</p>
                    <Link href="/" className="text-sm hover:text-white transition-colors">
                        Return to HireScope
                    </Link>
                </div>
            </footer>
        </div>
    )
}
