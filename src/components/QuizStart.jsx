import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../database/firebase";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(6),
    padding: theme.spacing(3),
    textAlign: "center",
    backgroundColor: "#FFD580",
  },
  questionSection: {
    marginBottom: theme.spacing(4),
  },
  questionCount: {
    marginBottom: theme.spacing(2),
  },
  questionText: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  answerSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  answerOption: {
    margin: theme.spacing(1),
  },
  scoreSection: {
    marginBottom: theme.spacing(2),
  },
}));

const QuizStart = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(1);
  const [time, setTime] = useState(10);
  const { quizid } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const quizDocRef = db.collection("quizzes").doc(quizid);

    quizDocRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const quizData = doc.data();

          // title description time points in quizData.quizData[0]
          const gamePoints = quizData.quizData[0].points;
          setPoints(gamePoints);
          setTime(quizData.quizData[0].time);
          const questionsData = quizData.quizData[1].questions;
          setQuestions(questionsData);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [quizid]);

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [time]);

  useEffect(() => {
    if (time === 0) {
      setShowScore(true);
    }
  }, [time]);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setTime(0);
      setShowScore(true);
    }
  };

  return (
    <Card className={classes.root}>
      <Typography variant="h5" component="h1">
        Timer: {time}
      </Typography>
      {!showScore ? (
        <>
          <CardContent className={classes.questionSection}>
            <Typography
              variant="h6"
              component="h2"
              className={classes.questionCount}
            >
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.questionText}
            >
              {questions[currentQuestion]?.questionText}
            </Typography>
          </CardContent>
          <CardActions className={classes.answerSection}>
            {questions[currentQuestion]?.answerOptions.map(
              (answerOption, index) => (
                <Button
                  key={index}
                  variant="contained"
                  color="primary"
                  className={classes.answerOption}
                  onClick={() =>
                    handleAnswerOptionClick(answerOption.isCorrect)
                  }
                >
                  {answerOption.answerText}
                </Button>
              )
            )}
          </CardActions>
        </>
      ) : (
        <>
          <CardContent>
            <Typography
              variant="h6"
              component="h2"
              className={classes.scoreSection}
            >
              You answered {score} out of {questions.length} correctly
            </Typography>
            <Typography variant="body1" component="p">
              You scored {score * points} out of {questions.length * points}{" "}
              points
            </Typography>
          </CardContent>
        </>
      )}
      <Button onClick={() => navigate("/app")} variant="contained">
        Go Home
      </Button>
    </Card>
  );
};

export default QuizStart;
