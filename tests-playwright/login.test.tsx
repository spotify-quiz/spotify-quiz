import { test, expect } from "@playwright/test";
import { chromium } from "playwright";
import { Page } from "playwright";

test.describe("Login Page", () => {
    let page: Page;

    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        page = await context.newPage();
    });

    test.afterAll(async () => {
        // @ts-ignore
        await page.context().browser().close();
    });

    test("should display the login button and navigate to the Select page upon login", async () => {
        await page.goto("http://localhost:3000");

        const loginButton = await page.locator("button");
        await expect(loginButton).toBeVisible();
        expect(await loginButton.textContent()).toContain("Login with Spotify");

        // Click on the login button
        loginButton.click();

        // Wait for the navigation to the Spotify login page
        await page.waitForNavigation();

        // Fill in the login details
        await page.fill("#login-username", "");
        await page.fill("#login-password", "");

        // Click on the login button and wait for the navigation to complete
        await Promise.all([
            page.waitForNavigation(),
            page.click("#login-button"),
        ]);

        // Verify that the user has been redirected to the Select page after login
        expect(page.url()).toBe("http://localhost:3000/select");
    });
});
