import { useAuthStore, UserRole } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { currentUser, isLoading, checkSession } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        checkSession()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push("/login")
        } else if (!isLoading && currentUser && !allowedRoles.includes(currentUser.role)) {
            // Redirect to appropriate dashboard based on role
            if (currentUser.role === "hr" || currentUser.role === "admin") {
                router.push("/hr/dashboard")
            } else if (currentUser.role === "team_lead") {
                router.push("/team-lead/dashboard")
            } else {
                router.push("/login")
            }
        }
    }, [currentUser, isLoading, router, allowedRoles])

    // Only show loader if we have NO user and we ARE loading.
    // If we have a user, don't show the loader even if we are checking session in the background
    // to avoid unmounting children and losing their state (or triggering their mount effects).
    if (isLoading && !currentUser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg-obsidian">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
        // If not loading but still no user or wrong role, show nothing (redirect will happen in useEffect)
        return null
    }

    return <>{children}</>
}
