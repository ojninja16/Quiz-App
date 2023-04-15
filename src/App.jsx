import React from "react";
import QuizList from "./components/QuizList";
import { useNavigate } from "react-router-dom";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./components/Login";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "linear-gradient(60deg,#FF8E53 90%, #FF9B7B 90%)",
    borderBottom: "2px solid black",
  },
  title: {
    marginBottom: theme.spacing(5),
    fontSize: "48px",
    fontWeight: "bold",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    color: "#333",
    textTransform: "uppercase",
  },
  createQuizButton: {
    marginBottom: theme.spacing(5),
    backgroundColor:"#9c41a8",
    color: "#fff",
    fontSize: "20px",
    padding: "12px 24px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "#4c47a8",
    },
  },
  quizList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    "& > *": {
      backgroundColor: "#f06292",
      borderRadius: "4px",
      padding: "24px",
      margin: "12px",
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
      border: "1px solid #d3d3d3",
    },
  },
}));

function CreateQuizButton() {
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <Button
      className={classes.createQuizButton}
      variant="contained"
      color="secondary"
      onClick={() => navigate(`/app/creation`)}
    >
      Create a Quiz
    </Button>
  );
}

function App() {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="lg" >
            <Typography className={classes.title} variant="h3">
        QUIZZ
      </Typography>
      <CreateQuizButton />
      <Grid container spacing={1} className={classes.quizList}>
        <QuizList />
      </Grid>
    </Container>
  );
}

export default App;
