export function buildHtmlTemplate(name: string, status: string): string {
  const messages: Record<string, string> = {
    selected: `
      <h2>Congratulations, ${name}!</h2>
      <p>We're pleased to inform you that your application has been <strong>accepted</strong>.</p>
      <p>Our HR team will reach out shortly with next steps.</p>
    `,
    rejected: `
      <h2>Dear ${name},</h2>
      <p>Thank you for applying. After careful review, we've decided to move forward with other candidates.</p>
      <p>We wish you the best in your job search.</p>
    `,
    interview: `
      <h2>Hi ${name},</h2>
      <p>We'd like to invite you for an interview! Our team will contact you soon to schedule a time.</p>
    `,
  };

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      ${messages[status] || '<p>Your application status has been updated.</p>'}
      <hr/>
      <p style="color: #888; font-size: 12px;">HireAutoSys &mdash; Automated Hiring System</p>
    </div>
  `;
}

export function buildTextTemplate(name: string, status: string): string {
  const messages: Record<string, string> = {
    selected: `Congratulations, ${name}!\n\nWe're pleased to inform you that your application has been accepted.\nOur HR team will reach out shortly with next steps.`,
    rejected: `Dear ${name},\n\nThank you for applying. After careful review, we've decided to move forward with other candidates.\nWe wish you the best in your job search.`,
    interview: `Hi ${name},\n\nWe'd like to invite you for an interview! Our team will contact you soon to schedule a time.`,
  };

  return `${messages[status] || 'Your application status has been updated.'}\n\n---\nHireAutoSys — Automated Hiring System`;
}
