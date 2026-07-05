import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  const customerEmail = 'karthikeya@test.com';
  const customerPass = '123456';
  
  test('Test 1 - Register', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    await page.fill('input[placeholder="Full Name"]', 'Karthikeya');
    await page.fill('input[placeholder="you@example.com"]', customerEmail);
    await page.fill('input[placeholder="••••••••"]', customerPass);
    // There are two password fields in register, the second one is confirm
    const passInputs = await page.locator('input[type="password"]').all();
    await passInputs[0].fill(customerPass);
    await passInputs[1].fill(customerPass);
    
    await page.click('button[type="submit"]');
    
    // Expect redirect to dashboard
    await expect(page).toHaveURL('http://localhost:5173/dashboard', { timeout: 10000 });
    
    // Test 5 - Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('http://localhost:5173/login');
  });

  test('Test 2 - Customer Login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', customerEmail);
    await page.fill('input[type="password"]', customerPass);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:5173/dashboard', { timeout: 10000 });
    
    // Test 4 - Refresh Browser
    await page.reload();
    await expect(page).toHaveURL('http://localhost:5173/dashboard');
  });

  test('Test 3 - Admin Login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    // Assuming seed:admin script was run and created admin@example.com / admin123
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:5173/admin/dashboard', { timeout: 10000 });
  });

  test('Test 6 - Invalid Login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    // Check if error message is visible
    const errorMsg = page.locator('text=Invalid credentials');
    await expect(errorMsg).toBeVisible();
  });
});
