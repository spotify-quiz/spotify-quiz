import React from 'react';
import {render, screen,} from '@testing-library/react';
import '@testing-library/jest-dom'
import ResultDialog from "@/pages/ResultDialog";
import {setUpMockHTMLMediaElement, generateDummyQuiz} from "@/utils/setupTest";

// Dummy data
const dummy = generateDummyQuiz();
const dummyTrack = dummy.tracks.items[0]

let dummyShowDialog = true
const audio = new Audio(dummyTrack.track.preview_url)

let playing = false

let playStub: any;
let pauseStub: any;

beforeEach(() => {
    const funcs = setUpMockHTMLMediaElement()
    playStub = funcs[0]
    pauseStub = funcs[1]
})

afterEach(() => {
    playStub.mockRestore()
    pauseStub.mockRestore()
})

describe('test result dialog', () => {

    test('green-dialog', () => {
        render(<ResultDialog className={"greenDialog"}
                             title={"Correct!"}
                             track={dummyTrack.track}
                             show={true}
                             onHide={() => dummyShowDialog = false}
                             audio={audio}
        />)
        const dialog = screen.getByText('Correct!');
        expect(dialog).toBeInTheDocument();
    });

    test('red-dialog', () => {
        render(<ResultDialog className={"redDialog"}
                             title={"Wrong!"}
                             track={dummyTrack.track}
                             show={true}
                             onHide={() => dummyShowDialog = false}
                             audio={audio}
                             volume={0.5}
                             playing={playing}
                             setPlaying={(bool: boolean) => playing = bool}
                             score={0}
                             addedScore={0}
        />)
        const dialog = screen.getByText('Wrong!');
        expect(dialog).toBeInTheDocument();
    });

    test('hide dialog', () => {
        render(<ResultDialog className={"greenDialog"}
                             title={"Correct!"}
                             track={dummyTrack.track}
                             show={false}
                             onHide={() => dummyShowDialog = false}
                             audio={audio}
                             volume={0.5}
                             playing={playing}
                             setPlaying={(bool: boolean) => playing = bool}
                             score={0}
                             addedScore={0}
        />)

        const dialog = screen.queryByText('Correct!');
        expect(dialog).not.toBeInTheDocument();
    });
})
