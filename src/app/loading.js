// components/Loading.js'
'use client'
import React from 'react';
import { Oval } from 'react-loader-spinner';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Oval
                height={80}
                width={80}
                color="#4A90E2"
                ariaLabel="loading"
            />
        </div>
    );
};

export default Loading;
