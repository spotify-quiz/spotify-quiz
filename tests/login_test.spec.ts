import {test, expect, Page, Locator} from '@playwright/test';

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

    getLoginWithSpotifyButton(): Locator {
        return this.page.locator("//button[contains(text(), 'Log in with Spotify')]").first()
    }
}

class PlaylistPage {
    page: Page
    constructor(page: Page) {
        this.page = page;
    }
    async navigate(): Promise<void> {
        await this.page.goto('http://localhost:3000/select-playlist?isGuest=true');
    }

    selectFirstPlaylist(): Locator {
        return this.page.locator('//div[@data-testid="playlist-0"]').first()
    }

    selectFirstPlaylistImage(): Locator {
        return this.page.locator('//div[@data-testid="playlist-0"]//img').first()
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

    test('Login button should lead to spotify login', async () => {
        const homePage = new HomePage(page)
        await homePage.navigate()
        const loginButton = homePage.getLoginWithSpotifyButton()
        await expect(loginButton).toBeVisible()
        await loginButton.click()

        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(/.*spotify.com/)
    })
})

test.describe("Playlist Page selection tests", () => {
    let page: Page

    test.beforeAll(async ({browser}) => {
        page = await browser.newPage()
    })

    test('selecting a playlist should show the songs in the playlist', async () => {
        const playlistPage = new PlaylistPage(page)
        await playlistPage.navigate()

        const playlistDiv = page.getByTestId("playlist-0").first()
        const playlistImg = playlistPage.selectFirstPlaylistImage()
        const playlistName = await playlistImg.getAttribute("alt")

        await playlistDiv.click()

        // @ts-ignore
        await expect(page.getByText(playlistName)).toBeVisible()
    })
})