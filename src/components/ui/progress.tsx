import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export interface ProgressProps
    extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    value?: number
    showLabel?: boolean
    size?: "sm" | "md" | "lg"
}

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
>(({ className, value = 0, showLabel = false, size = "md", ...props }, ref) => {
    const sizeClasses = {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
    }

    // Color based on value
    const getColorClass = (val: number) => {
        if (val >= 90) return "bg-success"
        if (val >= 75) return "bg-primary"
        if (val >= 60) return "bg-warning"
        return "bg-error"
    }

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{value}%</span>
                </div>
            )}
            <ProgressPrimitive.Root
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-full bg-secondary w-full",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                <ProgressPrimitive.Indicator
                    className={cn(
                        "h-full w-full flex-1 transition-all duration-500 ease-out",
                        getColorClass(value)
                    )}
                    style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
                />
            </ProgressPrimitive.Root>
        </div>
    )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
