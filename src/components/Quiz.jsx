import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true); // State to track loading
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false); // To track if quiz is completed
  const [submitting, setSubmitting] = useState(false); // State to track the submit process
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Goes one step back in the history
  };

  useEffect(() => {
    const fetchQuizStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized access. Please log in.");
        setLoading(false);
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
          await fetchQuestions(); // Only fetch questions if the quiz is not completed
        }
      } catch (err) {
        console.error("Error fetching quiz status:", err);
        setError("Failed to fetch quiz status. Please try again.");
      } finally {
        setLoading(false); // Stop loading once the status is checked
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

    setSubmitting(true); // Start submitting

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
    } finally {
      setSubmitting(false); // Stop submitting
    }
  };

  if (loading) {
    return (
      <div className="loading-message">
        <h2>Loading...</h2>
        <p>Please wait while we fetch the quiz for you.</p>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="thank-you-message">
        <h1>Thank You!</h1>
        <p>You have completed the quiz.</p>
        <p>
          Your score: {score}/{questions.length}{" "}
          {/* Dynamic score calculation */}
        </p>
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
        {questions.map((question, index) => (
          <div key={question.id} className="quiz-question">
            <h3 className="question-text">
              {index + 1}. {question.question}
            </h3>
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
        <button
          type="button"
          onClick={handleSubmit}
          className="submit-button"
          disabled={submitting} // Disable the button during submission
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </form>
    </div>
  );
};

export default Quiz;
