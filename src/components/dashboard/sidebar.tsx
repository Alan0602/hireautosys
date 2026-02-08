"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGrid, LayoutDashboard, Briefcase, Users, FileText, Settings, LogOut, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
    userRole: "hr" | "candidate" | "team-lead"
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = React.useState(false)

    const hrNavItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/hr/dashboard" },
        { icon: Briefcase, label: "Jobs", href: "/hr/jobs" },
        { icon: Users, label: "Candidates", href: "/hr/candidates" },
        { icon: FileText, label: "Analytics", href: "/hr/analytics" },
        { icon: Settings, label: "Settings", href: "/hr/settings" },
    ]

    const candidateNavItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/candidate/dashboard" },
        { icon: Briefcase, label: "Applications", href: "/candidate/applications" },
        { icon: FileText, label: "Profile", href: "/candidate/profile" },
        { icon: Settings, label: "Settings", href: "/candidate/settings" },
    ]

    const teamLeadNavItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/team-lead/dashboard" },
        { icon: Users, label: "Review Queue", href: "/team-lead/review" },
        { icon: FileText, label: "Analytics", href: "/team-lead/analytics" },
        { icon: Settings, label: "Settings", href: "/team-lead/settings" },
    ]

    const navItems =
        userRole === "hr" ? hrNavItems :
            userRole === "candidate" ? candidateNavItems :
                teamLeadNavItems

    const handleLogout = () => {
        router.push("/login")
    }

    return (
        <aside
            className={cn(
                "sticky top-0 h-screen transition-all duration-300 glass-panel z-50",
                collapsed ? "w-20" : "w-72"
            )}
        >
            <div className="flex h-full flex-col p-4">
                {/* Logo */}
                <div className={cn("flex items-center justify-between mb-8", collapsed ? "justify-center" : "px-2")}>
                    {!collapsed && (
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-md">
                                <LayoutGrid className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
                                HireScope
                            </span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn("rounded-full hover:bg-white/20", collapsed && "w-10 h-10")}
                    >
                        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                    "hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:text-foreground",
                                    collapsed && "justify-center px-0 w-12 h-12 mx-auto"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile / Logout */}
                <div className="mt-auto pt-4 border-t border-border/20">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={cn(
                            "w-full justify-start gap-3 rounded-2xl hover:bg-destructive/10 hover:text-destructive",
                            collapsed && "justify-center px-0 w-12 h-12 mx-auto"
                        )}
                    >
                        <LogOut className="h-5 w-5" />
                        {!collapsed && <span>Logout</span>}
                    </Button>
                </div>
            </div>
        </aside>
    )
}
