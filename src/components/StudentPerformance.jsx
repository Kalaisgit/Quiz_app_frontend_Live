import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentPerformance = () => {
  const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState(null); // To store error if any
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // Goes one step back in the history
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/student-performance`
        );
        setStudentData(response.data); // Assuming this is an array of student performance
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to fetch student data.");
      }
    };

    fetchStudentData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>; // Show error if there's an issue fetching data
  }

  return (
    <div>
      <button onClick={goBack}>Back</button>
      <div className="performance-cards">
        {studentData.length === 0 ? (
          <p>No student data available.</p> // Display message if no data is available
        ) : (
          studentData.map((student, index) => (
            <div className="card" key={student.username || index}>
              {" "}
              {/* Use username as key */}
              <h3>{student.username}</h3> {/* Display the username */}
              <p>
                <strong>Total Score:</strong> {student.total_score}
              </p>
              <p>
                <strong>Last Attempt:</strong>{" "}
                {new Date(student.last_attempt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentPerformance;
