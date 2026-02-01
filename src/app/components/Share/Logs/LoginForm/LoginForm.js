'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { showSuccessToast, showErrorToast, showInfoToast } from '@/app/components/Share/toastConfig/toastConfig';

const LoginForm = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (status === 'authenticated') {
            showInfoToast('You are already logged in! Redirecting...');
            router.push('/');
        }
    }, [status, router]);

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = otp.split('');
        newOtp[index] = value;
        setOtp(newOtp.join(''));

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
        setOtp(pasteData);

        if (pasteData.length === 6) {
            const lastInput = document.getElementById(`otp-5`);
            if (lastInput) lastInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep('verify');
                showSuccessToast('OTP sent to your email!');
            } else {
                setError(data.message || 'Failed to send OTP');
                showErrorToast(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            showErrorToast('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // In your handleVerifyOTP function, add better error handling
    // app/LoginForm/LoginForm.jsx - handleVerifyOTP function
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Step 1: Verify OTP
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok && data.verified) {
                // ✅ FIX: Now login with credentials
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                    callbackUrl: '/',
                });

                console.log('SignIn Result:', result);

                if (result?.error) {
                    // Handle specific errors
                    if (result.error.includes('force logout') ||
                        result.error.includes('session terminated') ||
                        result.error.includes('terminated by admin')) {

                        // This shouldn't happen now as we cleared forceLogout
                        // But just in case
                        setError('Your session was terminated. Please try logging in again.');
                        showErrorToast('Session issue. Please try again.');

                        // Reset to login step
                        setStep('login');
                        setOtp('');
                    } else if (result.error.includes('inactive')) {
                        setError('Your account is inactive. Please contact admin.');
                        showErrorToast('Account inactive. Please contact admin.');
                    } else {
                        setError(result.error);
                        showErrorToast(result.error);
                    }
                } else if (result?.url) {
                    // Login successful
                    showSuccessToast('Login successful!');
                    router.push(result.url || '/');
                } else {
                    // Login successful but no URL
                    showSuccessToast('Login successful!');
                    router.push('/');
                }
            } else {
                setError(data.message || 'Invalid OTP code');
                showErrorToast(data.message || 'Invalid OTP code');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('An unexpected error occurred. Please try again.');
            showErrorToast('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    // Show loading state while checking session
    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Don't render form if already authenticated
    if (status === 'authenticated') {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Redirecting to home page...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {step === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending OTP...
                            </>
                        ) : (
                            'Send OTP'
                        )}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-white mb-2">Enter Verification Code</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            We’ve sent a 6-digit code to your email. Please enter it below.
                        </p>

                        <div className="flex justify-center space-x-3 mb-6">
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={otp[index] || ''}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onPaste={handleOtpPaste}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    id={`otp-${index}`}
                                    className="w-12 h-12 text-center text-white text-lg font-semibold border-2 border-gray-600 bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                />
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setStep('login');
                                setError('');
                                setOtp('');
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default LoginForm;