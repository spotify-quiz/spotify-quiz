import React from 'react';
import {generateDummyQuiz, quizPageIsRendered} from "@/utils/setupTest";
import {fireEvent, render, screen} from "@testing-library/react";
import ScorePage from "@/pages/scorePage";
import {useRouter} from "next/router";

const dummy = generateDummyQuiz(4)

jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

const redirect = jest.fn()

describe('test score page', () => {
    test('all rendered', () => {
        render(<ScorePage quiz={dummy} score={10} />)

        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('Play Again')).toBeInTheDocument()
        expect(screen.getByText('Return Home')).toBeInTheDocument()
        expect(screen.getByText('Thank you for playing!')).toBeInTheDocument()
        expect(screen.getByRole('image')).toBeInTheDocument()
    })

    test('play again works and render quiz page', () => {
        render(<ScorePage quiz={dummy} score={10} />)

        const playAgainButton = screen.getByText('Play Again')
        fireEvent.click(playAgainButton)

        quizPageIsRendered()
    })

    test('redirect works', () => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            push: redirect,
        }));

        render(<ScorePage quiz={dummy} score={10} />)

        const returnButton = screen.getByText('Return Home')
        fireEvent.click(returnButton)

        expect(redirect).toHaveBeenCalled()
    })
})