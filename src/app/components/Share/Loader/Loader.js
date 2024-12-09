"use client";

import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const Loader = ({ color = "#1a88be", text = "am", speedMultiplier = 1 }) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            {/* Loader Animation */}
            <PropagateLoader color={color} speedMultiplier={speedMultiplier} />

            {/* Loading Text */}
            <h1 className="mt-4 text-4xl font-bold text-gray-800">
                <span className="text-blue-600">{text[0]}</span>
                <span>{text.slice(1)}</span>
            </h1>
        </div>
    );
};

export default Loader;
