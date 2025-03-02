import React, { useState, useEffect } from "react";

const ChallengeFriend = ({fetchUserData, userData}) => {
    const [imageBlob, setImageBlob] = useState(null);

    useEffect(() => {
        fetchUserData();
        generateInviteImage(userData);
    }, []);

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

        // Convert canvas to Blob for sharing
        canvas.toBlob((blob) => {
            setImageBlob(blob);
        }, "image/png");
    };

    const handleChallengeFriend = async () => {
        const shareText = `Hey! I'm playing this game! I got ${userData.total_correct_questions} correct answers in ${userData?.total_games_played} games. Can you beat me?`;
        const inviteLink = `https://localhost:3000/register`;

        if (navigator.canShare && imageBlob) {
            const file = new File([imageBlob], "invite.png", { type: "image/png" });

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

        // Fallback for WhatsApp Web (Text only, since it doesn’t support image sharing via URL)
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + inviteLink)}`, "_blank");
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
