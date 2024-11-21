import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false); // To track if quiz is completed
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Goes one step back in the history
  };

  useEffect(() => {
    const fetchQuizStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized access. Please log in.");
        return;
      }

      try {
        // Check if the user has already completed the quiz by fetching their status
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/quiz/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.quizCompleted) {
          setQuizCompleted(true); // Set quizCompleted to true if the user already took the quiz
        } else {
          fetchQuestions(); // Only fetch questions if the quiz is not completed
        }
      } catch (err) {
        console.error("Error fetching quiz status:", err);
        setError("Failed to fetch quiz status. Please try again.");
      }
    };

    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/quiz/questions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestions(response.data);
      } catch (err) {
        console.error("Error fetching quiz questions:", err);
        setError("Failed to fetch quiz questions. Please try again.");
      }
    };

    fetchQuizStatus(); // Check if the user has already taken the quiz
  }, []);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        questionId: parseInt(questionId),
        selectedOption,
      })
    );

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id"); // Assuming you stored the user ID in localStorage during login

    try {
      // Submit the answers to calculate score
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/quiz/submit`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(response.data.score);
      setQuizCompleted(true);

      // After submitting the quiz, update the quiz completion status
      await axios.post(
        `${process.env.REACT_APP_API_URL}/quiz/complete`,
        { userId }, // Pass the user ID to mark quiz as complete
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit the quiz. Please try again.");
    }
  };

  if (quizCompleted) {
    return (
      <div className="thank-you-message">
        <h1>Thank You!</h1>
        <p>You have completed the quiz.</p>
        <p>Your score: {score}/5</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <button onClick={goBack}>Back</button>
      <h1 className="quiz-title">Quiz</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {questions.map((question) => (
          <div key={question.id} className="quiz-question">
            <h3 className="question-text">{question.question}</h3>
            <div className="options-container">
              {["a", "b", "c", "d"].map((option) => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    onChange={() => handleOptionChange(question.id, option)}
                    checked={answers[question.id] === option}
                    className="option-input"
                  />
                  {question[`option_${option}`]}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={handleSubmit} className="submit-button">
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default Quiz;
