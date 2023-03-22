import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function AudioPlayer({audio, volume, setVolume, playing, setPlaying, showVolume, setStartTimer}:
                         { audio: HTMLAudioElement, volume: number, setVolume: any, showVolume: boolean, playing: boolean, setPlaying: any, setStartTimer: any }) {
    const [thisVolume, setThisVolume] = useState(volume);

    const togglePlay = () => {
        setPlaying(!playing)
        setStartTimer(true)
    }

    const handleVolumeChange = (event: any) => {
        const newVolume = event.target.value;
        audio.volume = newVolume;
        setVolume(newVolume);
        setThisVolume(newVolume)
    };

    useEffect(() => {
        if (audio) {
            audio.addEventListener('ended', () => setPlaying(false));
            return () => {
                audio.removeEventListener('ended', () => setPlaying(false));
            }
        }
    }, [audio]);


    useEffect(() => {
            if (audio) {
                playing ? audio.play() : audio.pause();
            }
        },
        [playing]
    );

    return !showVolume ? (
        <Button variant="light" size="lg"
                className="dialog-button w-50 rounded-5"
                onClick={togglePlay}>
            <b>{playing ? 'Pause' : 'Play'}</b>
        </Button>
    ) : (
        <div>
            <Container>
                <Row className="justify-content-center mb3">
                    <Button variant="secondary" size="lg" style={{height: 50, width: 175}}
                            className="rounded-5"
                            onClick={togglePlay}>
                        <b>{playing ? 'Pause' : 'Play'}</b>
                    </Button>
                </Row>
                <Row className="justify-content-center">
                    <Col xs sm="auto" className="pt-1">
                        <img src="https://img.icons8.com/ios11/600w/FFFFFF/medium-volume.png"
                             style={{height: 35, width: 35}} alt="volume"/>
                    </Col>
                    <Col xs sm="auto" className="p-0">
                        <input
                            data-testid="slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={thisVolume}
                            onChange={handleVolumeChange}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AudioPlayer;
