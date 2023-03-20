import { test, expect } from "@playwright/test";
import { chromium } from "playwright";
import { Page } from "playwright";

async function loginUser(page: Page) {
    await page.goto("http://localhost:3000");

    const loginButton = await page.locator("button");
    await loginButton.click();
    await page.waitForNavigation();

    await page.fill("#login-username", "jayyqwe123@gmail.com");
    await page.fill("#login-password", "Okok2541");

    await Promise.all([
        page.waitForNavigation(),
        page.click("#login-button"),
    ]);
}

test.describe("Select Page", () => {
    let page: Page;

    test.beforeAll(async () => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        page = await context.newPage();
        await loginUser(page);
    });

    test.afterAll(async () => {
        // @ts-ignore
        await page.context().browser().close();
    });

    test("should display playlists and allow selecting a playlist", async () => {
        expect(page.url()).toBe("http://localhost:3000/select");

        // Check if playlists are rendered
        const playlists = page.locator(".css-1p823my-MuiListItem-root");
        await expect(playlists).toBeVisible();

        // Click on the first playlist
        const firstPlaylist = await playlists.first();
        await firstPlaylist.click();


    });

    test("should display tracks when a playlist is selected", async () => {
        const tracksList = await page.locator(".css-1p823my-MuiListItem-root");
        const firstPlaylist = await tracksList.first();
        await firstPlaylist.click();

        // Check if the tracks list is visible
        const tracks = await page.locator(".css-1p823my-MuiListItem-root");
        await expect(tracks).toBeVisible();
    });

    test("should log out when clicking the logout button", async () => {
        const logoutButton = await page.locator(".css-1rwt2y5-MuiButtonBase-root-MuiButton-root");
        await logoutButton.click();

        // Verify if the user is redirected to the login page after logout
        expect(page.url()).toBe("http://localhost:3000");
    });
});
