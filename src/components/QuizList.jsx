import { useState, useEffect } from "react";
import { db } from "../database/firebase";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    backgroundColor: "#F6F6F6",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: theme.spacing(3),
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "250px",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
  },
  button: {
    marginTop: "auto",
  },
}));

const QuizList = () => {
  const classes = useStyles();
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("List component re-render");
    db.collection("quizzes")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setQuizzes(data);
      });
  }, []);

  const startQuizHandler = (id) => {
    navigate(`/app/start/${id}`);
  };
  const deleteQuizHandler = (id) => {
    const animeDocRef = db.collection("quizzes").doc(id);

    // Delete the "anime" document
    animeDocRef
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        // Remove the deleted quiz from the quizzes state
        const updatedQuizzes = quizzes.filter(
          (quiz) => quiz.quizData[0].name !== id
        );
        setQuizzes(updatedQuizzes);
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  const editQuizHandler = (id) => {
    // NAVIGATE TO THE EDITING PAGE BRO .
    navigate(`/app/edit/${id}`);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.heading}>
        Available Quizzes
      </Typography>
      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid item key={quiz.quizData[0].name} xs={12} sm={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {quiz.quizData[0].name}
                </Typography>
                <Typography variant="h6" component="p">
                  {quiz.quizData[0].description}
                </Typography>
                <Typography variant="h6" component="p">
                  Time : {quiz.quizData[0].time} seconds
                </Typography>
                <Typography variant="h6" component="p">
                  Point : {quiz.quizData[0].points}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={() => startQuizHandler(quiz.quizData[0].name)}
                >
                  Start Quiz
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={() => editQuizHandler(quiz.quizData[0].name)}
                >
                  Edit Quiz
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteQuizHandler(quiz.quizData[0].name)}
                >
                  Delete Quiz
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default QuizList;
