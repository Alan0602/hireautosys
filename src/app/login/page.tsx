"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"

export default function LoginPage() {
    const router = useRouter()
    const { login, checkSession, isAuthenticated, currentUser } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        checkSession()
    }, [checkSession])

    // If already logged in, redirect
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            if (currentUser.role === 'admin') router.replace('/admin/dashboard')
            else if (currentUser.role === 'hr') router.replace('/hr/dashboard')
        }
    }, [isAuthenticated, currentUser, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        // Simulate network delay
        // await new Promise((resolve) => setTimeout(resolve, 600))

        const user = await login(username, password)

        if (user) {
            if (user.role === 'admin') {
                toast.success("Welcome back, Admin")
                router.push('/admin/dashboard')
            }
            else if (user.role === 'hr') {
                toast.success("Welcome back, HR")
                router.push('/hr/dashboard')
            }
            else if (user.role === 'candidate') {
                toast.success("Welcome back, Candidate")
                router.push('/candidate/dashboard')
            }
        } else {
            toast.error("Invalid username or password")
            setError("Invalid username or password")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="orb orb-1 opacity-20"></div>
                <div className="orb orb-2 opacity-20"></div>
            </div>

            <Card className="glass-panel-obsidian w-full max-w-md border-white/10 shadow-2xl relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-glow">
                            <Sparkles className="text-white h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your credentials to access your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-white">Username or Email</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="username or email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white shadow-glow mt-2"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center border-t border-white/5 pt-6">
                    <p className="text-sm text-slate-400">
                        Need to set up?{" "}
                        <Link href="/setup" className="text-primary hover:underline">
                            Create Organisation
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
