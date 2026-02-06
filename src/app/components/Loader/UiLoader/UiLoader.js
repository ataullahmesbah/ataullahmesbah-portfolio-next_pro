// components/UiLoader/UiLoader.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UiLoader = ({
    size = 'md',
    variant = 'spinner', // 'spinner', 'dots', 'pulse', 'ring', 'gradient'
    fullPage = false,
    delay = 0,
    message = '',
    showProgress = false,
    progress = 0,
    theme = 'purple', // 'purple', 'purple-gradient', 'dark', 'light'
    className = ''
}) => {
    const [showLoader, setShowLoader] = useState(delay === 0);
    const [fadeOut, setFadeOut] = useState(false);

    // Optional delay before showing loader
    useEffect(() => {
        if (delay > 0) {
            const timer = setTimeout(() => setShowLoader(true), delay);
            return () => clearTimeout(timer);
        }
    }, [delay]);

    // Handle fade out when progress completes
    useEffect(() => {
        if (showProgress && progress >= 100) {
            setTimeout(() => setFadeOut(true), 500);
        }
    }, [progress, showProgress]);

    if (!showLoader || fadeOut) return null;

    // Theme configurations
    const themeConfig = {
        purple: {
            primary: 'bg-purple-500',
            secondary: 'bg-purple-400',
            light: 'bg-purple-100',
            text: 'text-purple-600',
            gradient: 'from-purple-500 to-purple-700'
        },
        'purple-gradient': {
            primary: 'bg-gradient-to-r from-purple-500 to-purple-700',
            secondary: 'bg-gradient-to-r from-purple-400 to-purple-600',
            light: 'bg-purple-100',
            text: 'text-purple-600',
            gradient: 'from-purple-500 via-purple-600 to-purple-700'
        },
        dark: {
            primary: 'bg-gray-800',
            secondary: 'bg-gray-600',
            light: 'bg-gray-200',
            text: 'text-gray-700',
            gradient: 'from-gray-700 to-gray-900'
        },
        light: {
            primary: 'bg-white',
            secondary: 'bg-gray-300',
            light: 'bg-gray-100',
            text: 'text-gray-600',
            gradient: 'from-white to-gray-200'
        }
    };

    const currentTheme = themeConfig[theme];

    // Size configurations
    const sizeConfig = {
        sm: {
            loader: 'h-8 w-8',
            text: 'text-sm',
            message: 'text-xs',
            progress: 'h-1'
        },
        md: {
            loader: 'h-12 w-12',
            text: 'text-base',
            message: 'text-sm',
            progress: 'h-1.5'
        },
        lg: {
            loader: 'h-16 w-16',
            text: 'text-lg',
            message: 'text-base',
            progress: 'h-2'
        },
        xl: {
            loader: 'h-20 w-20',
            text: 'text-xl',
            message: 'text-lg',
            progress: 'h-2.5'
        }
    };

    const currentSize = sizeConfig[size];

    // Loader Variants
    const LoaderVariant = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="flex items-center justify-center space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className={`w-3 h-3 rounded-full ${currentTheme.primary}`}
                                animate={{
                                    y: [0, -10, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </div>
                );

            case 'pulse':
                return (
                    <motion.div
                        className={`${currentSize.loader} rounded-full ${currentTheme.primary}`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                );

            case 'ring':
                return (
                    <div className="relative">
                        <div className={`${currentSize.loader} rounded-full border-4 border-t-transparent border-r-transparent ${theme === 'purple-gradient' ? 'border-gradient-to-r from-purple-500 to-purple-700' : 'border-purple-200'}`}></div>
                        <div className={`absolute top-0 left-0 ${currentSize.loader} rounded-full border-4 ${theme === 'purple-gradient' ? 'border-gradient-to-r from-purple-500 to-purple-700' : 'border-purple-500'} border-b-transparent border-l-transparent animate-spin`}></div>
                    </div>
                );

            case 'gradient':
                return (
                    <div className="relative">
                        <div className={`${currentSize.loader} rounded-full bg-gradient-to-r ${currentTheme.gradient} animate-spin`}>
                            <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full"></div>
                        </div>
                    </div>
                );

            case 'spinner':
            default:
                return (
                    <div className="relative">
                        {/* Outer ring with gradient */}
                        <div className={`${currentSize.loader} rounded-full border-4 ${theme === 'purple-gradient' ? 'border-gradient-to-r from-purple-500 to-purple-700' : 'border-purple-200'}`}></div>
                        
                        {/* Spinning gradient arc */}
                        <div className={`absolute top-0 left-0 ${currentSize.loader} rounded-full border-4 ${theme === 'purple-gradient' ? 'border-gradient-to-r from-purple-500 to-purple-700' : 'border-purple-500'} border-t-transparent animate-spin`}></div>
                        
                        {/* Inner decorative elements */}
                        <motion.div
                            className="absolute inset-2 rounded-full border-2 border-purple-300/30"
                            animate={{
                                rotate: 360
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col items-center justify-center min-h-screen px-4 ${fullPage ? 'fixed inset-0 z-50 backdrop-blur-sm' : ''} ${className}`}
                style={fullPage ? {
                    background: theme === 'purple-gradient' 
                        ? 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)'
                        : undefined
                } : {}}
            >
                <div className="flex flex-col items-center space-y-4">
                    {/* Main Loader */}
                    <LoaderVariant />

                    {/* Progress Bar (Optional) */}
                    {showProgress && (
                        <div className="w-48 mt-4">
                            <div className="h-1 w-full bg-purple-100 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${theme === 'purple-gradient' ? 'bg-gradient-to-r from-purple-500 to-purple-700' : 'bg-purple-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-purple-600 mt-1">
                                <span>Loading</span>
                                <span>{progress}%</span>
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`${currentSize.message} font-medium ${currentTheme.text} text-center mt-3 max-w-xs`}
                        >
                            {message}
                        </motion.p>
                    )}

                    {/* Decorative Elements */}
                    {fullPage && variant === 'spinner' && (
                        <>
                            {/* Animated background dots */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(15)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 rounded-full bg-purple-300/20"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            scale: [0.5, 1, 0.5],
                                            opacity: [0.2, 0.5, 0.2]
                                        }}
                                        transition={{
                                            duration: 2 + Math.random(),
                                            repeat: Infinity,
                                            delay: Math.random() * 2
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Glow effect */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UiLoader;