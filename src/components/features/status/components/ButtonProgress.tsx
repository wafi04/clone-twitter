import React, { useState, useEffect } from "react";

interface ProgressProps {
  maxLength: number;
  currentLength: number;
}

export function Progress({ maxLength, currentLength }: ProgressProps) {
  const [remainingChars, setRemainingChars] = useState(
    maxLength - currentLength
  );
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isOverLimit, setIsOverLimit] = useState(false);

  useEffect(() => {
    setRemainingChars(maxLength - currentLength);
    setProgressPercentage((currentLength / maxLength) * 100);
    setIsOverLimit(currentLength > maxLength);
  }, [currentLength, maxLength]);

  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  const getColor = () => {
    if (progressPercentage < 80) return "#1DA1F2"; // Twitter blue
    if (progressPercentage < 100) return "#FFAD1F"; // Yellow
    return "#E0245E";
  };

  return (
    <div className="relative flex items-center justify-center size-12">
      {progressPercentage > 0 && (
        <>
          <svg className="absolute top-0 left-0" width="48" height="48">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#E1E8ED"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke={getColor()}
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 24 24)"
              style={{ transition: "stroke-dashoffset 0.3s" }}
            />
          </svg>
          {progressPercentage >= 80 && (
            <div
              className={`text-sm font-medium ${isOverLimit ? "text-red-500" : "text-gray-700"}`}
            >
              {remainingChars}
            </div>
          )}
        </>
      )}
    </div>
  );
}
