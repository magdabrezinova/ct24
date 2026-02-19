import { test, expect } from '@playwright/test';

test('Nejčtenější články', async ({ page }) => {
  
  await page.goto('https://ct24.cz');

  const links = page.locator('[aria-label="Rubriky"] a');

  const rubriky = await links.evaluateAll(els =>
    els.map(el => ({
      url: (el as HTMLAnchorElement).href,
      text: el.textContent?.trim()
    }))
  );

  for (const rubrika of rubriky) {
    await page.goto(rubrika.url, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(rubrika.url);
    await expect(page.getByRole('heading', { level: 2, name: 'Nejčtenější' })).toBeVisible();
  }
});


test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
