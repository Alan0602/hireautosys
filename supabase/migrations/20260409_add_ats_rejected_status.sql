-- Add 'ats_rejected' status to the application_statuses lookup table.
-- This status is used for candidates who scored below the ATS cutoff
-- but above 50% of it, keeping them available for optional HR review.

INSERT INTO application_statuses (status, label, description)
VALUES (
    'ats_rejected',
    'ATS Rejected',
    'Candidate scored below the ATS cutoff but above 50% of it. Saved for optional HR review.'
)
ON CONFLICT (status) DO NOTHING;
