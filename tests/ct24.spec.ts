import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('Nejčtenější články', async ({ page }) => {
  const home = new HomePage(page);
  await page.goto('https://ct24.cz');

  const links = page.locator('[aria-label="Rubriky"] a');

  const rubriky = await links.evaluateAll(els =>
    els.map(el => ({
      url: (el as HTMLAnchorElement).href,
      text: el.textContent?.trim()
    }))
  );

  async function checkArticles(rubrika: string){
    await page.goto(rubrika, { waitUntil: 'domcontentloaded' });
    await home.expectRubrikaUrl(rubrika);
    await home.waitForLayout();
    //Nejčtenější články jsou nad patičkou
    await home.expectNejctenejsiAboveFooter();
    //Nahrají se články s odkazy
    await home.expectArticlesLoaded(4);
    //Články obsahují titulky a první tři články mají fotky
    await home.expectArticlesHaveTitlesAndThreeImages();
  }

  for (const rubrika of rubriky) {
    await checkArticles(rubrika.url);
    await home.goTo7Dni();
    await checkArticles(rubrika.url);
    await home.goTo24Hodin();
    await checkArticles(rubrika.url);
  }
});

