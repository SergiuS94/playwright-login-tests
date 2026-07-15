# Playwright Login Tests

Teste automate (Playwright + TypeScript) pentru pagina de login:
https://the-internet.herokuapp.com/login

## Structura proiectului

```
playwright-login-tests/
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── tests/
│   ├── login.spec.ts       # testele propriu-zise
│   └── pages/
│       └── LoginPage.ts    # Page Object Model
├── .gitignore
└── allure-results/          # generat automat la rulare, NU se urca pe git
```

## Instalare (in VS Code, terminal integrat)

```bash
npm install
npx playwright install --with-deps
```

## Rulare teste

```bash
npm test                # ruleaza toate testele, headless
npm run test:headed     # cu browser vizibil
npm run test:ui         # UI mode interactiv (recomandat pentru debugging)
npm run test:debug      # mod debug pas cu pas
```

## Raport rezultate (HTML nativ Playwright)

```bash
npm run report
```

## Raport Allure

Proiectul genereaza, in paralel cu raportul HTML nativ, si rezultate compatibile Allure (director `allure-results/`), cu pasi (before/action/after), screenshot/video/trace atasate automat la esec, si metadate (feature, severity).

**Cerinta:** ai nevoie de Java (JRE 8+) instalat pe calculator pentru ca `allure-commandline` sa poata genera raportul HTML.

1. Ruleaza testele (genereaza automat `allure-results/`):
   ```bash
   npm test
   ```

2. Genereaza raportul HTML din rezultate:
   ```bash
   npm run report:generate
   ```

3. Deschide raportul in browser:
   ```bash
   npm run report:open
   ```

Raportul afiseaza pentru fiecare test: pasii (inclusiv `beforeEach`), status, durata, si atasamentele (screenshot/video/trace) pentru testele esuate.

## Credentiale valide folosite in teste

- Username: `tomsmith`
- Password: `SuperSecretPassword!`

## Ce acopera testele

1. Afisarea corecta a elementelor din pagina de login
2. Login cu succes -> redirect catre `/secure` + mesaj de confirmare
3. Login cu username gresit -> mesaj de eroare
4. Login cu parola gresita -> mesaj de eroare
5. Login cu campuri goale -> mesaj de eroare
6. Logout dupa autentificare -> revenire pe `/login`
7. Inchiderea mesajului flash (buton "x")
