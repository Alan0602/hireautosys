import * as React from "react"
import { Eye, EyeOff, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
    success?: boolean
    onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, success, onClear, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const [isFocused, setIsFocused] = React.useState(false)
        const isPassword = type === "password"
        const inputType = isPassword && showPassword ? "text" : type

        const hasValue = props.value !== undefined && props.value !== "" ||
            props.defaultValue !== undefined && props.defaultValue !== ""

        return (
            <div className="relative">
                <input
                    type={inputType}
                    className={cn(
                        "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm transition-all",
                        "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        "placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-error focus-visible:ring-error",
                        success && "border-success focus-visible:ring-success",
                        !error && !success && "border-input focus-visible:ring-ring",
                        className
                    )}
                    ref={ref}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}

                {/* Clear Button */}
                {onClear && hasValue && !isPassword && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
