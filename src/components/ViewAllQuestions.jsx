import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // Goes one step back in the history
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/questions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching questions: " + err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleEdit = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].isEditing = !updatedQuestions[index].isEditing;
    setQuestions(updatedQuestions);
  };

  const handleInputChange = (e, index, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleSave = async (index) => {
    const questionToUpdate = questions[index];
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/update-question/${questionToUpdate.id}`,
        questionToUpdate,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedQuestions = [...questions];
      updatedQuestions[index].isEditing = false;
      setQuestions(updatedQuestions);
    } catch (err) {
      setError("Error updating question: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-question/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove the deleted question and reassign question numbers
      const updatedQuestions = questions
        .filter((question) => question.id !== id)
        .map((question, index) => ({
          ...question,
          questionNumber: index + 1, // Reassign question numbers
        }));

      setQuestions(updatedQuestions);
    } catch (err) {
      setError("Error deleting question: " + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <button onClick={goBack}>Back</button>
      <div className="question-container">
        {questions.length > 0 ? (
          <ul>
            {questions.map((question, index) => (
              <li key={question.id}>
                <strong>
                  Question {question.questionNumber || index + 1}:
                </strong>
                {question.isEditing ? (
                  <div>
                    <div>
                      <label>
                        Question:
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) =>
                            handleInputChange(e, index, "question")
                          }
                        />
                      </label>
                    </div>
                    {/* Other input fields for editing */}
                    <button onClick={() => handleSave(index)}>Save</button>
                  </div>
                ) : (
                  <div>
                    <div>Question: {question.question}</div>
                    <div>Option A: {question.option_a}</div>
                    <div>Option B: {question.option_b}</div>
                    <div>Option C: {question.option_c}</div>
                    <div>Option D: {question.option_d}</div>
                    <div>Correct Option: {question.correct_option}</div>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(question.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllQuestions;
