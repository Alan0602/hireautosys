"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, UserRole } from '@/store/auth-store'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
    children: React.ReactNode
    allowedRoles: UserRole[]
}

const roleDashboardMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    hr: '/hr/dashboard',
    team_lead: '/team-lead/dashboard',
    candidate: '/candidate', // Assuming /candidate is the dashboard/home for candidates
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const router = useRouter()
    const { currentUser, isAuthenticated, isLoading, checkSession } = useAuthStore()

    useEffect(() => {
        checkSession()
    }, [checkSession])

    useEffect(() => {
        if (isLoading) return

        if (!isAuthenticated || !currentUser) {
            router.replace('/login')
            return
        }

        if (!allowedRoles.includes(currentUser.role)) {
            router.replace(roleDashboardMap[currentUser.role as UserRole] || '/login')
        }
    }, [isLoading, isAuthenticated, currentUser, allowedRoles, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-obsidian flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthenticated || !currentUser || !allowedRoles.includes(currentUser.role)) {
        return (
            <div className="min-h-screen bg-bg-obsidian flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return <>{children}</>
}
