'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const AdminVerificationPanel = () => {
    const { data: session } = useSession();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/admin/verification-requests');
                const data = await response.json();
                setRequests(data.requests);
            } catch (error) {
                toast.error('Something went wrong');
            }
        };

        if (session?.user?.role === 'admin') {
            fetchRequests();
        }
    }, [session]);

    const handleVerification = async (userId, status) => {
        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setRequests(requests.filter(request => request.userId !== userId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (session?.user?.role !== 'admin') {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-5 text-center">Verification Requests</h2>
            <div className="space-y-4">
                {requests.map(request => (
                    <div key={request.userId} className="border p-4 rounded-md">
                        <p><strong>User:</strong> {request.userId}</p>
                        <p><strong>Document:</strong> <a href={request.document} target="_blank" rel="noopener noreferrer">View Document</a></p>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => handleVerification(request.userId, 'verified')} className="bg-green-600 text-white py-1 px-3 rounded">
                                Accept
                            </button>
                            <button onClick={() => handleVerification(request.userId, 'not_verified')} className="bg-red-600 text-white py-1 px-3 rounded">
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminVerificationPanel;