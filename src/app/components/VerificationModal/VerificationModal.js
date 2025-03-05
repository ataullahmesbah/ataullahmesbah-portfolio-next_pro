'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

const VerificationModal = ({ closeModal }) => {
    const [nidPassport, setNidPassport] = useState(null);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("nidPassport", nidPassport);

        const res = await fetch('/api/profile/verification', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            toast.success("Verification Request Submitted");
            closeModal();
        } else {
            toast.error("Submission Failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Submit Documents</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNidPassport(e.target.files[0])}
                />
                <button onClick={handleSubmit} className="bg-blue-600 text-white mt-4 p-2 rounded-lg">
                    Submit
                </button>
                <button onClick={closeModal} className="text-red-500 ml-4">Cancel</button>
            </div>
        </div>
    );
};
export default VerificationModal;
