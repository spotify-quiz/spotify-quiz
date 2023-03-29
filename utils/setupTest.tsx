import React from 'react';
import {Image, Item, Quiz, Song, Track} from "@/types/MockQuizObjects";
import {screen} from "@testing-library/react";

export function setUpMockHTMLMediaElement() {
  const playStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(() => {
      return new Promise(() => {});
    });

  const pauseStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => {});

  const loadStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'load')
    .mockImplementation(() => {});

  return [playStub, pauseStub, loadStub];
}

export function generateDummyQuiz() {
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

  return dummy;
}

export function quizPageIsRendered() {
  expect(screen.getByText('1.')).toBeInTheDocument()
  expect(screen.getByText('Score : 0')).toBeInTheDocument()
  expect(screen.getByText('Play')).toBeInTheDocument()
  expect(screen.getAllByRole('choice-button').length).not.toBe(0)
}