import {test, expect, Page, Locator} from '@playwright/test';

// Write a playwright test to check for a button
// with the text "Continue as Guest" and click it.

class HomePage {
    page: Page
    constructor(page: Page) {
        this.page = page;
    }
    async navigate(): Promise<void> {
        await this.page.goto('http://localhost:3000/');
    }

    getContinueAsGuestButton(): Locator {
        return this.page.locator("//button[contains(text(), 'Continue as Guest')]").first()
    }
}

class PlaylistPage {
    page: Page
    constructor(page: Page) {
        this.page = page;
    }
}

test.describe("Home Page Buttons Test", () => {
    let page: Page

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage()
    })

    test('Continue as Guest button should lead to playlist selection', async () => {
        const homePage = new HomePage(page)
        await homePage.navigate()
        const continueAsGuestButton = homePage.getContinueAsGuestButton()
        await expect(continueAsGuestButton).toBeVisible()
        await continueAsGuestButton.click()

        const playlistPage = new PlaylistPage(page)
        await playlistPage.page.waitForLoadState('networkidle')
        await expect(playlistPage.page).toHaveURL(/.*select-playlist.*isGuest=true/)
    })
})