# Playwright Test Project

This project contains automated end-to-end (E2E) tests written in **TypeScript** using **Playwright**.  
The project follows the Page Object Model (POM) structure for better maintainability and readability.

---

## Requirements

Before you start, make sure you have the following installed:

- Node.js (recommended LTS version)  
  https://nodejs.org/

Verify installation:

```bash
node -v
npm -v
```

---

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

2. Install project dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

---

## Running Tests

To run a specific test file in debug mode:

```bash
npx playwright test ct24.spec.ts --debug
```

This command will:
- Open Playwright Inspector
- Execute the test step by step
- Allow interactive debugging

---

## Project Structure

Example structure of the project:

```text
├── pages/
│   └── HomePage.ts
├── tests/
│   └── ct24.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```

### Description

- `pages/`  
  Contains Page Object Model classes.  
  `HomePage.ts` represents the homepage and includes reusable selectors and methods.

- `tests/`  
  Contains test specification files.

- `playwright.config.ts`  
  Playwright configuration file.

- `package.json`  
  Project dependencies and scripts.

---

## Test Reports

After running tests, open the HTML report:

```bash
npx playwright show-report
```

---

## Documentation

Official Playwright documentation:  
https://playwright.dev/docs/intro
