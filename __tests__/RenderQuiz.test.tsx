import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import mockRouter from "next-router-mock";
import RenderQuiz from "@/pages/renderQuiz";
import axios, {AxiosResponse} from "axios";
import {generateDummyPlaylistResponse, generateDummyQuiz, quizPageIsRendered} from "@/utils/setupTest";

const mockPlaylistId = '123'
const mockAccessToken = 'access'
const mockTimeLimit = 10
const mockNumQuestions = 10

const dummyPlaylist = generateDummyPlaylistResponse(10)
jest.mock('next/router', () => require('next-router-mock'));

jest.mock('axios');
let axiosGetMock

beforeEach(() => {
    axiosGetMock = jest.spyOn(axios, 'get').mockResolvedValue({
        data: {
            name: 'mockQuiz',
            tracks: dummyPlaylist,
            images: [
                {
                    url: '',
                    width: 50,
                    height: 50
                }
            ],
        }
    });
})

afterEach(() => {
    axiosGetMock.mockRestore()
})

describe('Render Quiz', () => {
    test('empty playlist', () => {
        render(<RenderQuiz accessToken={mockAccessToken} timeLimit={mockTimeLimit} numQuestions={mockNumQuestions}/>)

        expect(axiosGetMock).not.toHaveBeenCalled()
    })

    test('with access token', async () => {
        mockRouter.query.playlistId = mockPlaylistId;
        render(<RenderQuiz accessToken={mockAccessToken} timeLimit={mockTimeLimit} numQuestions={mockNumQuestions}/>)

        await waitFor(() => {
            expect(axiosGetMock).toHaveBeenCalled()
        })

        // quizPageIsRendered()
    })

    test('without access token', async () => {
        mockRouter.query.playlistId = mockPlaylistId;

        const mRes = {
            data: {
                access_token: 'token'
            }
        }
        const maxios = axios as jest.MockedFunction<typeof axios>
        maxios.mockResolvedValueOnce(mRes)

        render(<RenderQuiz accessToken={null} timeLimit={mockTimeLimit} numQuestions={mockNumQuestions}/>)

        await waitFor(() => {
            expect(maxios).toHaveBeenCalled()
            expect(axiosGetMock).toHaveBeenCalled()
        })

        await quizPageIsRendered()
    })

    test('axios err', async () => {
        jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('error'))
        const consoleErr = jest.spyOn(console, 'error').mockImplementation(() => {
        })
        mockRouter.query.playlistId = mockPlaylistId;
        render(<RenderQuiz accessToken={mockAccessToken} timeLimit={mockTimeLimit} numQuestions={mockNumQuestions}/>)

        await waitFor(() => {
            expect(consoleErr).toHaveBeenCalled()
        })
    })

})