import React from "react";

interface ReviewsRatingProps {
  rate: number; // f.eks. 4
}

const ReviewsRating = ({ rate }: ReviewsRatingProps) => {
  return (
    <div className="rating rating-sm md:rating-md">
      {[1, 2, 3, 4, 5].map((value) => (
        <input
          key={value}
          type="radio"
          name={`rating-${Math.random()}`} // Random name to avoid form grouping
          className="mask mask-star-2 bg-primary"
          defaultChecked={rate === value}
          disabled
          aria-label={`${value} star`}
        />
      ))}
    </div>
  );
};

export default ReviewsRating;
