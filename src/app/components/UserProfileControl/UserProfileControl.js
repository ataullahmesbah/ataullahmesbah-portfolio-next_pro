'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const AdminVerificationPanel = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch('/api/admin/verification-requests')
            .then((res) => res.json())
            .then((data) => setRequests(data));
    }, []);

    const handleStatus = async (userId, status) => {
        await fetch('/api/admin/verification-requests', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status }),
        });
        setRequests((prev) =>
            prev.filter((request) => request.userId !== userId)
        );
    };

    return (
        <div>
            {requests.map((request) => (
                <div key={request.userId} className="bg-gray-700 p-4 rounded mb-4">
                    <p>Name: {request.userId}</p>
                    <Image
                        src={request.verificationImage}
                        alt='Document'
                        width={400}
                        height={300} />
                    <div>
                        <button onClick={() => handleStatus(request.userId, 'accepted')} className="bg-green-500 p-2 rounded">
                            Accept
                        </button>
                        <button onClick={() => handleStatus(request.userId, 'rejected')} className="bg-red-500 p-2 rounded ml-4">
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminVerificationPanel;
