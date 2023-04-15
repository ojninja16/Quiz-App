import React, { useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Card,
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../database/firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "10px",
    padding: "0",
    border: "4px solid",
  },
  heading: {
    color: "",
    marginBottom: theme.spacing(3),
  },
  card: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
    justifyContent: "space-between",
    minHeight: "250px",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    margin: "10px 10px 10px 10px",
    backgroundColor: "#F5F5F5",
  },
  card2: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
    marginLeft: "420px",
    minHeight: "250px",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#d6c675",
    border: "5px solid",
    margin: "10px 10px 10px 10px",
  },
  button: {
    marginTop: "auto",
  },
}));

const QuizComponent = () => {
  const classes = useStyles();
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [quizPoints, setQuizPoints] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      answerOptions: [
        { answerText: "", isCorrect: false },
        { answerText: "", isCorrect: false },
        { answerText: "", isCorrect: false },
        { answerText: "", isCorrect: false },
      ],
    },
  ]);
  const [questionText, setQuestionText] = useState("");
  const [answerOptions, setAnswerOptions] = useState([
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
  ]);

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const { quizid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const quizDocRef = db.collection("quizzes").doc(quizid);

    quizDocRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const quizData = doc.data();

          // title description time points in quizData.quizData[0]
          setQuizName(quizData.quizData[0].name);
          setQuizDescription(quizData.quizData[0].description);
          setQuizTime(quizData.quizData[0].time);
          setQuizPoints(quizData.quizData[0].points);
          const questionsData = quizData.quizData[1].questions;
          setQuestions(questionsData);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  const submitHandler = () => {
    console.log(questions);

    // DELETE PREVIOUS DATA
    const animeDocRef = db.collection("quizzes").doc(quizid);
    animeDocRef
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });

    // ADD THE NEW ONE

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
        console.log("Quiz Updated in Database");
      })
      .catch((error) => {
        console.error("Error adding questions to Firestore: ", error);
      });

    navigate("/app");
  };

  const handleQuizDescriptionChange = (event) => {
    setQuizDescription(event.target.value);
  };

  const handleQuizTimeChange = (event) => {
    setQuizTime(event.target.value);
  };

  const handleQuizPointsChange = (event) => {
    setQuizPoints(event.target.value);
  };

  const handleQuestionTextChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerTextChange = (questionIndex, answerIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answerOptions[answerIndex].answerText =
      event.target.value;
    setQuestions(newQuestions);
  };

  const handleIsCorrectChange = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    const answerOptions = newQuestions[questionIndex].answerOptions;

    // loop through all answer options in the same question
    answerOptions.forEach((option, index) => {
      if (index === answerIndex) {
        // set the clicked option to true
        option.isCorrect = true;
      } else {
        // set all other options to false
        option.isCorrect = false;
      }
    });

    // update the questions state
    setQuestions(newQuestions);
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

  const deleteQuestionHalder = (index) => {
    const filteredQuestions = questions.filter((_, ind) => ind !== index);
    setQuestions(filteredQuestions);
  };

  console.log("Edit page re-render");

  const isAddQuestionButtonDisabled =
    !questionText ||
    !answerOptions.every((option) => option.answerText !== "") ||
    selectedAnswerIndex === null;

  return (
    <div className={classes.root}>
      <Card className={classes.card2}>
        <TextField label="Quiz Name" value={quizName} />
        <br />
        <TextField
          label="Quiz Description"
          value={quizDescription}
          onChange={handleQuizDescriptionChange}
        />
        <br />
        <TextField
          label="Quiz Time"
          value={quizTime}
          onChange={handleQuizTimeChange}
        />
        <br />
        <TextField
          label="Quiz Points"
          value={quizPoints}
          onChange={handleQuizPointsChange}
        />
      </Card>
      <br />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {questions.map((question, questionIndex) => (
          <Card className={classes.card} key={questionIndex}>
            <TextField
              label={`Question ${questionIndex + 1}`}
              value={question.questionText}
              onChange={(event) =>
                handleQuestionTextChange(questionIndex, event)
              }
            />
            <br />
            {question.answerOptions.map((answerOption, answerIndex) => (
              <div key={answerIndex}>
                <TextField
                  label={`Answer ${answerIndex + 1}`}
                  value={answerOption.answerText}
                  onChange={(event) =>
                    handleAnswerTextChange(questionIndex, answerIndex, event)
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={answerOption.isCorrect}
                      onChange={() =>
                        handleIsCorrectChange(questionIndex, answerIndex)
                      }
                    />
                  }
                  label="Correct"
                />
              </div>
            ))}
            <Button
              type="contained"
              color="secondary"
              onClick={() => deleteQuestionHalder(questionIndex)}
            >
              Delete Question
            </Button>
          </Card>
        ))}
      </div>
      <h1 className={classes.heading}>U can also add a question below :</h1>
      <Grid>
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
        <Button
          variant="contained"
          disabled={isAddQuestionButtonDisabled}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={submitHandler}
        style={{ marginLeft: "600px" }}
      >
        Confirm Changes
      </Button>
    </div>
  );
};

export default QuizComponent;
