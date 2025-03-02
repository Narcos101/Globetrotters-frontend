import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import ChallengeFriend from "./ChallengeFriend"; // Import the component
import './Dashboard.css'

function Dashboard() {
    const [sessionId, setSessionId] = useState(null);
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [result, setResult] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [userData, setUserData] = useState({
        username: "Guest",
        total_correct_questions: 0,
        total_games_played: 0,
    });

    //   const { width, height } = useWindowSize(); 

    useEffect(() => {
        const storedSession = localStorage.getItem("sessionId");
        if (storedSession) {
            setSessionId(storedSession);
            fetchQuestion(storedSession);
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/get_user_info', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handle_start_game = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // Get JWT token from storage
            console.log(token)
            const response = await fetch("http://127.0.0.1:5000/start_session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send JWT token
                },
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("sessionId", data.session_id);
                setSessionId(data.session_id);
                fetchQuestion(data.session_id);
                console.log("Game session started:", data.session_id);
            } else {
                console.error("Error:", data.error || "Failed to start session");
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
        setLoading(false);
    };

    const fetchQuestion = async (session_id) => {
        setLoading(true);
        setShowNextButton(false);
        setShowResult(false);
        setResult(null);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/get_round?session_id=${session_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setQuestionData(data);
            } else {
                console.error("Error fetching question:", data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = async (selectedOption, uuid) => {
        try {
            const token = localStorage.getItem("token");
            const sessionId = localStorage.getItem("sessionId");
            // console.log(token,sessionId,uuid)
            const response = await fetch("http://localhost:5000/api/set_round", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    uuid: uuid,
                    selected_option: selectedOption,
                }),
            });

            const data = await response.json();
            setResult(data)
            setShowNextButton(true)
            setShowResult(true)
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome, {userData?.username}</h2>
            {!sessionId ? (
                <>
                    <button className="start-game-btn" onClick={handle_start_game}>
                        Start the game
                    </button>
                    <br></br>
                    <ChallengeFriend fetchUserData={fetchUserData} userData={userData} />
                </>
            ) : loading ? (
                <p className="loading-text">Loading question...</p>
            ) : questionData ? (
                <div className="question-container">
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {questionData.answer_destination.map((clue, index) => (
                            <li key={index} style={{ marginBottom: "5px" }}>
                                🔹 {clue}
                            </li>
                        ))}
                    </ul>
                    <ul className="option-list">
                        {questionData.hint_destinations.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleOptionClick(option, questionData.uuid)}
                                style={{ cursor: result ? "not-allowed" : "pointer", opacity: result ? 0.5 : 1, pointerEvents: result ? "none" : "auto" }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No question available.</p>
            )}



            {showResult && (
                <>
                    {result.isCorrect ? (
                        <>
                            <div className="confetti-container">
                                <Confetti width={window.innerWidth} height={window.innerHeight} />
                            </div>
                            <h2 className="correct-answer">🎉 Correct Answer! 🎉</h2>
                        </>
                    ) : (
                        <h2 className="incorrect-answer">😞 Incorrect Answer! 😞</h2>
                    )}
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {result.additional_details.map((detail, index) => (
                            <li key={index} style={{ marginBottom: "5px" }}>
                                🔹 {detail}
                            </li>
                        ))}
                    </ul>
                    {/* <p>{result.additional_details}</p> */}
                </>
            )}

            {showNextButton && (
                <button className="next-btn" onClick={() => fetchQuestion(sessionId)}>
                    Next Question
                </button>
            )}
        </div>
    );
}

export default Dashboard;
