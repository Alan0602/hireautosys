-- Migration: Add Email Tracking to Applications

DO $$ 
BEGIN
    -- Add email_sent column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='applications' AND column_name='email_sent') THEN
        ALTER TABLE applications ADD COLUMN email_sent BOOLEAN DEFAULT FALSE;
        COMMENT ON COLUMN applications.email_sent IS 'Tracks if an email was sent for a status update to prevent duplicates';
    END IF;

    -- Add email_sent_at column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='applications' AND column_name='email_sent_at') THEN
        ALTER TABLE applications ADD COLUMN email_sent_at TIMESTAMPTZ;
        COMMENT ON COLUMN applications.email_sent_at IS 'Timestamp of when the email was sent to the candidate';
    END IF;

    -- Add email_type column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='applications' AND column_name='email_type') THEN
        ALTER TABLE applications ADD COLUMN email_type TEXT CHECK (email_type IN ('selected', 'rejected', 'interview'));
        COMMENT ON COLUMN applications.email_type IS 'Type of email sent (selected, rejected, interview)';
    END IF;
END $$;
