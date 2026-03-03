"use client"

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

// Types (Frontend Interface)
export interface Job {
    id: string
    organisationId: string
    orgName: string
    slug: string
    title: string
    department: string
    location: string
    experience: string
    skills: string[]
    description: string
    responsibilities: string[]
    requirements: string[]
    benefits: string[]
    atsThreshold: number
    expiryDate: string
    createdAt: string
    status: 'active' | 'expired' | 'closed'
}

export interface Application {
    id: string
    jobId: string
    candidateName: string
    candidateEmail: string
    resumeUrl: string
    atsScore: number
    status: 'pending' | 'hr_approve' | 'teamlead_approve' | 'ready_for_checkin' | 'rejected' | 'hired'
    createdAt: string
    skillsFound: string[]
    missingSkills: string[]
    tips: string[]
    comments?: string
    candidateId?: string
}

// Map DB Job to App Job
// Note: dbJob might have 'organisations' joined object if fetched with join
const mapJob = (dbJob: any): Job => ({
    id: dbJob.id,
    organisationId: dbJob.organisation_id,
    orgName: dbJob.organisations?.name || 'Unknown Company', // Handle join
    slug: dbJob.slug,
    title: dbJob.title,
    // Provide defaults for fields not explicitly in the minimal DB schema requested but used in UI
    department: 'Engineering', // Default/Placeholder as unrelated to schema prompt
    location: 'Remote',       // Default/Placeholder
    experience: 'Mid-Senior', // Default/Placeholder
    skills: dbJob.skills || [],
    description: dbJob.description,
    responsibilities: dbJob.responsibilities || [],
    requirements: dbJob.requirements || [],
    benefits: dbJob.benefits || [],
    atsThreshold: dbJob.ats_threshold,
    expiryDate: dbJob.expiry_date,
    createdAt: dbJob.created_at,
    status: dbJob.status as any,
})

// Map DB Application to App Application
const mapApplication = (dbApp: any): Application => {
    const atsResult = dbApp.ats_result || {}
    return {
        id: dbApp.id,
        jobId: dbApp.job_id,
        candidateName: dbApp.candidate_name,
        candidateEmail: dbApp.candidate_email,
        resumeUrl: dbApp.resume_url,
        atsScore: dbApp.ats_score,
        status: dbApp.status as any,
        createdAt: dbApp.created_at,
        skillsFound: atsResult.skillsFound || [],
        missingSkills: atsResult.missingSkills || [],
        tips: atsResult.tips || [],
        comments: dbApp.comments,
        candidateId: dbApp.candidate_id
    }
}

interface JobState {
    jobs: Job[]
    applications: Application[]
    isHydrated: boolean
    isLoading: boolean

    // Actions
    hydrate: () => Promise<void>
    createJob: (data: any, userId: string) => Promise<Job | null>
    getJobBySlug: (slug: string) => Promise<Job | null>
    getJobsByOrg: (organisationId: string) => Promise<void>
    getApplicationsByJob: (jobId: string) => Promise<Application[]>
    getApplicationsByOrg: (organisationId: string) => Promise<void>
    getCandidateApplications: (candidateId: string) => Promise<void>
    submitApplication: (data: any) => Promise<Application | null>
    updateApplicationStatus: (id: string, status: string, comments?: string) => Promise<boolean>
    linkCandidateToApplication: (applicationId: string, candidateId: string) => Promise<boolean>
}

function generateSlug(title: string): string {
    const slugBase = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
    const hash = Math.random().toString(36).substring(2, 7)
    return `${slugBase}-${hash}`
}

