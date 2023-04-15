import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { db } from "../database/firebase";
import "./QuizCreator.css";

const QuizCreator = () => {
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizPoints, setQuizPoints] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerOptions, setAnswerOptions] = useState([
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
  ]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const handleAnswerOptionChange = (event, index) => {
    const newAnswerOptions = [...answerOptions];
    newAnswerOptions[index].answerText = event.target.value;
    setAnswerOptions(newAnswerOptions);
  };

  const handleCorrectAnswerChange = (event, index) => {
    const newAnswerOptions = [...answerOptions];
    newAnswerOptions.forEach((option, i) => {
      newAnswerOptions[i].isCorrect = i === index;
    });
    setAnswerOptions(newAnswerOptions);
    setSelectedAnswerIndex(index);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      questionText,
      answerOptions,
    };
    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setAnswerOptions([
      { answerText: "", isCorrect: false },
      { answerText: "", isCorrect: false },
      { answerText: "", isCorrect: false },
      { answerText: "", isCorrect: false },
    ]);
    setSelectedAnswerIndex(null);
  };

  const handleQuizSubmit = () => {
    // adding the quiz to the database
    const quizRef = db.collection("quizzes").doc(quizName);

    const quizData = [];
    quizData.push({
      name: quizName,
      description: quizDescription,
      points: quizPoints,
      time: quizTime,
    });
    quizData.push({
      questions: questions,
    });
    quizRef
      .set({ quizData })
      .then(() => {
        console.log("Quiz added to Firestore");
      })
      .catch((error) => {
        console.error("Error adding questions to Firestore: ", error);
      });

    // navigate to the root

    navigate(`/app`);
  };

  const isAddQuestionButtonDisabled =
    !questionText ||
    !answerOptions.every((option) => option.answerText !== "") ||
    selectedAnswerIndex === null;

  const isSubmitButtonDisabled =
    !quizName ||
    !quizDescription ||
    !quizPoints ||
    !quizTime ||
    questions.length === 0;

  console.log("Creating Quiz Component");

  return (
    <Grid container direction="column" spacing={2} className="QuizCreator">
      <Grid item>
        <Typography variant="h5">Create Quiz</Typography>
      </Grid>
      <Grid item>
        <TextField
          label="Quiz Name"
          variant="outlined"
          fullWidth
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Quiz Description"
          variant="outlined"
          fullWidth
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Quiz Points"
          variant="outlined"
          fullWidth
          type="number"
          value={quizPoints}
          onChange={(e) => setQuizPoints(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Quiz Time (in Seconds)"
          variant="outlined"
          fullWidth
          type="number"
          value={quizTime}
          onChange={(e) => setQuizTime(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Typography variant="h6">Questions</Typography>
      </Grid>
      {questions.map((question, index) => (
        <Grid item key={index}>
          <Typography>{question.questionText}</Typography>
          {question.answerOptions.map((option, optionIndex) => (
            <FormControlLabel
              key={optionIndex}
              control={<Checkbox checked={option.isCorrect} disabled />}
              label={option.answerText}
            />
          ))}
        </Grid>
      ))}
      <Grid item>
        <TextField
          label="Question Text"
          variant="outlined"
          fullWidth
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </Grid>
      {answerOptions.map((option, index) => (
        <Grid item key={index}>
          <TextField
            label={`Answer ${index + 1}`}
            variant="outlined"
            fullWidth
            value={option.answerText}
            onChange={(e) => handleAnswerOptionChange(e, index)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedAnswerIndex === index}
                onChange={(e) => handleCorrectAnswerChange(e, index)}
              />
            }
            label="Correct Answer"
          />
        </Grid>
      ))}
      <Grid item container justifyContent="space-between">
        <Button
          variant="contained"
          disabled={isAddQuestionButtonDisabled}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isSubmitButtonDisabled}
          onClick={handleQuizSubmit}
        >
          Submit Quiz
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/app")}
        >
          Go Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default QuizCreator;
