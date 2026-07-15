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

  test('displays the login page elements correctly', async ({ page }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('login with valid credentials redirects to /secure with a success message', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    await expect(page).toHaveURL(/.*\/secure/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
    await expect(loginPage.secureAreaHeading).toContainText('Secure Area');
  });

  test('login with an invalid username shows an error message', async ({ page }) => {
    await loginPage.login('invalid_user', VALID_PASSWORD);

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('login with an invalid password shows an error message', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, 'wrong_password');

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your password is invalid!');
  });

  test('login with empty fields shows an error for the username', async ({ page }) => {
    await loginPage.login('', '');

    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('logout after a successful login returns to the login page', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    await expect(page).toHaveURL(/.*\/secure/);

    await loginPage.logout();

    await expect(page).toHaveURL(/.*\/login/);
    await expect(loginPage.flashMessage).toContainText('You logged out of the secure area!');
  });

  test('the error message can be dismissed (close button)', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, 'wrong_password');
    await expect(loginPage.flashMessage).toBeVisible();

    const closeButton = loginPage.flashMessage.locator('.close');
    await closeButton.click();

    await expect(loginPage.flashMessage).not.toBeVisible();
  });
});