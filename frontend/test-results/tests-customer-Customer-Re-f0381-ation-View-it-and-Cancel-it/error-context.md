# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\customer.spec.js >> Customer Reservation Flow >> Create Reservation, View it, and Cancel it
- Location: tests\customer.spec.js:16:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:5173/dashboard"
Received: "http://localhost:5173/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:5173/login"

```

```yaml
- heading "Welcome Back" [level=2]
- paragraph: Sign in to your account
- img
- paragraph: Invalid email or password.
- text: Email Address
- textbox "you@example.com": karthikeya@test.com
- text: Password
- textbox "••••••••": "123456"
- button "Sign In"
- text: Don't have an account?
- link "Register here":
  - /url: /register
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Customer Reservation Flow', () => {
  4  |   const customerEmail = 'karthikeya@test.com';
  5  |   const customerPass = '123456';
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     // Login first
  9  |     await page.goto('http://localhost:5173/login');
  10 |     await page.fill('input[type="email"]', customerEmail);
  11 |     await page.fill('input[type="password"]', customerPass);
  12 |     await page.click('button[type="submit"]');
> 13 |     await expect(page).toHaveURL('http://localhost:5173/dashboard');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  14 |   });
  15 | 
  16 |   test('Create Reservation, View it, and Cancel it', async ({ page }) => {
  17 |     // 1. Create Reservation
  18 |     await page.click('text=Book Now');
  19 |     await expect(page).toHaveURL('http://localhost:5173/reservations/new');
  20 |     
  21 |     // Fill form
  22 |     await page.fill('#reservationDate', '2026-07-15');
  23 |     await page.selectOption('#timeSlot', '06:00 PM');
  24 |     await page.fill('#guests', '4');
  25 |     
  26 |     // Submit
  27 |     await page.click('button[type="submit"]');
  28 |     
  29 |     // Check Success Screen
  30 |     await expect(page.locator('text=Reservation Created Successfully!')).toBeVisible();
  31 |     
  32 |     // 2. View Reservations
  33 |     await page.click('text=View My Reservations');
  34 |     await expect(page).toHaveURL('http://localhost:5173/reservations');
  35 |     
  36 |     // Verify Data in Table/Card
  37 |     await expect(page.locator('text=7/15/2026').first()).toBeVisible();
  38 |     await expect(page.locator('text=06:00 PM').first()).toBeVisible();
  39 |     await expect(page.locator('text=ACTIVE').first()).toBeVisible();
  40 | 
  41 |     // 3. Cancel Reservation
  42 |     // Click Cancel on the first active reservation
  43 |     const cancelBtn = page.locator('button:has-text("Cancel")').first();
  44 |     await cancelBtn.click();
  45 |     
  46 |     // Click confirm in modal
  47 |     await page.click('button:has-text("Confirm")');
  48 |     
  49 |     // Verify Toast and Badge update
  50 |     await expect(page.locator('text=Reservation cancelled successfully')).toBeVisible();
  51 |     
  52 |     // Verify Status changed to CANCELLED for that specific element
  53 |     // This depends on the specific row but checking for CANCELLED badge on the screen
  54 |     await expect(page.locator('text=CANCELLED').first()).toBeVisible();
  55 |   });
  56 | });
  57 | 
```