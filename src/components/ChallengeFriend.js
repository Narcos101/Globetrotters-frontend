import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const ChallengeFriend = () => {
    const [imageBlob, setImageBlob] = useState(null);
    const [userData, setUserData] = useState({
        username: "...",
        total_correct_questions: 0,
        total_games_played: 0,
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/get_user_info`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            setUserData(data);
            generateInviteImage(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const generateInviteImage = async (data) => {
         const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const width = 600;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = "#000";
        ctx.font = "bold 24px Arial";
        ctx.fillText("You're Invited to Play!", 180, 50);

        // User details
        ctx.font = "20px Arial";
        ctx.fillText(`Username: ${data?.username}`, 50, 120);
        ctx.fillText(`Total Correct: ${data?.total_correct_questions}`, 50, 160);
        ctx.fillText(`Total Games: ${data?.total_games_played}`, 50, 200);
        ctx.fillText(`Best Score: ${data?.total_correct_questions*10}`, 50, 240);

        // Convert canvas to Blob for sharing
        canvas.toBlob((blob) => {
            setImageBlob(blob);
        }, "image/png");
    };

    const handleChallengeFriend = async () => {
        const shareText = `Hey! I'm playing this game! I got ${userData.total_correct_questions} correct answers in ${userData?.total_games_played} games. My highest score is ${userData?.total_correct_questions*10} points. Can you beat me?`;
        const inviteLink = `${APP_BASE_URL}/register`;

        const file = new File([imageBlob], "globetrotters.png", { type: "image/png" });
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + inviteLink)}`, "_blank");
        if (navigator.canShare && imageBlob) {
            const file = new File([imageBlob], "globetrotters.png", { type: "image/png" });

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Challenge a Friend!",
                        text: shareText,
                        url: inviteLink,
                        files: [file], // Sharing image
                    });
                    return;
                } catch (error) {
                    console.error("Error sharing", error);
                }
            }
        }
    };

    return (
        <div>
            <button onClick={handleChallengeFriend} className="challenge-btn">
                Challenge a Friend
            </button>
        </div>
    );
};

export default ChallengeFriend;
