import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultDialog from '@/pages/ResultDialog';
import { Image, Song, Track } from '@/types/MockQuizObjects';
import setUpMockHTMLMediaElement from '@/__tests__/setupTest';

// Dummy data
const dib = new Image(
  'https://i.scdn.co/image/ab67616d0000b273649e31b49e38add30e78b57d',
  640,
  640
);
const dim = new Image(
  'https://i.scdn.co/image/ab67616d0000b273649e31b49e38add30e78b57d',
  300,
  300
);
const dis = new Image(
  'https://i.scdn.co/image/ab67616d0000b273649e31b49e38add30e78b57d',
  64,
  64
);
const da = [dib, dim, dis];

const dummyTrack: Track = new Track(
  new Song(
    'track 1',
    da,
    'https://p.scdn.co/mp3-preview/ec256975df2ce04185ba00f5f70a125cbcb4ae5e?cid=2847cfc683244615b79a93a6e24f375c'
  )
);
let dummyShowDialog = true;
const audio = new Audio(dummyTrack.track.preview_url);

let playing = false;

let playStub: any;
let pauseStub: any;

beforeEach(() => {
  const funcs = setUpMockHTMLMediaElement();
  playStub = funcs[0];
  pauseStub = funcs[1];
});

afterEach(() => {
  playStub.mockRestore();
  pauseStub.mockRestore();
});

test('green-dialog', () => {
  render(
    <ResultDialog
      className={'green-dialog'}
      title={'Correct!'}
      track={dummyTrack.track}
      show={true}
      onHide={() => (dummyShowDialog = false)}
      audio={audio}
    />
  );
  const dialog = screen.getByText('Correct!');
  expect(dialog).toBeInTheDocument();
});

test('red-dialog', () => {
  render(
    <ResultDialog
      className={'red-dialog'}
      title={'Wrong!'}
      track={dummyTrack.track}
      show={true}
      onHide={() => (dummyShowDialog = false)}
      audio={audio}
      volume={0.5}
      playing={playing}
      setPlaying={(bool: boolean) => (playing = bool)}
      score={0}
      addedScore={0}
    />
  );
  const dialog = screen.getByText('Wrong!');
  expect(dialog).toBeInTheDocument();
});

test('hide dialog', () => {
  render(
    <ResultDialog
      className={'green-dialog'}
      title={'Correct!'}
      track={dummyTrack.track}
      show={false}
      onHide={() => (dummyShowDialog = false)}
      audio={audio}
      volume={0.5}
      playing={playing}
      setPlaying={(bool: boolean) => (playing = bool)}
      score={0}
      addedScore={0}
    />
  );

  const dialog = screen.queryByText('Correct!');
  expect(dialog).not.toBeInTheDocument();
});
