"use client"

import { AdminSidebar } from "@/components/dashboard/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"
import { Users, Building2, Shield, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function AdminDashboard() {
    const { organisation, users, currentUser, getUsersByOrg } = useAuthStore()

    // Fetch users on mount
    React.useEffect(() => {
        if (currentUser?.organisationId) {
            getUsersByOrg(currentUser.organisationId)
        }
    }, [currentUser, getUsersByOrg])

    const orgUsers = users
    const hrCount = orgUsers.filter((u) => u.role === 'hr').length
    const adminCount = orgUsers.filter((u) => u.role === 'admin').length

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <DashboardHeader
                    title="Admin Dashboard"
                    subtitle={`Welcome to ${organisation?.name || 'HireScope'}`}
                />

                <main className="p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Organisation</p>
                                    <p className="text-xl font-bold">{organisation?.name || '-'}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">HR Members</p>
                                    <p className="text-xl font-bold">{hrCount}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Admins</p>
                                    <p className="text-xl font-bold">{adminCount}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Manage your organisation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <Link href="/admin/add-hr">
                                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-glow">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Add HR Member
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>All users in your organisation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {orgUsers.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{u.name}</p>
                                                <p className="text-sm text-muted-foreground">{u.username}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'admin'
                                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            }`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                                {orgUsers.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No team members yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
