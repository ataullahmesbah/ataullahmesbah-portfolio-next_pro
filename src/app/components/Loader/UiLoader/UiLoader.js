// components/UiLoader/UiLoader.js
'use client';

import { useState, useEffect } from 'react';

const UiLoader = ({
    size = 'md',
    color = 'blue',
    fullPage = false,
    delay = 0,
    message = ''
}) => {
    const [showLoader, setShowLoader] = useState(delay === 0);

    // Optional delay before showing loader
    useEffect(() => {
        if (delay > 0) {
            const timer = setTimeout(() => setShowLoader(true), delay);
            return () => clearTimeout(timer);
        }
    }, [delay]);

    // Size and color configurations
    const sizeClasses = {
        sm: 'h-6 w-6 border-t-2 border-b-2',
        md: 'h-8 w-8 border-t-2 border-b-2',
        lg: 'h-10 w-10 border-t-3 border-b-3',
        xl: 'h-12 w-12 border-t-3 border-b-3'
    };

    const colorClasses = {
        blue: 'border-blue-500',
        purple: 'border-purple-500',
        sky: 'border-sky-500',
        white: 'border-white'
    };

    if (!showLoader) return null;

    return (
        <div className={`flex items-center justify-center min-h-screen px-4 ${fullPage ? 'fixed inset-0 bg-gray-900/80 z-50' : ''}`}>
            <div className="flex flex-col items-center">
                <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
                {message && (
                    <p className={`mt-3 text-${color}-500 font-medium`}>{message}</p>
                )}
            </div>
        </div>
    );
};

export default UiLoader;