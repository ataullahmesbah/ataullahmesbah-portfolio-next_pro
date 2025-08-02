'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaGamepad, FaSmileWink, FaTrophy, FaRunning } from 'react-icons/fa';

export default function UserPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [showGame, setShowGame] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [obstacles, setObstacles] = useState([]);
    const gameRef = useRef(null);
    const dinoRef = useRef(null);
    const gameSpeed = useRef(5);
    const frameRef = useRef(null);

    // Check session and redirect if needed
    useEffect(() => {
        if (!session || session.user.role !== 'user') {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [session, router]);

    // Game logic
    useEffect(() => {
        if (!showGame) return;

        const handleKeyDown = (e) => {
            if ((e.code === 'Space' || e.key === 'ArrowUp') && !isJumping) {
                jump();
            }
        };

        const jump = () => {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 800);
        };

        const createObstacle = () => {
            const newObstacle = {
                id: Date.now(),
                position: 800,
                width: 20 + Math.random() * 30,
                height: 30 + Math.random() * 50
            };
            setObstacles(prev => [...prev, newObstacle]);
        };

        const updateGame = () => {
            // Update score
            setScore(prev => prev + 1);

            // Increase speed gradually
            if (score % 500 === 0) {
                gameSpeed.current += 0.5;
            }

            // Move obstacles
            setObstacles(prev =>
                prev.map(obs => ({
                    ...obs,
                    position: obs.position - gameSpeed.current
                })).filter(obs => obs.position > -50)
            );

            // Create new obstacles randomly
            if (Math.random() < 0.02) {
                createObstacle();
            }

            // Check collisions
            const dinoRect = dinoRef.current.getBoundingClientRect();
            const collision = obstacles.some(obs => {
                const obsRect = {
                    left: obs.position,
                    right: obs.position + obs.width,
                    top: gameRef.current.offsetHeight - obs.height,
                    bottom: gameRef.current.offsetHeight
                };
                return !(
                    dinoRect.right < obsRect.left ||
                    dinoRect.left > obsRect.right ||
                    dinoRect.top > obsRect.bottom ||
                    dinoRect.bottom < obsRect.top
                );
            });

            if (collision) {
                setGameOver(true);
                return;
            }

            frameRef.current = requestAnimationFrame(updateGame);
        };

        window.addEventListener('keydown', handleKeyDown);
        frameRef.current = requestAnimationFrame(updateGame);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(frameRef.current);
            setObstacles([]);
            setScore(0);
            gameSpeed.current = 5;
            setGameOver(false);
        };
    }, [showGame, isJumping]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
            {/* Header Section */}
            <header className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <FaSmileWink className="text-purple-500" />
                        Welcome back, {session.user.name?.split(' ')[0] || 'Friend'}!
                    </h1>
                    <p className="text-gray-600 mt-1">Your personalized dashboard is under construction</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <button
                        onClick={() => setShowGame(!showGame)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <FaGamepad /> {showGame ? 'Hide Game' : 'Play Dino Game'}
                    </button>
                </div>
            </header>

            {/* Dino Game */}
            {showGame && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaRunning /> Chrome Dino Game
                        </h2>
                        <div className="text-lg font-semibold">
                            Score: <span className="text-indigo-600">{score}</span>
                        </div>
                    </div>

                    <div
                        ref={gameRef}
                        className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden border border-gray-300"
                    >
                        {/* Ground */}
                        <div className="absolute bottom-0 w-full h-4 bg-gray-700"></div>

                        {/* Dino */}
                        <div
                            ref={dinoRef}
                            className={`absolute bottom-4 left-16 w-12 h-16 bg-gray-800 transition-transform duration-300 ${isJumping ? 'translate-y-[-100px]' : ''
                                }`}
                            style={{
                                clipPath: 'polygon(0% 100%, 20% 0%, 80% 0%, 100% 100%)'
                            }}
                        ></div>

                        {/* Obstacles */}
                        {obstacles.map(obs => (
                            <div
                                key={obs.id}
                                className="absolute bottom-4 bg-gray-800"
                                style={{
                                    left: `${obs.position}px`,
                                    width: `${obs.width}px`,
                                    height: `${obs.height}px`,
                                    clipPath: 'polygon(0% 100%, 30% 0%, 70% 0%, 100% 100%)'
                                }}
                            ></div>
                        ))}

                        {/* Game Over Screen */}
                        {gameOver && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                                <div className="bg-white p-6 rounded-lg text-center">
                                    <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                                    <p className="mb-4">Your score: {score}</p>
                                    <button
                                        onClick={() => {
                                            setGameOver(false);
                                            setScore(0);
                                            setObstacles([]);
                                            gameSpeed.current = 5;
                                        }}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Play Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Start Screen */}
                        {!gameOver && obstacles.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-lg font-semibold mb-2">Press Space or Up Arrow to Jump</p>
                                    <p className="text-gray-600">Avoid the obstacles!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Card */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" /> Game Stats
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">High Score</span>
                            <span className="font-bold">{score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Games Played</span>
                            <span className="font-bold">1</span>
                        </div>
                    </div>
                </div>

                {/* Other dashboard cards... */}
            </div>
        </div>
    );
}