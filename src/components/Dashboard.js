import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState({ username: "", score: 0 });

  useEffect(() => {
    console.log("Dashboard")
    // const fetchUser = async () => {
    //   const token = localStorage.getItem("token");
    //   const res = await axios.get("http://localhost:5000/score", {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   setUser(res.data);
    // };
    // fetchUser();
  }, []);

  const handleInvite = async () => {
    const res = await axios.get(`http://localhost:5000/invite/${user.id}`);
    const { image, invite_link } = res.data;
    const message = `Join me in this game! See my score: ${invite_link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={handle_start_game}>Start the game</button>
      {/* <h3>Score: {user.score}</h3> */}
      <button onClick={handleInvite}>Challenge a Friend</button>
    </div>
  );
}

export default Dashboard;
