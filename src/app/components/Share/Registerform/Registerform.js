'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      toast.success('OTP sent to your email!');
      setStep('verify'); // Move to OTP verification step
    } else {
      const data = await res.json();
      setError(data.message || 'Registration failed');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      toast.success('OTP verified successfully!');
      router.push('/login'); // Redirect to login page after successful verification
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to verify OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  ">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-sm">

        {step === 'register' ? (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-400 rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-400 rounded-md"
              required
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-400 rounded-md"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Register
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
                  onChange={(e) => {
                    const newOtp = otp.split('');
                    newOtp[index] = e.target.value;
                    setOtp(newOtp.join(''));
                    if (e.target.value && index < 5) {
                      document.getElementById(`otp-${index + 1}`).focus();
                    }
                  }}
                  id={`otp-${index}`}
                  className="w-12 h-12 text-center border text-black border-gray-500 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
}