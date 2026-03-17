"use client"

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

// Types
export type UserRole = 'admin' | 'hr' | 'team_lead' | 'candidate'

export interface AuthUser {
    id: string
    username: string
    name: string
    email: string
    role: UserRole
    organisationId: string
}

export interface Organisation {
    id: string
    name: string
    createdAt: string
}

interface AuthState {
    currentUser: AuthUser | null
    users: AuthUser[]
    organisation: Organisation | null
    isAuthenticated: boolean
    isLoading: boolean

    // Actions
    checkSession: () => Promise<void>
    getUsersByOrg: (orgId: string) => Promise<void>
    setup: (orgName: string, adminUsername: string, adminPassword: string) => Promise<Organisation | null>
    login: (username: string, password: string) => Promise<AuthUser | null>
    logout: () => Promise<void>
    addHR: (name: string, password: string) => Promise<{ user: AuthUser; username: string } | null>
    candidateSignup: (email: string, password: string) => Promise<AuthUser | null>
}

// Helper to set a session cookie readable by Next.js middleware
function setSessionCookie(userId: string) {
    document.cookie = `hs_user_id=${userId}; path=/; SameSite=Strict; max-age=86400`
}

// Helper to clear the session cookie on logout
function clearSessionCookie() {
    document.cookie = 'hs_user_id=; path=/; SameSite=Strict; max-age=0'
}

// Helper to map DB user to App user
const mapUser = (dbUser: any, orgId: string): AuthUser => ({
    id: dbUser.id,
    username: dbUser.username,
    name: dbUser.username,
    email: dbUser.email,
    role: dbUser.role as UserRole,
    organisationId: orgId,
})

