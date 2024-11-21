import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// TeacherDashboard Component
const TeacherDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
  });
  const [correctOption, setCorrectOption] = useState("");
  const [error, setError] = useState(null); // <-- Declare the error state
  const [success, setSuccess] = useState(null); // <-- Declare the success state
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Goes one step back in the history
  };

  // Handle new question input
  const handleQuestionChange = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  const handleCorrectOptionChange = (e) => {
    setCorrectOption(e.target.value);
  };

  const handleAddQuestion = async () => {
    // Check if all fields are filled
    if (
      newQuestion.trim() &&
      options.A.trim() &&
      options.B.trim() &&
      options.C.trim() &&
      options.D.trim() &&
      correctOption.trim()
    ) {
      // Validate correct option
      if (!["a", "b", "c", "d"].includes(correctOption)) {
        setError("Correct option must be one of A, B, C, or D.");
        setSuccess(null);
        setTimeout(() => setError(null), 2000); // Clear error message after 2 seconds
        return;
      }

      try {
        // Fetch `token` and `teacherId` from localStorage
        const token = localStorage.getItem("token");
        const teacherId = localStorage.getItem("id"); // Retrieve the user id
        console.log("Teacher ID:", teacherId);

        // Validate authentication data
        if (!token || !teacherId) {
          setError("Authentication error. Please log in again.");
          setSuccess(null);
          setTimeout(() => setError(null), 2000); // Clear error message after 2 seconds
          return;
        }

        // Make API call
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/add-question`,
          {
            question: newQuestion,
            option_a: options.A,
            option_b: options.B,
            option_c: options.C,
            option_d: options.D,
            correct_option: correctOption,
            teacher_id: teacherId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update state on success
        setQuestions([...questions, response.data.question]);
        setNewQuestion("");
        setOptions({
          A: "",
          B: "",
          C: "",
          D: "",
        });
        setCorrectOption("");
        setError(null);
        setSuccess("Question added successfully!");
        setTimeout(() => setSuccess(null), 2000); // Clear success message after 2 seconds
      } catch (err) {
        // Handle API errors
        console.error("Error adding question:", err);
        setError(
          "Error adding question: " + (err.response?.data?.error || err.message)
        );
        setSuccess(null);
        setTimeout(() => setError(null), 2000); // Clear error message after 2 seconds
      }
    } else {
      // Handle validation errors
      setError("All fields are required.");
      setSuccess(null);
      setTimeout(() => setError(null), 2000); // Clear error message after 2 seconds
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard-content">
        <div className="teacher-header">
          <h2>Welcome, Teacher!</h2>
        </div>
        <button onClick={goBack}>Back</button>

        {/* Draft Question Section */}
        <div className="teacher-questions" id="questions">
          <h3>Draft a New Question</h3>
          <textarea
            value={newQuestion}
            onChange={handleQuestionChange}
            placeholder="Enter your question here..."
            rows="5"
          />
          <div className="option-container">
            <label>Option A:</label>
            <input
              type="text"
              name="A"
              value={options.A}
              onChange={handleOptionChange}
              placeholder="Enter option A"
            />
          </div>
          <div>
            <label>Option B:</label>
            <input
              type="text"
              name="B"
              value={options.B}
              onChange={handleOptionChange}
              placeholder="Enter option B"
            />
          </div>
          <div>
            <label>Option C:</label>
            <input
              type="text"
              name="C"
              value={options.C}
              onChange={handleOptionChange}
              placeholder="Enter option C"
            />
          </div>
          <div>
            <label>Option D:</label>
            <input
              type="text"
              name="D"
              value={options.D}
              onChange={handleOptionChange}
              placeholder="Enter option D"
            />
          </div>
          <div>
            <label>Correct Option:</label>
            <input
              type="text"
              value={correctOption}
              onChange={handleCorrectOptionChange}
              placeholder="Enter the correct option (A/B/C/D)"
            />
          </div>
          <button onClick={handleAddQuestion}>Add Question</button>

          <Link to="/view-all-questions">
            <button>View All Questions</button>
          </Link>
          <Link to="/student-performance">
            <button>Student Performance</button>
          </Link>
        </div>

        {/* Show success/error messages below the form */}
        <div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
