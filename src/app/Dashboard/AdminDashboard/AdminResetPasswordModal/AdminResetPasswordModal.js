// app/AdminResetPasswordModal/AdminResetPasswordModal.js
'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaKey, FaEye, FaEyeSlash, FaShieldAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { showSuccessToast, showErrorToast } from '@/app/components/Share/toastConfig/toastConfig';

const AdminResetPasswordModal = ({ isOpen, onClose, user, onSuccess }) => {
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

    // Reset modal when closed or user changes
    useEffect(() => {
        if (!isOpen) {
            setNewPassword('');
            setConfirmPassword('');
            setError('');
        }
    }, [isOpen, user]);

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
        } else {
            setPasswordRequirements({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false
            });
        }
    }, [newPassword]);

    const handleResetPassword = async () => {
        // Validate passwords
        if (!newPassword || !confirmPassword) {
            setError('Please enter and confirm the new password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Check password requirements
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password does not meet all requirements');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showSuccessToast(`Password reset successfully for ${user.username}! User will be logged out.`);
                onSuccess();
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

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
                >
                    <FaTimes className="text-lg" />
                </button>

                {/* Modal Header */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl">
                            <FaKey className="text-white text-lg" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Reset Password
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                For user: <span className="text-white font-medium">{user.username}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Warning Message */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-yellow-200 text-sm font-medium">
                                    Security Notice
                                </p>
                                <p className="text-yellow-300 text-xs mt-1">
                                    User will be automatically logged out from all devices after password reset.
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                            <FaExclamationTriangle className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

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
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 transition-all duration-200"
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
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 transition-all duration-200"
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

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetPassword}
                                disabled={isLoading || !allRequirementsMet || newPassword !== confirmPassword}
                                className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <FaKey className="text-sm" />
                                        Reset Password
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminResetPasswordModal;