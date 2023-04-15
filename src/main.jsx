import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import QuizStart from "./components/QuizStart";
import QuizCreator from "./components/QuizCreator";
import EditQuiz from "./components/EditQuiz";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/app" />} />
        <Route path="/app" element={<App />} />
        <Route path="/app/creation" element={<QuizCreator />} />
        <Route path="/app/start/:quizid" element={<QuizStart />} />
        <Route path="/app/edit/:quizid" element={<EditQuiz />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
