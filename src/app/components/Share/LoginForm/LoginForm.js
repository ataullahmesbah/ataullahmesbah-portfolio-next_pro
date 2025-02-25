'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login'); // 'login' or 'verify'
    const [error, setError] = useState('');

    // Redirect if user is already logged in
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/'); // Redirect to homepage or dashboard
        }
    }, [status, router]);

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        const newOtp = otp.split('');
        newOtp[index] = value;
        setOtp(newOtp.join(''));

        // Auto-focus on the next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    // Handle OTP paste
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6); // Limit to 6 digits
        setOtp(pasteData);

        // Auto-focus on the last input
        if (pasteData.length === 6) {
            document.getElementById(`otp-5`).focus();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Send OTP
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep('verify'); // Move to OTP verification step
                toast.success('OTP sent to your email!');
            } else {
                setError(data.message || 'Failed to send OTP');
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setError('An unexpected error occurred. Please try again.');
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        try {
            // Step 2: Verify OTP
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                // Step 3: Log in the user
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result?.error) {
                    setError(result.error);
                    toast.error(result.error);
                } else {
                    // Fetch user data
                    const user = await fetch('/api/auth/user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    }).then((res) => res.json());

                    toast.success(`Welcome back, ${user.name}!`);
                    router.push('/'); // Redirect to home page
                }
            } else {
                setError(data.message || 'Failed to verify OTP');
                toast.error(data.message || 'Failed to verify OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('An unexpected error occurred. Please try again.');
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>; // Show loading state while checking session
    }

    return (
        <div className="flex flex-col items-center justify-center ">
            <div className=" p-8 rounded-lg shadow-sm w-full max-w-sm">
               
                {step === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border border-gray-400 rounded-md"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border border-gray-400 rounded-md"
                            required
                        />
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                        >
                            Log In
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <div className="flex justify-center space-x-2 mb-4">
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={otp[index] || ''}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onPaste={handleOtpPaste}
                                    id={`otp-${index}`}
                                    className="w-12 h-12 text-center border text-black border-gray-500 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            ))}
                        </div>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}