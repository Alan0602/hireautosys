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
    status: 'pending' | 'hr_approve' | 'teamlead_approve' | 'ready_for_checkin' | 'rejected' | 'ats_rejected' | 'hired'
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
    department: dbJob.department || 'Engineering',
    location: dbJob.location || 'Remote',
    experience: dbJob.experience || '',
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
    uploadResume: (file: File, applicationId: string) => Promise<string | null>
    deleteResume: (resumePath: string) => Promise<void>
    getResumeSignedUrl: (resumePath: string) => Promise<string | null>
    submitApplication: (data: any, resumeFile?: File) => Promise<Application | null>
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
                    slug: slug,
                    department: data.department,
                    location: data.location,
                    experience: data.experience
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

    uploadResume: async (file: File, applicationId: string) => {
        try {
            const path = `${applicationId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
            const { error } = await supabase.storage
                .from('resumes')
                .upload(path, file, { contentType: 'application/pdf', upsert: false })
            if (error) throw error
            return path
        } catch (err) {
            console.error('Resume upload failed:', err)
            return null
        }
    },

    deleteResume: async (resumePath: string) => {
        if (!resumePath || resumePath.startsWith('http')) return // skip old filename-only entries
        try {
            await supabase.storage.from('resumes').remove([resumePath])
        } catch (err) {
            console.error('Resume delete failed:', err)
        }
    },

    getResumeSignedUrl: async (resumePath: string) => {
        if (!resumePath || resumePath.startsWith('http') || !resumePath.includes('/')) return null
        try {
            const { data, error } = await supabase.storage
                .from('resumes')
                .createSignedUrl(resumePath, 3600) // 1 hour expiry
            if (error) throw error
            return data.signedUrl
        } catch (err) {
            console.error('Signed URL failed:', err)
            return null
        }
    },

    submitApplication: async (data, resumeFile?: File) => {
        set({ isLoading: true })
        try {
            // Prepare ATS result JSON
            const atsResult = {
                skillsFound: data.skillsFound || [],
                missingSkills: data.missingSkills || [],
                tips: data.tips || []
            }

            // Insert application first to get the ID
            const { data: app, error } = await supabase
                .from('applications')
                .insert([{
                    job_id: data.jobId,
                    candidate_name: data.candidateName,
                    candidate_email: data.candidateEmail,
                    resume_url: data.resumeUrl || '',
                    ats_score: data.atsScore,
                    ats_result: atsResult,
                    status: data.status || 'pending'
                }])
                .select()
                .single()

            if (error) throw error

            // Upload actual resume PDF if provided
            if (resumeFile && app) {
                const { uploadResume } = get()
                const path = await uploadResume(resumeFile, app.id)
                if (path) {
                    await supabase
                        .from('applications')
                        .update({ resume_url: path })
                        .eq('id', app.id)
                    app.resume_url = path
                }
            }

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

            // Auto-delete resume from storage when application reaches a final state
            if (status === 'hired' || status === 'rejected') {
                const app = get().applications.find(a => a.id === id)
                if (app?.resumeUrl) {
                    get().deleteResume(app.resumeUrl)
                }
            }

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
