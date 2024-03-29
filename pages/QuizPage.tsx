import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AudioPlayer from './AudioPlayer';
import ResultDialog from './ResultDialog';
import { Quiz, Track } from '@/types/MockQuizObjects';

import styles from '../styles/QuizPage.module.css';
import ScorePage from '@/pages/scorePage';

function getRandomInt(max) {
  const array = new Uint32Array(1);
  self.crypto.getRandomValues(array);
  return array[0] % max;
}

function randomChoices(index: number, quiz: Quiz) {
  const choices: Track[] = [];
  const randomCorrectIndex = getRandomInt(3);
  const counted = new Set([index]);

  for (let i = 0; i < 4; i++) {
    if (i === randomCorrectIndex) {
      choices.push(quiz?.tracks?.items[index]);
      continue;
    }
    let randomIndex = getRandomInt(quiz.tracks.items.length);

    while (counted.has(randomIndex)) {
      randomIndex = getRandomInt(quiz.tracks.items.length);
    }

    choices.push(quiz.tracks.items[randomIndex]);
    counted.add(randomIndex);
  }
  return { choices, randomCorrectIndex };
}

function QuizPage({
  quiz,
  timeLimit,
  numQuestions,
}: {
  quiz: Quiz;
  timeLimit: number;
  numQuestions: number;
}) {
  const initialChoices = () => {
    if (quiz?.tracks?.items) {
      return quiz.tracks.items.slice(0, 4);
    }
    return [];
  };

  // Go through playlist
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Track[]>(initialChoices);

  // Set Choice
  const [correctChoice, setCorrectChoice] = useState<number>(1);

  // Counting Score
  const [score, setScore] = useState(0);
  const [addedScore, setAddedScore] = useState(0);

  // Timer
  const [startTimer, setStartTimer] = useState(false);
  const [timer, setTimer] = useState(timeLimit);

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
    setTimer((prevTimer) => prevTimer - 1);

    if (value === correctChoice) {
      setCorrect(true);
      setShowDialog(true);
      const newScore = Math.floor(timer/timeLimit * 200);
      setAddedScore(newScore);
      setScore(score + newScore);
    } else {
      setAddedScore(0);
      setCorrect(false);
      setShowDialog(true);
    }
  };

  useEffect(() => {
    setPlaying(false);

    if (quiz && quiz.tracks && quiz.tracks.items) {
      if (!audio) {
        setAudio(new Audio(quiz.tracks.items[index].track.preview_url));
      } else {
        audio.src = quiz.tracks.items[index].track.preview_url;
        audio.load();
      }

      const random = randomChoices(index, quiz);
      setChoices(random.choices);
      setCorrectChoice(random.randomCorrectIndex);
      setTimer(timeLimit); // reset the timer
    }
  }, [index, quiz]);

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

  if (!quiz || !quiz.tracks || !quiz.tracks.items) {
    return <div>Loading...</div>;
  }

  const quizLength = quiz?.tracks?.items?.length;
  const questions = quizLength > numQuestions ? numQuestions : quizLength;

  const changeSong = () => {
    if (index === questions - 1) {
      audio?.pause();
      setDoneStatus(true);
      return;
    }

    setShowDialog(false);
    setIndex(index + 1);
  };

  return done ? (
    <ScorePage quiz={quiz} score={score} />
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
          <Row key={i}>
            <Col>
              <Button
                size="lg"
                className={`${styles.choice} w-75 rounded-5`}
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
                className={`${styles.choice} w-75 rounded-5`}
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
        className={correct ? 'greenDialog' : 'redDialog'}
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