export const useJobStore = create<JobState>((set, get) => ({
    jobs: [],
    applications: [],
    isHydrated: false,
    isLoading: false,

    hydrate: async () => {
        // No-op for now unless we want global fetch
        set({ isHydrated: true })
    },

    createJob: async (data, userId) => {
        set({ isLoading: true })
        try {
            const slug = generateSlug(data.title)

            const { data: job, error } = await supabase
                .from('jobs')
                .insert([{
                    organisation_id: data.organisationId,
                    created_by: userId,
                    title: data.title,
                    description: data.description,
                    skills: data.skills,
                    responsibilities: data.responsibilities,
                    requirements: data.requirements,
                    benefits: data.benefits,
                    ats_threshold: data.atsThreshold,
                    expiry_date: data.expiryDate,
                    status: 'active',
                    slug: slug
                }])
                .select()
                .single()

            if (error) throw error
            const newJob = mapJob(job)

            // Update local state
            set(state => ({ jobs: [...state.jobs, newJob] }))
            return newJob
        } catch (error) {
            console.error("Create job failed:", error)
            return null
        } finally {
            set({ isLoading: false })
        }
    },

    getJobBySlug: async (slug: string) => {
        set({ isLoading: true })
        try {
            const { data: job, error } = await supabase
                .from('jobs')
                .select('*, organisations(name)')
                .eq('slug', slug)
                .single()

            if (error) return null
            return mapJob(job)
        } finally {
            set({ isLoading: false })
        }
    },

    getJobsByOrg: async (organisationId: string) => {
        set({ isLoading: true })
        try {
            const { data: jobs, error } = await supabase
                .from('jobs')
                .select('*, organisations(name)')
                .eq('organisation_id', organisationId)
                .order('created_at', { ascending: false })

            if (error) throw error
            set({ jobs: jobs.map(mapJob) })
        } catch (err) {
            console.error(err)
        } finally {
            set({ isLoading: false })
        }
    },

    getApplicationsByJob: async (jobId: string) => {
        const { data: apps } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', jobId)

        return apps ? apps.map(mapApplication) : []
    },

    getApplicationsByOrg: async (organisationId: string) => {
        set({ isLoading: true })
        try {
            // Join jobs to filter by org
            const { data: apps, error } = await supabase
                .from('applications')
                .select('*, jobs!inner(organisation_id)')
                .eq('jobs.organisation_id', organisationId)

            if (error) throw error
            set({ applications: apps.map(mapApplication) })
        } catch (err) {
            console.error(err)
        } finally {
            set({ isLoading: false })
        }
    },

    submitApplication: async (data) => {
        set({ isLoading: true })
        try {
            // Prepare ATS result JSON
            const atsResult = {
                skillsFound: data.skillsFound || [],
                missingSkills: data.missingSkills || [],
                tips: data.tips || []
            }

            const { data: app, error } = await supabase
                .from('applications')
                .insert([{
                    job_id: data.jobId,
                    candidate_name: data.candidateName,
                    candidate_email: data.candidateEmail,
                    resume_url: data.resumeUrl,
                    ats_score: data.atsScore,
                    ats_result: atsResult,
                    status: 'pending'
                }])
                .select()
                .single()

            if (error) throw error
            return mapApplication(app)
        } catch (err) {
            console.error(err)
            return null
        } finally {
            set({ isLoading: false })
        }
    },

    getCandidateApplications: async (candidateId: string) => {
        set({ isLoading: true })
        console.log("JobStore: Fetching apps for candidate:", candidateId)
        try {
            const { data: apps, error } = await supabase
                .from('applications')
                .select('*, jobs(*, organisations(name))')
                .eq('candidate_id', candidateId)

            if (error) {
                console.error("JobStore: Supabase fetch error in getCandidateApplications:", error)
                throw error
            }

            console.log("JobStore: Fetched applications count:", apps?.length || 0)
            const mappedApps = apps.map(mapApplication)
            set({ applications: mappedApps })

            // Update jobs list with details from the joined query
            const newJobs = apps
                .map((a: any) => a.jobs)
                .filter(Boolean)
                .map(mapJob)

            if (newJobs.length > 0) {
                console.log("JobStore: Updating local jobs list with", newJobs.length, "jobs")
                set(state => ({
                    jobs: [...state.jobs.filter(j => !newJobs.find((newJ: Job) => newJ.id === j.id)), ...newJobs]
                }))
            }
        } catch (err) {
            console.error("JobStore: getCandidateApplications failed:", err)
        } finally {
            set({ isLoading: false })
            console.log("JobStore: getCandidateApplications complete")
        }
    },

    updateApplicationStatus: async (id, status, comments) => {
        try {
            const updateData: any = { status }
            if (comments !== undefined) updateData.comments = comments

            const { error } = await supabase
                .from('applications')
                .update(updateData)
                .eq('id', id)

            if (error) throw error

            // Update local state
            set(state => ({
                applications: state.applications.map(a =>
                    a.id === id ? { ...a, status: status as any, comments: comments || a.comments } : a
                )
            }))
            return true
        } catch (error) {
            console.error("Update status failed:", error)
            return false
        }
    },

    linkCandidateToApplication: async (applicationId, candidateId) => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ candidate_id: candidateId })
                .eq('id', applicationId)

            if (error) throw error
            return true
        } catch (error) {
            console.error("Link candidate failed:", error)
            return false
        }
    }
}))
