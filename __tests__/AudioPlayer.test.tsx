import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../utils/setupTest';
import AudioPlayer from '@/pages/AudioPlayer';
import setUpMockHTMLMediaElement from '@/utils/setupTest';

const audio = new Audio(
  'https://p.scdn.co/mp3-preview/ec256975df2ce04185ba00f5f70a125cbcb4ae5e?cid=2847cfc683244615b79a93a6e24f375c'
);

let volume = 0.5;
let playing = false;

let startTimer = 1;

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

describe('test audio player component', () => {
  function renderAndExpectPlayButtonWithProperFunctionalities() {
    render(
      <AudioPlayer
        audio={audio}
        volume={volume}
        setVolume={(value: number) => (volume = value)}
        playing={playing}
        setPlaying={(bool: boolean) => (playing = bool)}
        showVolume={false}
        setStartTimer={() => startTimer--}
      />
    );

    const button = screen.getByText('Play');
    button.click();
    expect(playing).toBe(true);
    expect(startTimer).not.toBe(1);
  }

  test('all are rendered', () => {
    render(
      <AudioPlayer
        audio={audio}
        volume={volume}
        setVolume={(value: number) => (volume = value)}
        playing={playing}
        setPlaying={(bool: boolean) => (playing = bool)}
        showVolume={true}
        setStartTimer={() => startTimer--}
      />
    );

    const button = screen.getByText('Play');
    expect(button).toBeInTheDocument();
    const slider = screen.getByAltText('volume');
    expect(slider).toBeInTheDocument();
  });

  test('hide volume bar', () => {
    render(
      <AudioPlayer
        audio={audio}
        volume={volume}
        setVolume={(value: number) => (volume = value)}
        playing={playing}
        setPlaying={(bool: boolean) => (playing = bool)}
        showVolume={false}
        setStartTimer={() => startTimer--}
      />
    );

    const slider = screen.queryByAltText('volume');
    expect(slider).not.toBeInTheDocument();
  });

  test('play/pause audio with volume bar', () => {
    render(
      <AudioPlayer
        audio={audio}
        volume={volume}
        setVolume={(value: number) => (volume = value)}
        playing={playing}
        setPlaying={(bool: boolean) => (playing = bool)}
        showVolume={true}
        setStartTimer={() => startTimer--}
      />
    );

    let button = screen.getByText('Play');
    button.click();
    expect(playing).toBe(true);
    expect(startTimer).not.toBe(1);

    render(
      <AudioPlayer
        audio={audio}
        volume={volume}
        setVolume={(value: number) => (volume = value)}
        playing={playing}
        setPlaying={(bool: boolean) => (playing = bool)}
        showVolume={true}
        setStartTimer={() => startTimer--}
      />
    );
    button = screen.getByText('Pause');
    button.click();
    expect(playing).toBe(false);

    expect(playStub).toHaveBeenCalled();
    expect(pauseStub).toHaveBeenCalled();
  });

  test('play/pause audio without volume bar', () => {
    renderAndExpectPlayButtonWithProperFunctionalities();

    render(
      <AudioPlayer
        audio={audio}
        volume={volume}
        setVolume={(value: number) => (volume = value)}
        playing={playing}
        setPlaying={(bool: boolean) => (playing = bool)}
        showVolume={false}
        setStartTimer={() => startTimer--}
      />
    );
    const button = screen.getByText('Pause');
    button.click();
    expect(playing).toBe(false);
    expect(playStub).toHaveBeenCalled();
    expect(pauseStub).toHaveBeenCalled();
  });

  test('audio ended', () => {
    renderAndExpectPlayButtonWithProperFunctionalities();

    fireEvent(audio, new Event('ended'));

    expect(playing).toBe(false);
  });

  test('adjust volume', () => {
    render(
      <AudioPlayer
        audio={audio}
        volume={volume}
        setVolume={(value: number) => (volume = value)}
        playing={playing}
        setPlaying={(bool: boolean) => (playing = bool)}
        showVolume={true}
        setStartTimer={() => startTimer--}
      />
    );

    const slider = screen.getByTestId('slider');
    expect(volume).toBe(0.5);
    fireEvent.change(slider, { target: { value: 0.1 } });
    expect(volume).toBe('0.1');
  });
});
