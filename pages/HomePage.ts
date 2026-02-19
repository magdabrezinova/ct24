import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly nejctenejsiHeading: Locator;
  readonly footer: Locator;
  readonly nejctenejsiSection: Locator;
  readonly nejctenejsiArticles: Locator;
  readonly nejctenejsiArticlesWithImage: Locator;
  readonly za24Hodin: Locator;
  readonly za7Dni: Locator;
  constructor(page: Page) {
    this.page = page;

    // stabilní selektory
    this.nejctenejsiHeading = page.getByRole('heading', { name: 'Nejčtenější', exact: true , level: 2});
    this.footer = page.locator('footer');
    // sekce = rodič nadpisu
    this.nejctenejsiSection = this.nejctenejsiHeading.locator('..').locator('..').locator('..');

    // všechny odkazy článků v sekci
    this.nejctenejsiArticles = this.nejctenejsiSection.getByRole('link');

    // odkazy článků s obrázkem
    this.nejctenejsiArticlesWithImage = this.nejctenejsiSection.getByRole('img');

    // za 24 hodin
    this.za24Hodin = page.locator(`//h2[contains(text(), 'Nejčtenější')]/following-sibling::div//div[text()='za 7 dní']`);

    // za 7 dní
    this.za7Dni = page.locator(`//h2[contains(text(), 'Nejčtenější')]/following-sibling::div//div[text()='za 24 hodin']`);

    

  }

  async goto() {
    await this.page.goto('https://ct24.ceskatelevize.cz/');
  }

  async expectRubrikaUrl(rubrika: string){
    await expect(this.page).toHaveURL(rubrika);
  }

  async waitForLayout() {
    await expect(this.nejctenejsiHeading).toBeVisible();
    await expect(this.footer).toBeVisible();
  }

  /**
   * Ověří, že sekce Nejčtenější je nad patičkou
   */
  async expectNejctenejsiAboveFooter() {

    const nejBox = await this.nejctenejsiHeading.boundingBox();
    const footerBox = await this.footer.boundingBox();

    expect(nejBox).not.toBeNull();
    expect(footerBox).not.toBeNull();

    const nejBottom = nejBox!.y + nejBox!.height;
    const footerTop = footerBox!.y;

    // Nejčtenější musí být nad patičkou
    expect(nejBottom).toBeLessThan(footerTop);
  }

  async expectArticlesLoaded(minCount = 3) {

    await expect(this.nejctenejsiArticles.first()).toBeVisible();

    const count = await this.nejctenejsiArticles.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  async expectArticlesHaveTitlesAndThreeImages() {
    const articles = this.nejctenejsiArticles;
    const total = await articles.count();

    for (let i = 0; i < total; i++) {
      const article = articles.nth(i);

      // 1Link musí mít text = titulek článku
      await expect(article).not.toHaveText('');

      // Uvnitř <a> musí být <img> pro první tři články
      if (i<=2) {
        const imgInside = article.locator('img');
        await expect(imgInside).toHaveCount(1); // alespoň jeden obrázek
      }
    }
}

  async openFirstArticleAndVerify() {
    const first = this.nejctenejsiArticles.first();

    const href = await first.getAttribute('href');
    if (!href) throw new Error('Článek nemá href');

    const responsePromise = this.page.waitForResponse(resp =>
      resp.url().includes(href) && resp.status() === 200
    );

    await first.click();
    await responsePromise;

    await expect(this.page).toHaveURL(new RegExp(href));
  }

  async goTo24Hodin() {
    await this.za24Hodin.click();
  }

  async goTo7Dni() {
    await this.za7Dni.click();
  }
}
