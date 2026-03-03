<<<<<<< HEAD
# CT24 Playwright Tests

Automatizované end-to-end testy webu https://ct24.cz vytvořené pomocí Playwright a TypeScript.

Projekt ověřuje funkčnost sekce **Nejčtenější**, responsivní chování webu a funkčnost **Živého vysílání**.

---

## Použité technologie

- Node.js  
- TypeScript  
- Playwright  
- Page Object Model (POM)

---

## Struktura projektu
tests/
└── ct24.spec.ts

pages/
└── HomePage.ts

playwright.config.ts
package.json
README.md


### tests/ct24.spec.ts

Obsahuje pouze testovací scénáře.  
Veškerá testovací logika je implementována v `HomePage`.

### pages/HomePage.ts

Obsahuje:
- všechny lokátory jako readonly vlastnosti
- navigační metody
- validační metody
- testovací logiku
- práci s live playerem

Projekt je navržen podle principu **Page Object Model**, aby byla oddělena testovací logika od testovacích scénářů.

---

## Instalace

### Instalace závislostí

```bash
npm install
```

### Instalace Playwright prohlížečů

```bash
npx playwright install
```

## Spouštění testů

### Spuštění všech testů

```bash
npx playwright test
```

### Spuštění konkrétního testovacího souboru

```bash
npx playwright test tests/ct24.spec.ts
```

### Spuštění konkrétního testu podle názvu

```bash
npx playwright test -g "Rubrika Domácí"
```

### Spuštění v headed režimu

```bash
npx playwright test --headed
```

### Spuštění pouze v jednom prohlížeči

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Spuštění v debug režimu

```bash
npx playwright test --debug
```

### Spuštění s trace záznamem

```bash
npx playwright test --trace on
```

### Otevření trace vieweru:

```bash
npx playwright show-trace trace.zip
```


## Co testy pokrývají

### Nejčtenější články – Desktop (>= 768px)

Projde všechny rubriky

Ověří správnou URL

Ověří, že sekce Nejčtenější je nad patičkou

Ověří načtení článků

Ověří, že první tři články obsahují obrázek

Přepíná mezi:

za 24 hodin

za 7 dní

### Nejčtenější články – Mobile (< 768px)

Nastaví viewport 600x800

Otevře hamburger menu

Projde všechny rubriky

Ověří správné načtení sekce Nejčtenější

### Rubrika Domácí

Otevře konkrétní URL

Ověří, že sekce Nejčtenější je nahoře vpravo

Ověří přítomnost nadpisu rubriky

Prokliká všechny články v sidebaru

Ověří URL a nadpis článku

### Responsivní design

Nastaví mobilní viewport

Ověří zobrazení hamburger menu

### Živé vysílání

Otevře live player

Ověří přítomnost video elementu

Pokusí se obnovit přehrávání tlačítkem Znovu načíst

Ověří, že se video skutečně přehrává (kontrola změny currentTime)

Zavře live player


### Architektura

Projekt využívá princip Page Object Model (POM).

Výhody:

- centralizované lokátory

- oddělená testovací logika

- lepší čitelnost

- snadnější údržba

- jednodušší rozšiřitelnost

Všechny lokátory jsou definovány jako readonly vlastnosti třídy.

## Možná rozšíření

Oddělit jednotlivé page do samostatného Page Objectu

Přidat CI integraci (GitHub Actions)

