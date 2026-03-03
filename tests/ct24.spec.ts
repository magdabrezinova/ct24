import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('Nejčtenější články >= šířka 768px', async ({ page }) => {
  const home = new HomePage(page);
  await home.testMostReadDesktop();
});

test('Nejčtenější články < šířka 768px', async ({ page }) => {
  const home = new HomePage(page);
  await home.testMostReadMobile();
});

test('Rubrika Domácí', async ({ page }) => {
  const home = new HomePage(page);
  await home.testRubrikaDomaci();
});

test('Responsivní design', async ({ page }) => {
  const home = new HomePage(page);
  await home.testResponsiveDesign();
});

test('Živé vysílání', async ({ page, browserName }) => {
  const home = new HomePage(page);
  await home.testLiveBroadcast(browserName);
});
