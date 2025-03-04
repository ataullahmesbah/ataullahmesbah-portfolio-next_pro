'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

const VerificationModal = ({ setShowModal }) => {
    const [name, setName] = useState('');
    const [birth, setBirth] = useState('');
    const [document, setDocument] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('birth', birth);
        formData.append('document', document);

        const res = await fetch('/api/verificationRequest', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.success) {
            toast.success('Verification Request Submitted!');
            setShowModal(false);
        } else {
            toast.error(data.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-96">
                <h2 className="text-xl font-bold mb-4">Get Verified</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded mb-3"
                        required
                    />
                    <input
                        type="date"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                        className="w-full p-2 border rounded mb-3"
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setDocument(e.target.files[0])}
                        className="w-full p-2 border rounded mb-3"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                </form>
                <button onClick={() => setShowModal(false)} className="mt-3 text-red-500">
                    Close
                </button>
            </div>
        </div>
    );
};

export default VerificationModal;
