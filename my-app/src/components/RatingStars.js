import React from "react";

// RatingStars.js
const RatingStars = ({ currentRating = 0, onRate }) => {
    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{ cursor: "pointer", color: star <= currentRating ? "gold" : "gray" }}
                    onClick={() => {
                        if (typeof onRate === "function") {
                            onRate(star); // Truyền rating khi click vào sao
                        }
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};





export default RatingStars;
