export type Role = 'candidate' | 'hr' | 'team_lead';

export interface Application {
    id: string;
    candidateId: string;
    jobId: string;
    status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
    score: number;
    submittedAt: string;
}

export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: 'full-time' | 'contract' | 'internship';
    postedAt: string;
    status: 'active' | 'closed' | 'draft';
}
