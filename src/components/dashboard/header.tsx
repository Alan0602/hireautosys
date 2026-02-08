"use client"

import * as React from "react"
import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/shared/theme-toggle"

interface DashboardHeaderProps {
    title: string
    subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
                <div>
                    <h1 className="text-2xl font-heading font-bold">{title}</h1>
                    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-64 pl-10"
                        />
                    </div>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <Badge
                            variant="destructive"
                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                        >
                            3
                        </Badge>
                    </Button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Profile */}
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">JD</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
