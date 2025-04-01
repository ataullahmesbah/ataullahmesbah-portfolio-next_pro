"use client";

import { useState, useEffect } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Speed: 30ms per step (3 seconds total to reach 100%)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background Circle - Thinner */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3" // Reduced from 8 to 4 for a thinner look
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (progress / 100) * 251.2}
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        {/* Percentage Text - Improved Visibility */}
        <div className="absolute inset-0 flex items-center justify-center text-blue-600 drop-shadow-md">
          {progress}%
        </div>
      </div>
    </div>
  );
}