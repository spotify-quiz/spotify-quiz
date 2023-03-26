import React from 'react';

export default function setUpMockHTMLMediaElement() {
    const playStub = jest
        .spyOn(window.HTMLMediaElement.prototype, 'play')
        .mockImplementation(() => {return new Promise(() => {})})

    const pauseStub = jest
        .spyOn(window.HTMLMediaElement.prototype, 'pause')
        .mockImplementation(() => {})

    const loadStub = jest
        .spyOn(window.HTMLMediaElement.prototype, 'load')
        .mockImplementation(() => {})

    return [playStub, pauseStub, loadStub]
}