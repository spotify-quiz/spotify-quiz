import {test, expect, Page, Locator} from '@playwright/test';


const TIME_LIMITS = [
    '3 seconds', '5 seconds', '10 seconds', '15 seconds', '30 seconds'
]

const NUM_QUESTIONS = [
    '5', '10', '15', '20'
]

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

    async changeTimeLimit(option) {
        await this.page.locator('//select[@name="timeLimit"]').selectOption(option)
    }

    async changeNumQuestions(option) {
        await this.page.locator('//select[@name="numQuestions"]').selectOption(option)
    }
}

class QuizPage{
    page: Page
    constructor(page: Page) {
        this.page = page;
    }
    async navigate(playlistPage: PlaylistPage, timeLimitOption, numQuestionsOption): Promise<void> {
        await playlistPage.navigate()
        await playlistPage.selectFirstPlaylist().click()

        await this.selectQuizOptions(playlistPage, timeLimitOption, numQuestionsOption)
        await playlistPage.page.getByText("Submit").first().click()
    }

    async selectQuizOptions(playlistPage, timeLimitOption, numQuestionsOption) {
        await playlistPage.changeTimeLimit(timeLimitOption)
        await playlistPage.changeNumQuestions(numQuestionsOption)
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

    test('selecting a playlist should show songs', async () => {
        const playlistPage = new PlaylistPage(page)
        await playlistPage.navigate()

        const playlistDiv = page.getByTestId("playlist-0").first()

        //const playlistImg = playlistPage.selectFirstPlaylistImage()
        //const playlistName = await playlistImg.getAttribute("alt")

        const playlistImg = await playlistPage.selectFirstPlaylistImage()
        const playlistName = await playlistImg.evaluate(e => (e as HTMLImageElement).alt)

        await playlistDiv.click()

        // @ts-ignore
        await expect(page.getByText(playlistName)).toBeVisible() // songs in playlist should be visible
    })

    test('selecting a playlist and submitting should lead to quiz page', async () => {
        const playlistPage = new PlaylistPage(page)
        await playlistPage.navigate()


        await playlistPage.page.getByTestId("playlist-0").first().click()
        const playlistId = await playlistPage.selectFirstPlaylistImage().getAttribute("data-playlist-id")
        await playlistPage.page.getByText("Submit").first().click()

        await page.waitForLoadState('networkidle')

        await expect(page).toHaveURL(/.*renderQuiz.*/)
    })

    test('selecting a playlist with options should to the quiz page with selected options 3s, 10q', async () => {
        const playlistPage = new PlaylistPage(page)
        await playlistPage.navigate()

        const quizPage = new QuizPage(page)
        await quizPage.navigate(playlistPage, TIME_LIMITS[0], NUM_QUESTIONS[1])

        await expect(page).toHaveURL(/.*renderQuiz.*/)

        await expect(page).toHaveURL(/.*timeLimit=3.*/)
        await expect(page).toHaveURL(/.*numQuestions=10.*/)

        await expect(page.getByText("Time : 3")).toBeVisible()

        const playButton = page.getByText("Play").first()
        await expect(playButton).toBeVisible()

        await playButton.click()
        await expect(page.getByText("Wrong!")).toBeVisible()
    })

})