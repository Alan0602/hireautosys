import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildHtmlTemplate, buildTextTemplate } from '@/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Custom cookie-based auth (not Supabase Auth)
    const cookieStore = await cookies();
    const userId = cookieStore.get('hs_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: authUser, error: authError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (authError || !authUser || !['hr', 'admin'].includes(authUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, candidateName, candidateEmail, status } = await req.json();

    // Custom Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!candidateEmail || !emailRegex.test(candidateEmail)) {
      console.warn('Invalid or missing candidate email address:', candidateEmail);
      return NextResponse.json({ error: 'Invalid or missing candidate email address.' }, { status: 400 });
    }

    // Guard: check if email already sent for this specific email type
    const { data: app, error: queryError } = await supabase
      .from('applications')
      .select('email_sent, email_type')
      .eq('id', applicationId)
      .single();

    if (queryError) {
      console.error('Failed to query application:', queryError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    // Allow re-sending if the email type changed (e.g. selected → hired)
    if (app?.email_sent && app?.email_type === status) {
      return NextResponse.json({ message: 'Email already sent' }, { status: 200 });
    }

    const subjects: Record<string, string> = {
      selected: "Congratulations! You've been selected",
      rejected: 'Application Update',
      interview: 'Interview Invitation',
      hired: '🎉 Welcome to the Team!',
      admin_approved: 'Great News — Application Progressing',
    };

    const subject = subjects[status] || 'Application Update';

    const html = buildHtmlTemplate(candidateName, status);
    const text = buildTextTemplate(candidateName, status);

    const { error: resendError } = await resend.emails.send({
      from: 'HireAutoSys <noreply@yourdomain.com>',
      to: candidateEmail,
      subject,
      html,
      text,
    });

    if (resendError) {
      return NextResponse.json({ error: resendError.message }, { status: 500 });
    }

    // Mark email as sent in Supabase
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
        email_type: status,
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Supabase update failed after sending email:', updateError);
      return NextResponse.json({ error: 'Failed to update database tracking' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API /send-email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
