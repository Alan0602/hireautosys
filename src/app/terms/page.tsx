"use client"

import React from "react"
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
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
                <h1 className="text-4xl font-bold font-heading mb-8">Terms of Service</h1>
                
                <div className="space-y-12 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing or using the HireScope platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you must discontinue use of our service immediately.
                        </p>
                        <p>
                            These terms apply to all visitors, registered candidates, HR personnel, and organisational administrators who access our AI-powered hiring infrastructure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">2. Use of Service</h2>
                        <p className="mb-4">
                            HireScope grants you a limited, non-exclusive license to use our platform for recruitment and job application purposes. You agree not to misuse the service, upload malicious files, or attempt to bypass our automated screening measures.
                        </p>
                        <p>
                            Organisations are responsible for maintaining the confidentiality of their admin credentials and ensuring their hiring practices comply with local employment laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">3. AI-Powered Features Disclaimer</h2>
                        <p className="mb-4">
                            Our platform utilises artificial intelligence to parse resumes, evaluate skill matches, and assign ATS threshold scores. While we strive for high accuracy, AI interpretations are provided as supplemental guidance, not definitive hiring directives.
                        </p>
                        <p>
                            Employers retain sole responsibility for their final hiring decisions. HireScope does not guarantee employment outcomes for candidates or the absolute accuracy of automated technical assessments.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">4. Limitation of Liability</h2>
                        <p className="mb-4">
                            HireScope and its affiliates shall not be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service. This includes losses pertaining to recruitment delays or data parsing errors.
                        </p>
                        <p>
                            Our maximum liability for any claims arising under these terms is strictly limited to the amount paid by your organisation for the software service in the preceding 12 months.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white font-heading mb-4">5. Changes to Terms</h2>
                        <p className="mb-4">
                            We reserve the right to modify or replace these Terms at any time as our platform evolves or as required by regulatory changes. Material changes will be communicated via email or through a prominent notice on the dashboard.
                        </p>
                        <p>
                            Your continued use of HireScope after any modifications to the Terms of Service constitutes your ongoing acceptance of the newly revised terms.
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
