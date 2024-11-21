import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TeacherDashboard from "./components/TeacherDashboard";
import Quiz from "./components/Quiz";
import ThankYou from "./components/ThankYou";
import ViewAllQuestions from "./components/ViewAllQuestions";
import StudentPerformance from "./components/StudentPerformance";
import Homepage from "./components/HomePage";

const App = () => {
  return (
    <Router>
      <div className="App">
        <h1>Quiz App</h1>
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* Routes for login and registration */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected route for teachers */}
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

          {/* Route for quiz */}
          <Route path="/quiz" element={<Quiz />} />

          {/* Route for viewing all quiz */}
          <Route path="/view-all-questions" element={<ViewAllQuestions />} />

          <Route path="/student-performance" element={<StudentPerformance />} />

          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
