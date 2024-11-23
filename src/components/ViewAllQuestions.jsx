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
      // Get the authentication token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      // Make the delete request with the token in headers
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-question/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Log the full response object for debugging
      console.log("Delete response:", response);

      // Check the status code and handle accordingly
      if (response.status === 200) {
        setSuccess(response.data.message); // For success
        // Optionally update your state to reflect the deleted question
        const updatedQuestions = questions.filter(
          (question) => question.id !== id
        );
        setQuestions(updatedQuestions);
      } else {
        setError("Error deleting question : " + response.data.message);
      }
    } catch (err) {
      // Log any errors from the request
      console.error("Error deleting question:", err);
      setError("An error occurred while deleting the question.");
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
                <strong>{question.isEditing ? "Editing Question" : ""}</strong>

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
                    <div>
                      <label>
                        Option A:
                        <input
                          type="text"
                          value={question.option_a}
                          onChange={(e) =>
                            handleInputChange(e, index, "option_a")
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Option B:
                        <input
                          type="text"
                          value={question.option_b}
                          onChange={(e) =>
                            handleInputChange(e, index, "option_b")
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Option C:
                        <input
                          type="text"
                          value={question.option_c}
                          onChange={(e) =>
                            handleInputChange(e, index, "option_c")
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Option D:
                        <input
                          type="text"
                          value={question.option_d}
                          onChange={(e) =>
                            handleInputChange(e, index, "option_d")
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Correct Option:
                        <input
                          type="text"
                          value={question.correct_option}
                          onChange={(e) =>
                            handleInputChange(e, index, "correct_option")
                          }
                        />
                      </label>
                    </div>
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
