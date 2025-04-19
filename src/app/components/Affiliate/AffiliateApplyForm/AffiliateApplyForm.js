'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AffiliateApplyForm({ onApply }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/affiliate/apply', { method: 'POST' });
            const data = await res.json();
            console.log('Apply response:', data); // Debug response
            if (res.ok) {
                toast.success('Affiliate request submitted!');
                onApply();
            } else {
                toast.error(data.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Apply form error:', error);
            toast.error('Error submitting request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-white">Apply for Affiliate Program</h2>
            <p className="text-gray-300 mb-4">Join our affiliate program and earn 8% commission on every sale!</p>
            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Submitting...' : 'Apply Now'}
            </button>
        </form>
    );
}