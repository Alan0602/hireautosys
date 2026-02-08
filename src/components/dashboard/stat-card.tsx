"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    change?: {
        value: number
        type: "increase" | "decrease"
    }
    icon: React.ReactNode
    iconColor?: string
}

export function StatCard({ title, value, change, icon, iconColor }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", iconColor || "bg-primary/10")}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-heading font-bold">{value}</div>
                {change && (
                    <div className="flex items-center gap-1 mt-2 text-sm">
                        {change.type === "increase" ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-error" />
                        )}
                        <span className={cn(
                            "font-medium",
                            change.type === "increase" ? "text-success" : "text-error"
                        )}>
                            {change.value > 0 ? "+" : ""}{change.value}%
                        </span>
                        <span className="text-muted-foreground">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
