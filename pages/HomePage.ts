import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly mostReadHeading: Locator;
  readonly footer: Locator;
  readonly mostReadSection: Locator;
  readonly mostReadArticles: Locator;
  readonly mostReadArticlesWithImage: Locator;
  readonly mostReadDomaciHeading: Locator;
  readonly for24Hours: Locator;
  readonly for7Days: Locator;
  readonly articles: Locator;
  readonly rubrikyLinks: Locator;
  readonly menuButton: Locator;
  readonly hamburger: Locator;
  readonly liveButton: Locator;
  readonly videoTag: Locator;
  readonly reloadButton: Locator;
  readonly closeLiveButton: Locator;
  readonly livePlayerDiv: Locator;
  readonly sidebarTitles: Locator;

  constructor(page: Page) {
    this.page = page;

    this.mostReadHeading = page.getByRole('heading', { name: 'Nejčtenější', exact: true, level: 2 });
    this.footer = page.locator('footer');
    this.mostReadSection = this.mostReadHeading.locator('..').locator('..').locator('..');
    this.mostReadArticles = this.mostReadSection.getByRole('link');
    this.mostReadArticlesWithImage = this.mostReadSection.getByRole('img');
    this.mostReadDomaciHeading = page.getByRole('heading', { name: 'NEJČTENĚJŠÍ Z RUBRIKY' });
    this.for24Hours = page.locator(`//h2[contains(text(), 'Nejčtenější')]/following-sibling::div//div[text()='za 7 dní']`);
    this.for7Days = page.locator(`//h2[contains(text(), 'Nejčtenější')]/following-sibling::div//div[text()='za 24 hodin']`);
    this.articles = page.locator('[class="wc-ta__layout-sidebar"] a');
    this.rubrikyLinks = page.locator('[aria-label="Rubriky"] a');
    this.menuButton = page.getByTestId('menu-button');
    this.hamburger = page.getByTestId('menu-button');
    this.liveButton = page.getByRole('button', { name: 'Živé vysílání' });
    this.videoTag = page.getByTestId('video-tag').first();
    this.reloadButton = page.getByRole('button', { name: 'Znovu načíst' });
    this.closeLiveButton = page.locator('[aria-label="Zavřít živé vysílání"]');
    this.livePlayerDiv = page.locator('//div[contains(@class, "live__player video")]');
    this.sidebarTitles = page.locator('.wc-ta__layout-sidebar h3');
  }

  async testMostReadDesktop() {
    await this.page.goto('https://ct24.cz');

    const rubriky = await this.rubrikyLinks.evaluateAll(els =>
      els.map(el => ({
        url: (el as HTMLAnchorElement).href,
        text: el.textContent?.trim()
      }))
    );

    for (const rubrika of rubriky) {
      await this.checkArticles(rubrika.url);
      await this.goTo7Days();
      await this.checkArticles(rubrika.url);
      await this.goTo24Hours();
      await this.checkArticles(rubrika.url);
    }
  }

  async testMostReadMobile() {
    await this.page.goto('https://ct24.cz');
    await this.page.setViewportSize({ width: 600, height: 800 });

    await this.menuButton.click();

    const rubriky = await this.rubrikyLinks.evaluateAll(els =>
      els.map(el => ({
        url: (el as HTMLAnchorElement).href,
        text: el.textContent?.trim()
      }))
    );

    await this.menuButton.click();

    for (const rubrika of rubriky) {
      await this.checkArticlesBurger(rubrika.url);
    }
  }

  async testRubrikaDomaci() {
    await this.page.goto('https://ct24.ceskatelevize.cz/rubrika/domaci-5');
    await this.expectMostReadClankyDomaciVpravoNahore();
    await this.expectMostReadHeading();
    await this.checkArticlesDomaci();
  }

  async testResponsiveDesign() {
    await this.page.goto('https://ct24.cz');
    await this.page.setViewportSize({ width: 600, height: 800 });
    await this.page.waitForTimeout(300);
    await expect(this.hamburger).toBeVisible();
  }

  async testLiveBroadcast(browserName: string) {
    await this.page.goto('https://ct24.cz');
    await this.liveButton.click();

    if (browserName === 'firefox') {
      await expect(this.livePlayerDiv).toBeVisible();
    } else {
      await expect(this.videoTag).toBeVisible({ timeout: 20000 });

      const maxAttempts = 10;
      let attempts = 0;

      while ((await this.reloadButton.count()) > 0 && attempts < maxAttempts) {
        await this.reloadButton.first().click();
        await this.page.waitForTimeout(500);
        attempts++;
      }

      await expect.poll(async () => {
        const time1 = await this.videoTag.evaluate((v: HTMLVideoElement) => v.currentTime);
        await new Promise(r => setTimeout(r, 1000));
        const time2 = await this.videoTag.evaluate((v: HTMLVideoElement) => v.currentTime);
        return time2 > time1;
      }, { timeout: 5000 }).toBeTruthy();
    }

    await this.closeLiveButton.click();
    await expect(this.livePlayerDiv).not.toBeVisible();
  }

  async expectRubrikaUrl(rubrika: string) {
    await expect(this.page).toHaveURL(rubrika);
  }

  async waitForLayout() {
    await expect(this.mostReadHeading).toBeVisible();
    await expect(this.footer).toBeVisible();
  }

  async expectMostReadAboveFooter() {
    const mostReadBox = await this.mostReadSection.boundingBox();
    const footerBox = await this.footer.boundingBox();

    expect(mostReadBox).not.toBeNull();
    expect(footerBox).not.toBeNull();

    const mostReadBottom = mostReadBox!.y + mostReadBox!.height;
    const footerTop = footerBox!.y;

    expect(mostReadBottom).toBeLessThan(footerTop);
  }

  async expectMostReadClankyDomaciVpravoNahore() {
    const heading = await this.mostReadDomaciHeading.boundingBox();
    expect(heading).not.toBeNull();

    const viewportWidth = this.page.viewportSize()?.width;
    if (!viewportWidth) throw new Error('Viewport not available');

    const isMoreThanHalfRight = heading!.x > viewportWidth / 2;
    const isNearTop = heading!.y < 800;

    expect(isMoreThanHalfRight).toBeTruthy();
    expect(isNearTop).toBeTruthy();
  }

  async expectMostReadHeading() {
    await expect(
      this.page
        .getByRole('heading', { name: 'NEJČTENĚJŠÍ Z RUBRIKY' })
        .locator('..')
        .locator('..')
        .getByRole('heading', { name: 'Domácí' })
    ).toBeVisible();
  }

  async checkArticlesDomaci() {
    const count = await this.articles.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = this.articles.nth(i);
      const titleLink = this.sidebarTitles.nth(i);
      const title = (await titleLink.innerText()).trim();
      const href = await link.getAttribute('href');

      await Promise.all([
        this.page.waitForURL(`**${href}`),
        link.click()
      ]);

      expect(this.page.url()).toContain(href ?? '');
      await expect(this.page.getByRole('heading').first()).toContainText(new RegExp(title, 'i'));

      await this.page.goBack();
    }
  }

  async expectMostReadArticlesLoaded(minCount = 3) {
    await expect(this.mostReadArticles.first()).toBeVisible();
    const count = await this.mostReadArticles.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  async expectmostReadClankyHaveTitlesAndThreeImages() {
    const total = await this.mostReadArticles.count();

    for (let i = 0; i < total; i++) {
      const article = this.mostReadArticles.nth(i);
      await expect(article).not.toHaveText('');

      if (i <= 2) {
        const imgInside = article.locator('img');
        await expect(imgInside).toHaveCount(1);
      }
    }
  }

  async goTo24Hours() {
    await this.for24Hours.click();
  }

  async goTo7Days() {
    await this.for7Days.click();
  }

  async checkArticles(rubrika: string, minCount = 4) {
    await this.page.goto(rubrika, { waitUntil: 'domcontentloaded' });
    await this.expectRubrikaUrl(rubrika);
    await this.waitForLayout();
    await this.expectMostReadAboveFooter();
    await this.expectMostReadArticlesLoaded(minCount);
    await this.expectmostReadClankyHaveTitlesAndThreeImages();
  }

  async checkArticlesBurger(rubrika: string, minCount = 4) {
    await this.menuButton.click();
    await this.page.goto(rubrika, { waitUntil: 'domcontentloaded' });
    await this.expectRubrikaUrl(rubrika);
    await this.expectMostReadAboveFooter();
    await this.expectMostReadArticlesLoaded(minCount);
    await this.expectmostReadClankyHaveTitlesAndThreeImages();
  }
}
