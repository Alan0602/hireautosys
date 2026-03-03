"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, ChevronLeft, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"

export function DashboardSidebar() {
    const pathname = usePathname()
    const { currentUser, organisation, logout } = useAuthStore()
    const [collapsed, setCollapsed] = React.useState(false)

    const hrNavItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/hr/dashboard" },
        { icon: Briefcase, label: "Jobs", href: "/hr/jobs" },
        { icon: Settings, label: "Settings", href: "/hr/settings" },
    ]

    return (
        <aside
            className={cn(
                "sticky top-0 h-screen transition-all duration-300 glass-panel-obsidian border-r border-white/10 z-50",
                collapsed ? "w-20" : "w-72"
            )}
        >
            <div className="flex h-full flex-col p-4">
                {/* Logo / Org Header */}
                <div className={cn("flex items-center justify-between mb-8 transition-all", collapsed ? "justify-center" : "px-2")}>
                    {!collapsed && (
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-glow">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white truncate text-ellipsis max-w-[140px]">
                                    {organisation?.name || "HireScope"}
                                </span>
                                <span className="text-xs text-slate-400 truncate max-w-[140px]">
                                    {currentUser?.name || "Workspace"}
                                </span>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn("rounded-full hover:bg-white/10 text-slate-400 hover:text-white shrink-0", collapsed && "w-10 h-10")}
                    >
                        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {hrNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary text-white shadow-glow"
                                        : "text-slate-400 hover:text-white hover:bg-white/5",
                                    collapsed && "justify-center px-0 w-12 h-12 mx-auto"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                {!collapsed && <span>{item.label}</span>}
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50 rounded-r-full blur-[2px]" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className="mt-auto pt-4 border-t border-white/10">
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className={cn(
                            "w-full justify-start gap-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors",
                            collapsed && "justify-center px-0 w-12 h-12 mx-auto"
                        )}
                    >
                        <LogOut className="h-5 w-5" />
                        {!collapsed && <span>Sign Out</span>}
                    </Button>
                </div>
            </div>
        </aside>
    )
}
