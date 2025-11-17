'use client';

import am2 from "@/./../public/am2.png";

const MainLogo = () => {
    return (
        <div className="flex justify-center items-center">
            <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 700.15 57.69"
                className="w-full max-w-md h-auto"
                style={{ pointerEvents: 'none' }}
            >
                <defs>
                    <style>
                        {`
        .cls-2 {
            font-size: 31px;
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
        }
        .cls-3 {
            font-size: 38px;
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        `}
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

                {/* Image add করুন আগের "am" text এর জায়গায় */}
                <image
                    href={am2.src}
                    x="152"
                    y="7"
                    width="45"
                    height="32"
                    preserveAspectRatio="xMidYMid meet"
                    pointerEvents="none"
                />

                <text
                    className="cls-3"
                    transform="translate(0 33.34) scale(1.03 1)"
                    pointerEvents="none"
                >
                    ataullah
                </text>

                <text
                    className="cls-3"
                    transform="translate(205 33.34)"
                    pointerEvents="none"
                >
                    mesbah
                </text>

                <polygon
                    className="cls-4"
                    points="47.06 49.22 284.59 49.22 57.65 57.69 47.06 49.22"
                    pointerEvents="none"
                />
            </svg>
        </div>
    );
};

export default MainLogo;