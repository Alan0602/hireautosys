import { create } from 'zustand'

interface User {
    id: string
    name: string
    email: string
    role: 'candidate' | 'hr' | 'team_lead'
}

interface UserState {
    user: User | null
    isLoading: boolean
    login: (user: User) => void
    logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
}))
