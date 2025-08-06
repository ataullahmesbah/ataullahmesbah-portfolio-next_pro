'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const MesbahCustomLoader = () => {
    const fullName = "ATAULLAH MESBAH";
    const [activeLetters, setActiveLetters] = useState([]);
    const [phase, setPhase] = useState('entering');
    const [exitProgress, setExitProgress] = useState(0);
    const [bgAnimation, setBgAnimation] = useState(false);

    // Letter appearance with perfect spacing
    useEffect(() => {
        if (phase !== 'entering') return;

        const timer = setTimeout(() => {
            if (activeLetters.length < fullName.length) {
                if (activeLetters.length === 7) { // After "ATAULLAH"
                    setActiveLetters(prev => [...prev, ' ']);
                } else {
                    setActiveLetters(prev => [...prev, fullName[activeLetters.length]]);
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
        }
        else if (phase === 'exiting') {
            const duration = 700;
            const start = Date.now();

            const animateExit = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                setExitProgress(progress);

                if (progress < 1) {
                    requestAnimationFrame(animateExit);
                }
            };

            animateExit();
        }

        return () => clearTimeout(timer);
    }, [phase]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
                initial={{
                    backgroundColor: '#000000',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px'
                }}
                animate={{
                    backgroundColor: bgAnimation ? 'rgba(0,0,0,0)' : '#000000',
                    y: bgAnimation ? -window.innerHeight : 0,
                    borderBottomLeftRadius: bgAnimation ? '1.5rem' : '0px',
                    borderBottomRightRadius: bgAnimation ? '1.5rem' : '0px'
                }}
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                    borderBottomLeftRadius: { delay: 0.2, duration: 0.5 },
                    borderBottomRightRadius: { delay: 0.2, duration: 0.5 }
                }}
            >
                <div className="relative w-full max-w-md px-4">
                    {/* Boxed characters */}
                    <div className="flex justify-center items-center flex-wrap gap-x-[0.1rem]">
                        {fullName.split('').map((char, i) => (
                            <motion.div
                                key={i}
                                className={`flex items-center justify-center 
                  ${activeLetters.includes(char) ? 'bg-white/10' : 'bg-transparent'}
                  rounded-[6px] p-[0.15rem] sm:p-[0.2rem]`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: activeLetters.includes(char) ? 1 : 0,
                                    scale: activeLetters.includes(char) ? [1, 1.05, 1] : 0.8,
                                    y: activeLetters.includes(char) ? [3, -1, 0] : 3
                                }}
                                transition={{
                                    opacity: { duration: 0.3 },
                                    scale: { duration: 0.5, type: 'spring', bounce: 0.3 },
                                    y: { duration: 0.4 }
                                }}
                            >
                                <span className="text-white text-xs sm:text-sm font-medium">
                                    {char}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <motion.div
                        className="absolute bottom-16 left-0 right-0 h-[0.5px] bg-white/30 overflow-hidden"
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