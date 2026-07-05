import { test, expect } from '@playwright/test';

test.describe('Customer Reservation Flow', () => {
  const customerEmail = 'karthikeya@test.com';
  const customerPass = '123456';

  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', customerEmail);
    await page.fill('input[type="password"]', customerPass);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173/dashboard');
  });

  test('Create Reservation, View it, and Cancel it', async ({ page }) => {
    // 1. Create Reservation
    await page.click('text=Book Now');
    await expect(page).toHaveURL('http://localhost:5173/reservations/new');
    
    // Fill form
    await page.fill('#reservationDate', '2026-07-15');
    await page.selectOption('#timeSlot', '06:00 PM');
    await page.fill('#guests', '4');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Check Success Screen
    await expect(page.locator('text=Reservation Created Successfully!')).toBeVisible();
    
    // 2. View Reservations
    await page.click('text=View My Reservations');
    await expect(page).toHaveURL('http://localhost:5173/reservations');
    
    // Verify Data in Table/Card
    await expect(page.locator('text=7/15/2026').first()).toBeVisible();
    await expect(page.locator('text=06:00 PM').first()).toBeVisible();
    await expect(page.locator('text=ACTIVE').first()).toBeVisible();

    // 3. Cancel Reservation
    // Click Cancel on the first active reservation
    const cancelBtn = page.locator('button:has-text("Cancel")').first();
    await cancelBtn.click();
    
    // Click confirm in modal
    await page.click('button:has-text("Confirm")');
    
    // Verify Toast and Badge update
    await expect(page.locator('text=Reservation cancelled successfully')).toBeVisible();
    
    // Verify Status changed to CANCELLED for that specific element
    // This depends on the specific row but checking for CANCELLED badge on the screen
    await expect(page.locator('text=CANCELLED').first()).toBeVisible();
  });
});
