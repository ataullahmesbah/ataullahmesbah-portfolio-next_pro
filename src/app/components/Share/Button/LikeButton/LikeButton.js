// components/LikeButton.jsx
"use client";
import { useState } from 'react';

export const LikeButton = ({ travelId }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        // Add API call to update like count in database
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${liked ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount > 0 ? likeCount : ''} Like
        </button>
    );
};