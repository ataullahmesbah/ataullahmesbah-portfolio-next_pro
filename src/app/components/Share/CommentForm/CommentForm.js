

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CommentForm = ({ blogSlug }) => {
    const [comment, setComment] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('next-auth.token'); // Get the token from local storage
            if (!token) {
                router.push('/login'); // Redirect to login if not authenticated
                return;
            }

            const response = await fetch(`/api/blog/${blogSlug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment }),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            setComment('');
            router.refresh(); // Refresh the page to show the new comment
        } catch (err) {

            alert('Failed to add comment');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-2 border rounded-lg mb-4"
                required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Submit
            </button>
        </form>
    );
};

export default CommentForm;