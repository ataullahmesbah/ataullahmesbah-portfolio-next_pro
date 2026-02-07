'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const MesbahCustomLoader = () => {
    const fullName = "ATAULLAH MESBAH";
    const [activeLetters, setActiveLetters] = useState([]);
    const [phase, setPhase] = useState('entering');
    const [exitProgress, setExitProgress] = useState(0);
    const [showLoader, setShowLoader] = useState(true);

    // Letter appearance
    useEffect(() => {
        if (phase !== 'entering') return;

        const timer = setTimeout(() => {
            if (activeLetters.length < fullName.length) {
                if (activeLetters.length === 7) {
                    setActiveLetters((prev) => [...prev, ' ']);
                } else {
                    setActiveLetters((prev) => [...prev, fullName[activeLetters.length]]);
                }
            } else {
                setPhase('holding');
            }
        }, 80);

        return () => clearTimeout(timer);
    }, [activeLetters, phase]);

    // Phase transitions
    useEffect(() => {
        if (phase === 'holding') {
            const timer = setTimeout(() => {
                setPhase('exiting');
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (phase === 'exiting') {
            const duration = 700;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                setExitProgress(progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // একটু দেরি করে সম্পূর্ণ লোডার সরিয়ে ফেলা
                    setTimeout(() => {
                        setShowLoader(false);
                    }, 300);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [phase]);

    if (!showLoader) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                }}
                initial={{ y: 0 }}
                animate={{
                    y: phase === 'exiting' ? '-100vh' : 0,
                    scale: phase === 'exiting' ? 0.9 : 1,
                    opacity: phase === 'exiting' ? 0 : 1
                }}
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1]
                }}
            >
                <div className="relative w-full max-w-[90vw] sm:max-w-[28rem] md:max-w-[32rem] px-4">
                    {/* Boxed characters */}
                    <div className="flex justify-center items-center flex-wrap gap-1">
                        {fullName.split('').map((char, i) => (
                            <motion.div
                                key={i}
                                className={`flex items-center justify-center 
                                    ${activeLetters.includes(char)
                                        ? 'bg-gradient-to-br from-white/30 to-white/10'
                                        : 'bg-transparent'}
                                    rounded-md p-1.5 sm:p-2 shadow-lg`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: activeLetters.includes(char) ? 1 : 0,
                                    scale: activeLetters.includes(char) ? 1 : 0.8,
                                }}
                                transition={{
                                    opacity: { duration: 0.3 },
                                    scale: { duration: 0.4, ease: "easeOut" }
                                }}
                            >
                                <span className="text-white text-sm sm:text-base font-semibold tracking-wider">
                                    {char}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent overflow-hidden"
                        style={{
                            width: '200px',
                            opacity: phase === 'exiting' ? 1 : 0.7
                        }}
                    >
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: "0%" }}
                            animate={{ width: phase === 'exiting' ? "100%" : "0%" }}
                            transition={{
                                duration: 1,
                                ease: [0.22, 1, 0.36, 1],
                                delay: phase === 'exiting' ? 0 : 0
                            }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MesbahCustomLoader;