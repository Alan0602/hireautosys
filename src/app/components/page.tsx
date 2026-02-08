"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/ui/file-upload"
import {
    Modal,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTrigger,
} from "@/components/ui/modal"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export default function ComponentShowcase() {
    const [progress, setProgress] = React.useState(65)
    const [inputValue, setInputValue] = React.useState("")
    const [files, setFiles] = React.useState<File[]>([])

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="display text-foreground mb-2">HireScope Components</h1>
                        <p className="text-lg text-muted-foreground">Component library showcase</p>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Buttons */}
                <section className="space-y-4">
                    <h2>Buttons</h2>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary" size="sm">Primary Small</Button>
                        <Button variant="primary" size="md">Primary Medium</Button>
                        <Button variant="primary" size="lg">Primary Large</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="primary" loading>Loading</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>
                </section>

                {/* Inputs */}
                <section className="space-y-4">
                    <h2>Inputs</h2>
                    <div className="grid gap-4 max-w-md">
                        <Input
                            placeholder="Default input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onClear={() => setInputValue("")}
                        />
                        <Input type="password" placeholder="Password input" />
                        <Input placeholder="Error state" error />
                        <Input placeholder="Success state" success />
                        <Input placeholder="Disabled" disabled />
                    </div>
                </section>

                {/* Cards */}
                <section className="space-y-4">
                    <h2>Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card variant="default">
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>Basic card with shadow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">This is a default variant card with subtle shadow.</p>
                            </CardContent>
                        </Card>

                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle>Elevated Card</CardTitle>
                                <CardDescription>Hover to see lift effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Hover over this card to see the elevation animation.</p>
                            </CardContent>
                        </Card>

                        <Card variant="interactive">
                            <CardHeader>
                                <CardTitle>Interactive Card</CardTitle>
                                <CardDescription>Clickable with hover effects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">This card has interactive hover and active states.</p>
                            </CardContent>
                        </Card>

                        <Card variant="outlined">
                            <CardHeader>
                                <CardTitle>Outlined Card</CardTitle>
                                <CardDescription>No shadow, border only</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Outlined variant without shadow.</p>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Glass Card</CardTitle>
                                <CardDescription>Glassmorphism effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">Beautiful glassmorphic backdrop blur effect.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Badges */}
                <section className="space-y-4">
                    <h2>Badges</h2>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge size="sm">Small</Badge>
                        <Badge size="lg">Large</Badge>
                    </div>
                </section>

                {/* Progress */}
                <section className="space-y-4">
                    <h2>Progress Indicators</h2>
                    <div className="space-y-4 max-w-md">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm">Adjustable Progress: {progress}%</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setProgress((p) => (p + 10) % 101)}
                                >
                                    +10%
                                </Button>
                            </div>
                            <Progress value={progress} showLabel={false} size="md" />
                        </div>
                        <Progress value={95} showLabel size="lg" />
                        <Progress value={70} showLabel size="md" />
                        <Progress value={45} showLabel size="sm" />
                    </div>
                </section>

                {/* Modal */}
                <section className="space-y-4">
                    <h2>Modal</h2>
                    <div className="flex gap-3">
                        <Modal>
                            <ModalTrigger asChild>
                                <Button variant="primary">Open Small Modal</Button>
                            </ModalTrigger>
                            <ModalContent size="sm">
                                <ModalHeader>
                                    <ModalTitle>Small Modal</ModalTitle>
                                    <ModalDescription>
                                        This is a small modal dialog with a max width of 400px.
                                    </ModalDescription>
                                </ModalHeader>
                                <ModalFooter>
                                    <Button variant="secondary">Cancel</Button>
                                    <Button variant="primary">Confirm</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>

                        <Modal>
                            <ModalTrigger asChild>
                                <Button variant="secondary">Open Large Modal</Button>
                            </ModalTrigger>
                            <ModalContent size="lg">
                                <ModalHeader>
                                    <ModalTitle>Large Modal</ModalTitle>
                                    <ModalDescription>
                                        This is a larger modal with more content space.
                                    </ModalDescription>
                                </ModalHeader>
                                <div className="py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Modal content goes here. You can add forms, images, or any other content.
                                        The modal has backdrop blur and smooth animations.
                                    </p>
                                </div>
                                <ModalFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button variant="primary">Save Changes</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                </section>

                {/* File Upload */}
                <section className="space-y-4">
                    <h2>File Upload</h2>
                    <div className="max-w-2xl">
                        <FileUpload
                            onFilesChange={setFiles}
                            value={files}
                            accept={{
                                'application/pdf': ['.pdf'],
                                'application/msword': ['.doc', '.docx'],
                            }}
                            maxSize={5242880} // 5MB
                            multiple
                        />
                    </div>
                </section>

                {/* Gradient Mesh Background Demo */}
                <section className="space-y-4">
                    <h2>Special Effects</h2>
                    <div className="gradient-mesh rounded-xl p-12 text-center">
                        <h3 className="text-3xl font-heading font-bold mb-2">Gradient Mesh Background</h3>
                        <p className="text-muted-foreground">Subtle radial gradients creating depth</p>
                    </div>
                </section>

            </div>
        </div>
    )
}
