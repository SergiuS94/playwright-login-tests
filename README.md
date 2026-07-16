# Playwright Login Tests

Automated tests (Playwright + TypeScript) for the login page:
https://the-internet.herokuapp.com/login

## Project structure

```
playwright-login-tests/
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── .env.example              # variable names only, no real values, committed to git
├── .env                       # your local values, NOT committed (gitignored)
├── .github/
│   └── workflows/
│       └── playwright.yml    # CI: runs tests using repository secrets
├── tests/
│   ├── login.spec.ts       # the actual tests
│   └── pages/
│       └── LoginPage.ts    # Page Object Model
├── .gitignore
└── allure-results/          # generated automatically on run, NOT committed to git
```

## Setup (in VS Code, integrated terminal)

```bash
npm install
npx playwright install --with-deps
```

## Environment variables

The test credentials are not hardcoded in the code — they are read from environment variables.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   (on Windows PowerShell: `copy .env.example .env`)

2. Open `.env` and fill in the real values:
   ```
   VALID_USERNAME=tomsmith
   VALID_PASSWORD=SuperSecretPassword!
   ```

`.env` is listed in `.gitignore` and is never committed. Only `.env.example` (with empty values) is tracked in git, so anyone cloning the repo knows which variables they need to set.

## Running tests

```bash
npm test                # run all tests, headless
npm run test:headed     # with a visible browser
npm run test:ui         # interactive UI mode (recommended for debugging)
npm run test:debug      # step-by-step debug mode
```

## Test report (native Playwright HTML)

```bash
npm run report
```

## Allure report

The project generates, alongside the native HTML report, Allure-compatible results (`allure-results/` directory), including steps (before/action/after) captured automatically from Playwright hooks, and screenshot/video/trace attachments captured automatically on failure.

**Requirement:** Java (JRE 8+) must be installed on your machine so `allure-commandline` can generate the HTML report.

1. Run the tests (this generates `allure-results/` automatically):
   ```bash
   npm test
   ```

2. Generate the HTML report from the results:
   ```bash
   npm run report:generate
   ```

3. Open the report in the browser:
   ```bash
   npm run report:open
   ```

The report shows, for each test: steps (including `beforeEach`), status, duration, and attachments (screenshot/video/trace) for failed tests.

## Valid credentials used in the tests

Set locally in `.env` (see [Environment variables](#environment-variables) above) — not hardcoded in the source code.

## CI (GitHub Actions)

The workflow at `.github/workflows/playwright.yml` runs the tests automatically on every push and pull request to `main`/`master`, reading the credentials from **GitHub repository secrets** instead of a `.env` file (which doesn't exist in CI).

**One-time setup in GitHub:**

1. Go to the repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - Name: `VALID_USERNAME`, Value: `tomsmith`
   - Name: `VALID_PASSWORD`, Value: `SuperSecretPassword!`

Once set, the workflow injects them as environment variables automatically — no code changes needed. The HTML report is uploaded as a workflow artifact after each run.

## Test coverage

1. Login page elements are displayed correctly
2. Successful login -> redirect to `/secure` + confirmation message
3. Login with invalid username -> error message
4. Login with invalid password -> error message
5. Login with empty fields -> error message
6. Logout after login -> returns to `/login`
7. Dismissing the flash message ("x" button)