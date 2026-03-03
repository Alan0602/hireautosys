"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/dashboard/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"
import { Loader2, UserPlus, CheckCircle, AlertCircle } from "lucide-react"

export default function AddHRPage() {
    const router = useRouter()
    const { organisation, addHR } = useAuthStore()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const orgSlug = organisation?.name.toLowerCase().replace(/\s+/g, '') || 'org'
    const nameSlug = name.toLowerCase().replace(/\s+/g, '')
    const generatedUsername = nameSlug ? `${nameSlug}@${orgSlug}` : ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!name.trim() || !password.trim()) return

        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 600))

        const result = await addHR(name.trim(), password)

        if (result) {
            setSuccess(`HR account created! Username: ${result.username}`)
            setName("")
            setPassword("")
        } else {
            setError("Username already exists. Please choose a different name.")
        }

        setLoading(false)
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <DashboardHeader
                    title="Add HR Member"
                    subtitle="Create a new HR account for your organisation"
                />

                <main className="p-6">
                    <div className="max-w-lg">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <UserPlus className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>New HR Account</CardTitle>
                                        <CardDescription>
                                            The username will be auto-generated from the name
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hrName">HR Name</Label>
                                        <Input
                                            id="hrName"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hrPassword">Password</Label>
                                        <Input
                                            id="hrPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Auto-generated username preview */}
                                    {generatedUsername && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
                                            <p className="text-xs text-muted-foreground mb-1">Auto-generated username</p>
                                            <p className="font-mono text-sm font-medium text-primary">{generatedUsername}</p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-500">
                                            <CheckCircle className="h-4 w-4 shrink-0" />
                                            {success}
                                        </div>
                                    )}

                                    {error && (
                                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                                            <AlertCircle className="h-4 w-4 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading || !name.trim() || !password.trim()}
                                        className="w-full bg-primary hover:bg-primary/90 text-white"
                                    >
                                        {loading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            "Create HR Account"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
