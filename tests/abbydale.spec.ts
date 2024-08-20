import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('baseURL');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Abbeydale Christian Fellowship/);
});

test('Contact US link', async ({ page }) => {
  await page.goto('baseURL');

  // Click the Contact Us link.
  await page.getByRole('link', { name: 'Contact Us' }).click();

  // Expects page to have a heading Contact Us.
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();

  
});
test('Do you have', async ({ page }) => {
  await page.goto('baseURL/contact-us/');
  // Expects page has a 'Do you have a question about our church or our faith?' text
  await expect(page.getByText('Do you have a question about our church or our faith?')).toBeVisible();
  
});