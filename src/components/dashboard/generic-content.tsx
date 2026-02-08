"use client"

import * as React from "react"
// import { DashboardSidebar } from "@/components/dashboard/sidebar" // Removed to avoid circular dependency or import issues if not needed directly
// import { DashboardHeader } from "@/components/dashboard/header" // Removed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Simplified component since we'll wrap it in layout individually for now or use it directly
export default function GenericDashboardContent({ title, description }: { title: string, description: string }) {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg m-6">
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">This page is under construction.</p>
                        <Button variant="outline">Go Back</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
