"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface WizardStepperProps {
    steps: {
        id: string
        title: string
        description?: string
    }[]
    currentStep: number
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
    return (
        <div className="relative">
            <div className="absolute left-0 top-1/2 -mt-px h-0.5 w-full bg-border" aria-hidden="true" />
            <ol className="relative z-10 flex justify-between">
                {steps.map((step, stepIdx) => {
                    const isCompleted = currentStep > stepIdx
                    const isCurrent = currentStep === stepIdx

                    return (
                        <li key={step.id} className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-200 bg-background",
                                    isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                        isCurrent ? "border-primary text-primary" :
                                            "border-muted text-muted-foreground"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <span className="text-sm font-medium">{stepIdx + 1}</span>
                                )}
                            </div>
                            <div className="mt-2 text-center hidden sm:block">
                                <span className={cn(
                                    "text-sm font-medium block",
                                    isCurrent ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}
