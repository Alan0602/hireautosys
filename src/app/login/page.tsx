"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, ArrowRight, Github, Mail } from "lucide-react" // Using FileText as logo
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Login Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <span className="text-xl font-heading font-bold">HireScope</span>
                        </Link>
                        <ThemeToggle />
                    </div>

                    <Card variant="elevated">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-6">
                                <Button variant="outline">
                                    <Github className="mr-2 h-4 w-4" />
                                    Github
                                </Button>
                                <Button variant="outline">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Link href="/hr/dashboard" className="w-full">
                                <Button className="w-full">Sign In</Button>
                            </Link>
                            <p className="text-sm text-center text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href="/register" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>

            {/* Right: Feature Showcase (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-neutral-900 z-0" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                <div className="relative z-10 max-w-md mx-auto space-y-6 text-center">
                    <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-primary/30">
                        <FileText className="h-8 w-8 text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold">
                        Streamline your hiring process
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Use AI to analyze resumes, match candidates, and make better hiring decisions faster than ever before.
                    </p>
                </div>
            </div>
        </div>
    )
}
