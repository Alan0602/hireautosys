import { Resend } from 'resend';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildHtmlTemplate, buildTextTemplate } from '@/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore in API routes
            }
          },
        },
      }
    );

    // Auth Guard
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, candidateName, candidateEmail, status } = await req.json();

    // Custom Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!candidateEmail || !emailRegex.test(candidateEmail)) {
      console.warn('Invalid or missing candidate email address:', candidateEmail);
      return NextResponse.json({ error: 'Invalid or missing candidate email address.' }, { status: 400 });
    }

    // Guard: check if email already sent
    const { data: app, error: queryError } = await supabase
      .from('applications')
      .select('email_sent')
      .eq('id', applicationId)
      .single();

    if (queryError) {
      console.error('Failed to query application:', queryError);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    if (app?.email_sent) {
      return NextResponse.json({ message: 'Email already sent' }, { status: 200 });
    }

    const subject = status === 'selected'
      ? "Congratulations! You've been selected"
      : status === 'interview'
      ? 'Interview Invitation'
      : 'Application Update';

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
