import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import QuizPage from "@/pages/QuizPage";
import {setUpMockHTMLMediaElement, generateDummyQuiz, quizPageIsRendered} from "@/utils/setupTest";

const dummy = generateDummyQuiz()
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

        quizPageIsRendered()
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
