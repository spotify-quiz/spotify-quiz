import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AudioPlayer from './AudioPlayer';
import ResultDialog from './ResultDialog';
import { Quiz, Track } from '../types/MockQuizObjects';

function randomChoices(index: number, quiz: Quiz) {
  const choices: Track[] = [];
  const randomCorrectIndex = Math.floor(Math.random() * 3);
  const counted = new Set([index]);

  for (let i = 0; i < 4; i++) {
    if (i === randomCorrectIndex) {
      choices.push(quiz?.tracks?.items[index]);
      continue;
    }
    let randomIndex = Math.floor(Math.random() * quiz.tracks.items.length); //NO SONAR
    while (counted.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * quiz.tracks.items.length); //NO SONAR
    }

    choices.push(quiz.tracks.items[randomIndex]);
    counted.add(randomIndex);
  }
  return { choices, randomCorrectIndex };
}

function QuizPage({ quiz, time }: { quiz: Quiz; time: number }) {
  if (!quiz || !quiz.tracks || !quiz.tracks.items) {
    return <div>Loading...</div>;
  }
  const questions = quiz?.tracks?.items?.length || 0;

  // Go through playlist
  const [index, setIndex] = useState(0);

  const initialChoices = () => {
    if (quiz?.tracks?.items) {
      return quiz.tracks.items.slice(0, 4);
    }
    return [];
  };
  const [choices, setChoices] = useState<Track[]>(initialChoices);
  const [correctChoice, setCorrectChoice] = useState<number>(1);
  // Set Choice

  // Counting Score
  const [score, setScore] = useState(0);
  const [addedScore, setAddedScore] = useState(0);

  // Timer
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(time);

  // For controlling audio
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5);

  // Result Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [correct, setCorrect] = useState(false);

  // Exit this page
  const [done, setDoneStatus] = useState(false);

  const reviewAnswer = (value: number) => {
    if (!startTimer) {
      return;
    }

    audio?.load();
    setPlaying(false);
    setStartTimer(false);
    setTimer(time);

    if (value === correctChoice) {
      setCorrect(true);
      setShowDialog(true);
      const newScore = timer * 5;
      setAddedScore(newScore);
      setScore(score + newScore);
    } else {
      setAddedScore(0);
      setCorrect(false);
      setShowDialog(true);
    }
  };

  const changeSong = () => {
    if (index === questions - 1) {
      audio?.pause();
      setDoneStatus(true);
      return;
    }

    setShowDialog(false);
    setIndex(index + 1);
  };

  useEffect(() => {
    setPlaying(false);

    if (!audio) {
      setAudio(new Audio(quiz.tracks.items[index].track.preview_url));
    } else {
      audio.src = quiz.tracks.items[index].track.preview_url;
      audio.load();
    }

    const random = randomChoices(index, quiz);
    setChoices(random.choices);
    setCorrectChoice(random.randomCorrectIndex);
  }, [index]);

  useEffect(() => {
    let interval: any;

    if (startTimer) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }

    if (timer === 0) {
      reviewAnswer(-1);
    }

    return () => clearInterval(interval);
  }, [startTimer, timer]);

  return done ? (
    <>
      <p>Thanks for playing</p>
      <p>You got {score} scores</p>
    </>
  ) : (
    <div className="QuizPage">
      <Container fluid className="d-grid gap-4">
        <Row className="justify-content-center mt-5">
          <Col className="d-flex flex-column justify-content-center">
            <h1>
              <b>{index + 1}.</b>
            </h1>
          </Col>
          <Col className="d-flex flex-column justify-content-center">
            <h2>Time : {timer}</h2>
          </Col>
          <Col className="d-flex flex-column justify-content-center">
            <h2>Score : {score}</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <img
            src="https://whisperify.net/assets/soundwave-white.svg"
            style={{ height: 300, width: 400 }}
            alt="logo"
          />
        </Row>
        <Row className="mb-4 justify-content-center">
          <AudioPlayer
            audio={audio}
            volume={volume}
            setVolume={setVolume}
            playing={playing}
            setPlaying={setPlaying}
            showVolume={true}
            setStartTimer={setStartTimer}
          />
        </Row>
        {[0, 2].map((i) => (
          <Row>
            <Col>
              <Button
                size="lg"
                className="choice w-75 rounded-5"
                role="choice-button"
                data-testid={i === correctChoice ? -1 : 1}
                onClick={() => reviewAnswer(i)}
              >
                <b>
                  {choices[i].track.artist} - {choices[i].track.name}
                </b>
              </Button>
            </Col>
            <Col>
              <Button
                size="lg"
                className="choice w-75 rounded-5"
                role="choice-button"
                data-testid={i + 1 === correctChoice ? -1 : 1}
                onClick={() => reviewAnswer(i + 1)}
              >
                <b>
                  {choices[i + 1].track.artist} - {choices[i + 1].track.name}
                </b>
              </Button>
            </Col>
          </Row>
        ))}
      </Container>

      <ResultDialog
        className={correct ? 'green-dialog' : 'red-dialog'}
        title={correct ? 'Correct!' : 'Wrong!'}
        track={quiz.tracks.items[index].track}
        show={showDialog}
        onHide={() => changeSong()}
        audio={audio}
        volume={volume}
        playing={playing}
        setPlaying={setPlaying}
        score={score}
        addedScore={addedScore}
      />
    </div>
  );
}

export default QuizPage;
