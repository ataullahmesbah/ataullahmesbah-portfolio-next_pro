// app/ForgotPasswordModal/ForgotPasswordModal.js
'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaShieldAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { showSuccessToast, showErrorToast, showInfoToast } from '@/app/components/Share/toastConfig/toastConfig';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('confirm'); // 'confirm', 'verify', 'reset'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password requirements
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // Reset modal when closed
    useEffect(() => {
        if (!isOpen) {
            setStep('confirm');
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
        }
    }, [isOpen]);

    // Check password requirements
    useEffect(() => {
        if (newPassword) {
            setPasswordRequirements({
                length: newPassword.length >= 8,
                uppercase: /[A-Z]/.test(newPassword),
                lowercase: /[a-z]/.test(newPassword),
                number: /[0-9]/.test(newPassword),
                special: /[@$!%*?&]/.test(newPassword)
            });
        }
    }, [newPassword]);

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = otp.split('');
        newOtp[index] = value;
        setOtp(newOtp.join(''));

        if (value && index < 5) {
            const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
        setOtp(pasteData);

        if (pasteData.length === 6) {
            const lastInput = document.getElementById(`forgot-otp-5`);
            if (lastInput) lastInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleConfirmReset = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase() }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep('verify');
                showSuccessToast('Verification code sent to your email!');
            } else {
                setError(data.message || 'Failed to send verification code');
                showErrorToast(data.message || 'Failed to send verification code');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setError('An unexpected error occurred. Please try again.');
            showErrorToast('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError('Please enter the 6-digit verification code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase(), otp }),
            });

            const data = await res.json();

            if (res.ok && data.verified) {
                setStep('reset');
                showSuccessToast('Email verified! Now set your new password.');
            } else {
                setError(data.message || 'Invalid verification code');
                showErrorToast(data.message || 'Invalid verification code');
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            setError('An unexpected error occurred. Please try again.');
            showErrorToast('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        // Validate passwords
        if (!newPassword || !confirmPassword) {
            setError('Please enter and confirm your new password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Check password requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password does not meet the requirements');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.toLowerCase(),
                    otp,
                    newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showSuccessToast('Password reset successfully! You can now login with your new password.');
                onClose();
            } else {
                setError(data.message || 'Failed to reset password');
                showErrorToast(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('An unexpected error occurred. Please try again.');
            showErrorToast('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
                >
                    <FaTimes className="text-lg" />
                </button>

                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                            <FaKey className="text-white text-sm" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {step === 'confirm' && 'Reset Your Password'}
                                {step === 'verify' && 'Verify Your Email'}
                                {step === 'reset' && 'Create New Password'}
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {step === 'confirm' && 'We will send a verification code to your email'}
                                {step === 'verify' && 'Enter the 6-digit code sent to your email'}
                                {step === 'reset' && 'Create a strong new password for your account'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                            <FaExclamationTriangle className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Step 1: Confirm Reset */}
                    {step === 'confirm' && (
                        <div className="space-y-4">
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-yellow-200 text-sm font-medium">
                                            Are you sure you want to reset your password?
                                        </p>
                                        <p className="text-yellow-300 text-xs mt-1">
                                            A verification code will be sent to your email address.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400 text-sm" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmReset}
                                disabled={isLoading || !email.trim()}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        <FaKey className="text-sm" />
                                        Verify Your Account
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 2: Verify OTP */}
                    {step === 'verify' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaEnvelope className="text-white text-xl" />
                                </div>
                                <p className="text-gray-300 text-sm">
                                    We sent a 6-digit verification code to:
                                </p>
                                <p className="text-white font-medium mt-1">{email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-3 text-center">
                                    Enter Verification Code
                                </label>
                                <div className="flex justify-center space-x-2">
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
                                            id={`forgot-otp-${index}`}
                                            className="w-12 h-12 text-center text-white text-lg font-semibold border-2 border-gray-600 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('confirm')}
                                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={isLoading || otp.length !== 6}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 'reset' && (
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="text-sm font-medium text-gray-200 mb-3 flex items-center gap-2">
                                    <FaShieldAlt className="text-green-400" />
                                    Password Requirements
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                                        <FaCheck className={`text-xs ${passwordRequirements.length ? 'opacity-100' : 'opacity-0'}`} />
                                        <span>At least 8 characters long</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                                        <FaCheck className={`text-xs ${passwordRequirements.uppercase ? 'opacity-100' : 'opacity-0'}`} />
                                        <span>One uppercase letter (A-Z)</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                                        <FaCheck className={`text-xs ${passwordRequirements.lowercase ? 'opacity-100' : 'opacity-0'}`} />
                                        <span>One lowercase letter (a-z)</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                                        <FaCheck className={`text-xs ${passwordRequirements.number ? 'opacity-100' : 'opacity-0'}`} />
                                        <span>One number (0-9)</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${passwordRequirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                                        <FaCheck className={`text-xs ${passwordRequirements.special ? 'opacity-100' : 'opacity-0'}`} />
                                        <span>One special character (@$!%*?&)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('verify')}
                                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={isLoading || !allRequirementsMet || newPassword !== confirmPassword}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;