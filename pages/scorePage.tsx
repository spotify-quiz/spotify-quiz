import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Quiz} from "@/types/MockQuizObjects";

import styles from "../styles/ScorePage.module.css";
import QuizPage from "@/pages/QuizPage";
import shuffle from "@/utils/shuffleSong";
import {useRouter} from "next/router";

function ScorePage({quiz, score}: { quiz: Quiz, score: number }) {
    const [playAgain, setPlayAgain] = useState(false);

    const router = useRouter();

    function redirect() {
        router.push('/select-playlist?isGuest=true')
    }

    // shuffle Songs
    if (quiz) {
        quiz.tracks.items = shuffle(quiz.tracks.items)
    }

    return playAgain ?
        <QuizPage quiz={quiz} time={30}/> :
        <Container className={`${styles.scorePage} flex-column`}>
            <Row className="w-75 mb-5 text-center">
                <h1 style={{fontSize: 60}}>Thank you for playing!</h1>
            </Row>
            <Row className="w-75 mt-5">
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <img
                        src={quiz?.image.url}
                        style={{height: 300, width: 300}}
                        alt="playlist-image"
                        role='image'
                    />
                </Col>
                <Col className="d-flex flex-column justify-content-center align-items-center">
                    <h2 style={{fontSize: 60}}>Your Score</h2>
                    <h2 className="mb-5" style={{fontSize: 50}}>{score}</h2>
                    <Button
                        size="lg"
                        className={`${styles.play} w-75 rounded-5 mb-3`}
                        onClick={() => {
                            setPlayAgain(true)
                        }}
                    >
                        <b>Play Again</b>
                    </Button>
                    <Button
                        size="lg"
                        className={`${styles.home} w-75 rounded-5 mb-3`}
                        onClick={redirect}
                    >
                        <b>Return Home</b>
                    </Button>
                </Col>
            </Row>
        </Container>
}

export default ScorePage