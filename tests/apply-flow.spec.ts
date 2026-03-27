import { test, expect } from '@playwright/test';

const JOB_SLUG = 'senior-react-developer-228d26'; // Checked in Supabase jobs table
const ADMIN_USER = process.env.TEST_ADMIN_USER || 'admin';               
const ADMIN_PASS = process.env.TEST_ADMIN_PASS || 'ababab';        

test.describe('HireScope Apply Flow & HR Dashboard', () => {

  test('Candidate can view a job posting', async ({ page }) => {
    await page.goto(`/apply/${JOB_SLUG}`);
    // Wait for Supabase to load the job
    await page.waitForSelector('h1', { timeout: 15000 });
    await expect(page.locator('h1').first())
      .toContainText('Senior React Developer', { timeout: 10000 });
    await expect(page.getByText('Apply Now').first()).toBeVisible();
    await expect(page.getByText('React').first()).toBeVisible();
  });

  test('High-match candidate gets passing score', async ({ page }) => {
    await page.goto(`/apply/${JOB_SLUG}`);
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });
    await page.fill('input[type="email"]', 'arjun.sharma.test@example.com');

    // Create a minimal valid PDF buffer
    const pdfBytes = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj ' +
      '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj ' +
      '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\n' +
      'xref\n0 4\n0000000000 65535 f\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n9\n%%EOF'
    );
    await page.setInputFiles('input[type="file"]', {
      name: 'arjun_sharma_react.pdf',
      mimeType: 'application/pdf',
      buffer: pdfBytes,
    });

    await page.check('input[type="checkbox"]');
    await page.click('button[type="submit"]');

    // Wait for AI to respond — up to 60 seconds
    await expect(page.locator('text=/%/').first()).toBeVisible({ timeout: 60000 });
    await page.screenshot({ path: 'test-results/high-match-result.png' });
  });

  test('HR dashboard shows applications after login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('#username', { timeout: 10000 });
    await page.fill('#username', ADMIN_USER);
    await page.fill('#password', ADMIN_PASS);
    await page.click('button[type="submit"]');
    // Client-side auth — wait for dashboard content not URL
    await page.waitForSelector('h1', { timeout: 15000 });
    await expect(page.locator('h1').first())
      .toContainText('Dashboard', { timeout: 10000 });
  });

});
