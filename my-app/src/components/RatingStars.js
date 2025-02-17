import React from "react";

const RatingStars = ({ currentRating, onRate }) => {
    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{ cursor: "pointer", color: star <= currentRating ? "gold" : "gray" }}
                    onClick={() => onRate(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default RatingStars;
