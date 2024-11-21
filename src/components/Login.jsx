import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Goes one step back in the history
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          username,
          password,
        }
      );

      const { token, id, role } = response.data; // Get token, id, and role from the response
      console.log("token", token);
      console.log("id", id);
      console.log("role", role);

      if (token && id && role) {
        localStorage.setItem("token", token); // Store the token
        localStorage.setItem("id", id); // Store the user id
        localStorage.setItem("role", role); // Store the role

        // Now, check if the user has completed the quiz
        const quizResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/quiz/status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Quiz Response Data:", quizResponse.data); // Log the full response

        const { quizCompleted } = quizResponse.data || {};
        // Check quiz completion status
        console.log(`Status:${quizCompleted}`);

        // Conditional navigation based on role and quiz completion status
        if (role === "Student") {
          if (quizCompleted) {
            navigate("/thank-you"); // Redirect to ThankYou component if quiz is completed
          } else {
            navigate("/quiz"); // Redirect to Quiz component if quiz is not completed
          }
        } else if (role === "Teacher") {
          navigate("/teacher-dashboard"); // Redirect to Teacher Dashboard if the role is Teacher
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Error logging in: " + err.message);
    }
  };

  return (
    <div className="login-form">
      <h2>Login Form</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default Login;
