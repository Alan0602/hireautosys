"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Building2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

export default function SetupPage() {
    const router = useRouter()
    const { checkSession, setup } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [orgName, setOrgName] = useState("")
    const [adminUsername, setAdminUsername] = useState("")
    const [adminPassword, setAdminPassword] = useState("")

    useEffect(() => {
        checkSession()
    }, [checkSession])

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orgName.trim() || !adminUsername.trim() || !adminPassword.trim()) return

        setLoading(true)
        // await new Promise((resolve) => setTimeout(resolve, 800))

        const result = await setup(orgName.trim(), adminUsername.trim(), adminPassword)

        if (result) {
            router.push("/hr/dashboard") // Setup logs in automatically
        } else {
            setLoading(false)
            // Show error (would need error state)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-4">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="orb orb-1 opacity-20"></div>
                <div className="orb orb-2 opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            HireScope
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Set Up Organisation</h1>
                    <p className="text-slate-400">Create your workspace and admin account</p>
                </div>

                <Card className="glass-panel-obsidian border-white/10 shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-white text-lg">Organisation & Admin</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Set up your company and create the admin account
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSetup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="orgName" className="text-white">Organisation Name</Label>
                                <Input
                                    id="orgName"
                                    placeholder="Acme Inc."
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminUsername" className="text-white">Admin Username</Label>
                                <Input
                                    id="adminUsername"
                                    placeholder="admin"
                                    value={adminUsername}
                                    onChange={(e) => setAdminUsername(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adminPassword" className="text-white">Admin Password</Label>
                                <Input
                                    id="adminPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white shadow-glow mt-2"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Create Organisation"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center border-t border-white/5 pt-6">
                        <p className="text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
