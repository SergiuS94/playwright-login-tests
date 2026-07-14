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
└── .gitignore
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

## Raport rezultate

```bash
npm run report
```

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
