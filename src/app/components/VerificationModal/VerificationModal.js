'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

const VerificationForm = ({ userId }) => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setDocument(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!document) return toast.error('Please upload document');

        setLoading(true);
        const formData = new FormData();
        formData.append('file', document);
        formData.append('userId', userId);

        try {
            const res = await fetch('/api/profile/verify', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Verification request sent!');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Something went wrong');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-white">Upload NID/Passport:</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded bg-gray-800 text-white"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Submitting...' : 'Submit Verification'}
            </button>
        </form>
    );
};

export default VerificationForm;
