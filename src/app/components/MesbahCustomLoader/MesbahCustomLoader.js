'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const MesbahCustomLoader = () => {
    const fullName = "ATAULLAH MESBAH";
    const [activeLetters, setActiveLetters] = useState([]);
    const [phase, setPhase] = useState('entering');
    const [exitProgress, setExitProgress] = useState(0);
    const [bgAnimation, setBgAnimation] = useState(false);
    const animationFrameRef = useRef(null);

    // Letter appearance with perfect spacing
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
        let timer;

        if (phase === 'holding') {
            timer = setTimeout(() => {
                setPhase('exiting');
                setBgAnimation(true);
            }, 1500);
        } else if (phase === 'exiting') {
            const duration = 700;
            const start = Date.now();

            const animateExit = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                setExitProgress(progress);

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animateExit);
                }
            };

            animationFrameRef.current = requestAnimationFrame(animateExit);
        }

        return () => {
            clearTimeout(timer);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [phase]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen"
                role="status"
                aria-label="Loading website content"
                style={{
                    background: bgAnimation
                        ? 'transparent'
                        : 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
                }}
                initial={{
                    y: 0,
                    borderBottomLeftRadius: '0%',
                    borderBottomRightRadius: '0%',
                }}
                animate={{
                    y: bgAnimation ? -window.innerHeight : 0,
                    borderBottomLeftRadius: bgAnimation ? '50%' : '0%',
                    borderBottomRightRadius: bgAnimation ? '50%' : '0%',
                }}
                transition={{
                    y: { duration: 2, ease: [0.22, 1, 0.36, 1] },
                    borderBottomLeftRadius: { duration: 1, delay: 0.2, ease: 'easeInOut' },
                    borderBottomRightRadius: { duration: 1, delay: 0.2, ease: 'easeInOut' },
                }}
            >
                <div className="relative w-full max-w-[90vw] sm:max-w-[28rem] md:max-w-[32rem] lg:max-w-[36rem] px-4 sm:px-6">
                    {/* Boxed characters */}
                    <div className="flex justify-center items-center flex-wrap gap-x-0.5 sm:gap-x-1 gap-y-1">
                        {fullName.split('').map((char, i) => (
                            <motion.div
                                key={i}
                                className={`flex items-center justify-center 
                  ${activeLetters.includes(char) ? 'bg-white/20' : 'bg-transparent'}
                  rounded-md p-1 sm:p-1.5 md:p-2`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: activeLetters.includes(char) ? 1 : 0,
                                    scale: activeLetters.includes(char) ? [1, 1.05, 1] : 0.8,
                                    y: activeLetters.includes(char) ? [3, -1, 0] : 3,
                                }}
                                transition={{
                                    opacity: { duration: 0.3 },
                                    scale: { duration: 0.5, type: 'spring', bounce: 0.3 },
                                    y: { duration: 0.4 },
                                }}
                            >
                                <span className="text-white text-[0.65rem] sm:text-xs md:text-sm lg:text-base font-medium">
                                    {char}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <motion.div
                        className="absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-14 left-0 right-0 h-[1px] bg-white/50 overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${exitProgress * 100}%` }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MesbahCustomLoader;