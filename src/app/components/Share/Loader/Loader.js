'use client';

import React, { useState, useEffect } from "react";

const Loader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Adjust the timeout duration as needed

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null; // Hide the loader after timeout

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black z-50">
            <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 440.15 57.69"
                className="w-48 h-auto animate-pulse"
            >
                <defs>
                    <style>
                        {`.cls-1, .cls-3, .cls-4 {
                            fill: #fff;
                        }
                        .cls-1 {
                            stroke: #e6e6e6;
                            stroke-miterlimit: 10;
                            stroke-width: 2px;
                        }
                        .cls-2 {
                            font-size: 31px;
                            font-family: BritannicBold, Britannic;
                        }
                        .cls-3 {
                            font-size: 38px;
                            font-family: BritannicBold, Britannic Regular;
                        }`}
                    </style>
                </defs>
                <rect
                    className="cls-1"
                    x="150.01"
                    y="4.95"
                    width="49"
                    height="36.35"
                    rx="8.75"
                />
                <text
                    className="cls-2"
                    transform="translate(155.72 31.58) scale(0.96 1)"
                >
                    am
                </text>
                <text
                    className="cls-3"
                    transform="translate(0 33.34) scale(1.03 1)"
                >
                    ataullah
                </text>
                <text className="cls-3" transform="translate(205 33.34)">
                    mesbah
                </text>
                <polygon
                    className="cls-4"
                    points="47.06 49.22 284.59 49.22 57.65 57.69 47.06 49.22"
                />
            </svg>
        </div>
    );
};

export default Loader;
