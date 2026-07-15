import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { LoginPage } from './pages/LoginPage';

const VALID_USERNAME = 'tomsmith';
const VALID_PASSWORD = 'SuperSecretPassword!';

test.describe('Login Page - the-internet.herokuapp.com', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // metadate comune pentru toate testele din acest fisier (grupare pe epic/feature in raport)
    await allure.epic('Autentificare');
    await allure.feature('Login Page');

    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('afiseaza corect elementele paginii de login', async ({ page }) => {
    await allure.severity(Severity.MINOR);

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
  });

  // test pilot: metadate complete (epic/feature/story/severity) + step-uri explicite
  test('login cu credentiale valide duce la /secure si mesaj de succes', async ({ page }) => {
    await allure.story('Login cu credentiale valide');
    await allure.severity(Severity.BLOCKER);

    await allure.step('Completez formularul si trimit login-ul', async () => {
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    });

    await allure.step('Verific redirectionarea catre zona securizata', async () => {
      await expect(page).toHaveURL(/.*\/secure/);
      await expect(loginPage.secureAreaHeading).toContainText('Secure Area');
    });

    await allure.step('Verific mesajul de confirmare', async () => {
      await expect(loginPage.flashMessage).toBeVisible();
      await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
    });
  });

  test('login cu username gresit afiseaza mesaj de eroare', async ({ page }) => {
    await allure.severity(Severity.CRITICAL);

    await loginPage.login('utilizator_gresit', VALID_PASSWORD);

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('login cu parola gresita afiseaza mesaj de eroare', async ({ page }) => {
    await allure.severity(Severity.CRITICAL);

    await loginPage.login(VALID_USERNAME, 'parola_gresita');

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your password is invalid!');
  });

  test('login cu campuri goale afiseaza eroare pentru username', async ({ page }) => {
    await allure.severity(Severity.NORMAL);

    await loginPage.login('', '');

    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('logout dupa autentificare reusita revine pe pagina de login', async ({ page }) => {
    await allure.severity(Severity.CRITICAL);

    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/.*\/secure/);

    await loginPage.logout();

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toContainText('You logged out of the secure area!');
  });

  test('mesajul de eroare poate fi inchis (buton close)', async ({ page }) => {
    await allure.severity(Severity.MINOR);

    await loginPage.login(VALID_USERNAME, 'parola_gresita');
    await expect(loginPage.flashMessage).toBeVisible();

    const closeButton = loginPage.flashMessage.locator('.close');
    await closeButton.click();

    await expect(loginPage.flashMessage).not.toBeVisible();
  });
});
