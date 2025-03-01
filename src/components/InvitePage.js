import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function InvitePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/score/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handlePlay = () => {
    navigate("/register"); // Redirect to login/register before playing
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>{user.username} invited you!</h2>
          <h3>Score: {user.score}</h3>
          <p>Click below to join and play.</p>
          <button onClick={handlePlay}>Play Now</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default InvitePage;
