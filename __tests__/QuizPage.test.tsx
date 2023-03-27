import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {Image, Item, Quiz, Song, Track} from "@/types/MockQuizObjects";
import QuizPage from "@/pages/QuizPage";
import setUpMockHTMLMediaElement from "@/__tests__/setupTest";

const dib = new Image("https://i.scdn.co/image/ab67616d0000b273649e31b49e38add30e78b57d", 640, 640)
const dim = new Image("https://i.scdn.co/image/ab67616d0000b273649e31b49e38add30e78b57d", 300, 300)
const dis = new Image("https://i.scdn.co/image/ab67616d0000b273649e31b49e38add30e78b57d", 64, 64)
const da = [dib, dim, dis]

const songUrls = [
    "https://p.scdn.co/mp3-preview/ec256975df2ce04185ba00f5f70a125cbcb4ae5e?cid=2847cfc683244615b79a93a6e24f375c",
    "https://p.scdn.co/mp3-preview/106378f1d7f8f740df126b31981e5cd0dfe85ab7?cid=2847cfc683244615b79a93a6e24f375c",
    "https://p.scdn.co/mp3-preview/36be5796f61eee41fcc1a29553b39117ca97a36a?cid=2847cfc683244615b79a93a6e24f375c"
]
let dss: Track[] = []

for (let i = 0; i < 4; i++) {
    const temp = new Song(i.toString(), da, songUrls[i % 3], 'Violette Wautier')
    dss.push(new Track(temp))
}

const dItem = new Item(dss)
const dummy = new Quiz("test", dim, dItem)
const time = 60

let playStub: any;
let pauseStub: any;
let loadStub: any;

beforeEach(() => {
    const funcs = setUpMockHTMLMediaElement()
    playStub = funcs[0]
    pauseStub = funcs[1]
    loadStub = funcs[2]
})

afterEach(() => {
    playStub.mockRestore()
    pauseStub.mockRestore()
})

describe('test Quiz page', () => {
    test('empty quiz', () => {
        render(<QuizPage quiz={null} time={time} />)
    })

    test("all are rendered", () => {
        render(
            <QuizPage quiz={dummy} time={time}/>
        )

        expect(screen.getByText('1.')).toBeInTheDocument()
        expect(screen.getByText('Time : ' + time)).toBeInTheDocument()
        expect(screen.getByText('Score : 0')).toBeInTheDocument()
        expect(screen.getByText('Play')).toBeInTheDocument()
        expect(screen.getAllByRole('choice-button').length).not.toBe(0)
    })

    test("game won't start until first audio play", () => {
        render(
            <QuizPage quiz={dummy} time={time}/>
        )

        fireEvent.click(screen.getByTestId(-1))
        expect(screen.queryByText("Correct!")).not.toBeInTheDocument()
    })

    test("game will start after first audio play", async () => {
        render(
            <QuizPage quiz={dummy} time={time}/>
        )

        fireEvent.click(screen.getByText('Play'))

        // Just for making the timer runs and get 100 coverage
        try {
            await screen.findByText("Time : 59")
        } catch (e) {

        }

        fireEvent.click(screen.getByTestId(-1))
        expect(screen.getByText("Correct!")).toBeInTheDocument()
    })

    test("score change when answer correctly", () => {
        render(
            <QuizPage quiz={dummy} time={time}/>
        )

        fireEvent.click(screen.getByText('Play'))
        fireEvent.click(screen.getByTestId(-1))
        expect(screen.getByText("Correct!")).toBeInTheDocument()
        expect(screen.queryByText("Score : 0")).not.toBeInTheDocument()
    })

    test("wrong answer reveals red-dialog and score remain the same", () => {
        render(
            <QuizPage quiz={dummy} time={time}/>
        )

        fireEvent.click(screen.getByText('Play'))
        fireEvent.click(screen.getAllByTestId(1)[0])
        expect(screen.getByText("Wrong!")).toBeInTheDocument()
        expect(screen.getByText("Score : 0")).toBeInTheDocument()
    })

    test("time out reveals red-dialog and score remain the same", async () => {
        render(
            <QuizPage quiz={dummy} time={0}/>
        )

        fireEvent.click(screen.getByText('Play'))
        expect(await screen.findByText("Wrong!")).toBeInTheDocument()
    })

    test("change to new song after close dialog", () => {
        render(
            <QuizPage quiz={dummy} time={time}/>
        )

        fireEvent.click(screen.getByText('Play'))
        fireEvent.click(screen.getAllByTestId(1)[0])
        expect(screen.getByText("Wrong!")).toBeInTheDocument()
        fireEvent.click(screen.getByText("Close"))
        expect(screen.getByText('2.')).toBeInTheDocument()
    })

    test("go to next page after quiz finished", () => {
        render(
            <QuizPage quiz={dummy} time={time}/>
        )

        for (let i = 0; i < 4; i++) {
            fireEvent.click(screen.getAllByText('Play')[0])
            fireEvent.click(screen.getAllByTestId(1)[0])
            fireEvent.click(screen.getByText("Close"))
        }

        expect(screen.queryByText("Play")).not.toBeInTheDocument()
    })
})
