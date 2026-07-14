import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const VALID_USERNAME = 'tomsmith';
const VALID_PASSWORD = 'SuperSecretPassword!';

test.describe('Login Page - the-internet.herokuapp.com', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('afiseaza corect elementele paginii de login', async ({ page }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('login cu credentiale valide duce la /secure si mesaj de succes', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await expect(page).toHaveURL(/.*\/secure/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
    await expect(loginPage.secureAreaHeading).toContainText('Secure Area');
  });

  test('login cu username gresit afiseaza mesaj de eroare', async ({ page }) => {
    await loginPage.login('utilizator_gresit', VALID_PASSWORD);

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('login cu parola gresita afiseaza mesaj de eroare', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, 'parola_gresita');

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your password is invalid!');
  });

  test('login cu campuri goale afiseaza eroare pentru username', async ({ page }) => {
    await loginPage.login('', '');

    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('logout dupa autentificare reusita revine pe pagina de login', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/.*\/secure/);

    await loginPage.logout();

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toContainText('You logged out of the secure area!');
  });

  test('mesajul de eroare poate fi inchis (buton close)', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, 'parola_gresita');
    await expect(loginPage.flashMessage).toBeVisible();

    const closeButton = loginPage.flashMessage.locator('.close');
    await closeButton.click();

    await expect(loginPage.flashMessage).not.toBeVisible();
  });
});