export const useAuthStore = create<AuthState>((set, get) => ({
    currentUser: null,
    users: [],
    organisation: null,
    isAuthenticated: false,
    isLoading: true,

    checkSession: async () => {
        set({ isLoading: true })
        try {
            const storedUserId = localStorage.getItem('hs_user_id')
            if (storedUserId) {
                const { data: user, error } = await supabase.from('users').select('*').eq('id', storedUserId).maybeSingle()

                if (error) throw error

                if (user) {
                    if (user.role === 'candidate') {
                        set({
                            currentUser: mapUser(user, ''),
                            isAuthenticated: true
                        })
                    } else {
                        const { data: link } = await supabase.from('organisation_users').select('organisation_id').eq('user_id', user.id).maybeSingle()
                        if (link) {
                            const { data: org } = await supabase.from('organisations').select('*').eq('id', link.organisation_id).single()
                            if (org) {
                                set({
                                    currentUser: mapUser(user, org.id),
                                    organisation: { id: org.id, name: org.name, createdAt: org.created_at },
                                    isAuthenticated: true
                                })
                            }
                        }
                    }
                } else {
                    localStorage.removeItem('hs_user_id')
                    clearSessionCookie()
                }
            }
        } catch (err) {
            console.error("AuthStore: checkSession failed:", err)
        } finally {
            set({ isLoading: false })
        }
    },

    getUsersByOrg: async (orgId: string) => {
        try {
            const { data: links, error: linkError } = await supabase
                .from('organisation_users')
                .select('user_id')
                .eq('organisation_id', orgId)

            if (linkError || !links) throw linkError

            const userIds = links.map((l: { user_id: string }) => l.user_id)
            if (userIds.length === 0) {
                set({ users: [] })
                return
            }

            const { data: dbUsers, error: userError } = await supabase
                .from('users')
                .select('*')
                .in('id', userIds)

            if (userError || !dbUsers) throw userError

            const users = dbUsers.map((u: any) => mapUser(u, orgId))
            set({ users })
        } catch (error) {
            console.error("Error fetching users:", error)
        }
    },

    setup: async (orgName, adminUsername, adminPassword) => {
        set({ isLoading: true })
        try {
            // 1. Create Organisation
            const { data: org, error: orgError } = await supabase
                .from('organisations')
                .insert([{ name: orgName }])
                .select()
                .maybeSingle()

            if (orgError || !org) throw orgError

            // 2. Hash password before storing — never store plain text
            const passwordHash = await bcrypt.hash(adminPassword, 12)

            // 3. Create Admin User
            const { data: user, error: userError } = await supabase
                .from('users')
                .insert([{
                    username: adminUsername,
                    email: adminUsername,
                    password_hash: passwordHash,
                    role: 'admin',
                    is_active: true
                }])
                .select()
                .maybeSingle()

            if (userError || !user) throw userError

            // 4. Link User to Org
            const { error: linkError } = await supabase
                .from('organisation_users')
                .insert([{ organisation_id: org.id, user_id: user.id }])

            if (linkError) throw linkError

            const authUser = mapUser(user, org.id)
            const organisation = { id: org.id, name: org.name, createdAt: org.created_at }

            localStorage.setItem('hs_user_id', user.id)
            setSessionCookie(user.id)
            set({ currentUser: authUser, organisation, isAuthenticated: true })

            return organisation
        } catch (error) {
            console.error("Setup failed:", error)
            return null
        } finally {
            set({ isLoading: false })
        }
    },

    login: async (username, password) => {
        set({ isLoading: true })
        try {
            // 1. Find user by username or email (without comparing password in DB query)
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .or(`username.eq.${username},email.eq.${username}`)
                .eq('is_active', true)
                .maybeSingle()

            if (error || !user) {
                set({ isLoading: false })
                return null
            }

            // 2. Securely compare password with bcrypt
            const passwordMatch = await bcrypt.compare(password, user.password_hash)
            if (!passwordMatch) {
                set({ isLoading: false })
                return null
            }

            // 3. Get Org (if not candidate)
            let orgId = ''
            let organisation = null

            if (user.role !== 'candidate') {
                const { data: link } = await supabase
                    .from('organisation_users')
                    .select('organisation_id')
                    .eq('user_id', user.id)
                    .maybeSingle()

                if (link) {
                    const { data: org } = await supabase
                        .from('organisations')
                        .select('*')
                        .eq('id', link.organisation_id)
                        .maybeSingle()

                    if (org) {
                        orgId = org.id
                        organisation = { id: org.id, name: org.name, createdAt: org.created_at }
                    }
                }
            }

            const authUser = mapUser(user, orgId)

            localStorage.setItem('hs_user_id', user.id)
            setSessionCookie(user.id)
            set({ currentUser: authUser, organisation, isAuthenticated: true })

            return authUser
        } catch (error) {
            console.error("Login failed:", error)
            return null
        } finally {
            set({ isLoading: false })
        }
    },

    logout: async () => {
        localStorage.removeItem('hs_user_id')
        clearSessionCookie()
        set({ currentUser: null, organisation: null, isAuthenticated: false })
    },

    addHR: async (name, password) => {
        const { organisation } = get()
        if (!organisation) return null

        const orgSlug = organisation.name.toLowerCase().replace(/\s+/g, '')
        const nameSlug = name.toLowerCase().replace(/\s+/g, '')
        const username = `${nameSlug}@${orgSlug}`

        try {
            // Check if exists
            const { data: existing } = await supabase.from('users').select('id').eq('username', username).single()
            if (existing) return null

            // Hash password before storing
            const passwordHash = await bcrypt.hash(password, 12)

            const { data: user, error } = await supabase
                .from('users')
                .insert([{
                    username,
                    email: username,
                    password_hash: passwordHash,
                    role: 'hr',
                    is_active: true
                }])
                .select()
                .maybeSingle()

            if (error || !user) throw error

            await supabase.from('organisation_users').insert([{
                organisation_id: organisation.id,
                user_id: user.id
            }])

            return { user: mapUser(user, organisation.id), username }
        } catch (error) {
            console.error("Add HR failed:", error)
            return null
        }
    },

    candidateSignup: async (email, password) => {
        set({ isLoading: true })
        try {
            // Check if exists
            const { data: existing } = await supabase.from('users').select('id').eq('email', email).single()
            if (existing) {
                return null
            }

            // Hash password before storing
            const passwordHash = await bcrypt.hash(password, 12)

            const { data: user, error } = await supabase
                .from('users')
                .insert([{
                    username: email.split('@')[0],
                    email: email,
                    password_hash: passwordHash,
                    role: 'candidate',
                    is_active: true
                }])
                .select()
                .maybeSingle()

            if (error || !user) throw error

            const authUser = mapUser(user, '')

            localStorage.setItem('hs_user_id', user.id)
            setSessionCookie(user.id)
            set({ currentUser: authUser, isAuthenticated: true })

            return authUser
        } catch (error) {
            console.error("Candidate signup failed:", error)
            return null
        } finally {
            set({ isLoading: false })
        }
    }
}))
