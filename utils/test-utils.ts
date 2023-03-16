import { Page } from "playwright";
import {expect} from "@playwright/test";

export async function login(page: Page) {
    // Navigate to your login page
    await page.goto("http://localhost:3000");

    // Click on the login button
    await page.click("button");
    // Fill in the login details
    await page.fill("#login-username", "jayyqwe123@gmail.com");
    await page.fill("#login-password", "Okok2541");

    // Click on the login button and wait for the navigation to complete
    await Promise.all([
        page.waitForNavigation(),
        page.click("#login-button"),
    ]);


    // Wait for the navigation to complete and ensure you're on the correct page after login
    await page.waitForNavigation();
    expect(page.url()).toBe("http://localhost:3000/select");
}
