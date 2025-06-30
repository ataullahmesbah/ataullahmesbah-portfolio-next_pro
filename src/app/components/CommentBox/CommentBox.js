'use client';

import { useState, useEffect } from 'react';

export default function CommentBox({ blogId }) {
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [commentText, setCommentText] = useState('');
    const [saveInfo, setSaveInfo] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [error, setError] = useState('');
    const [visibleComments, setVisibleComments] = useState(5);
    const [expandedComments, setExpandedComments] = useState({});

    useEffect(() => {
        console.log('Received blogId:', blogId);
        if (!blogId) {
            setError('Blog ID is missing. Cannot submit comments.');
        }
    }, [blogId]);

    useEffect(() => {
        const savedName = localStorage.getItem('commentName');
        const savedEmail = localStorage.getItem('commentEmail');
        if (savedName) setName(savedName);
        if (savedEmail) setEmail(savedEmail);
    }, []);

    useEffect(() => {
        if (blogId) {
            fetchComments();
        }
    }, [blogId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments?blogId=${blogId}`);
            const data = await response.json();
            if (response.ok) {
                setComments(data);
                // Initialize expanded state for all comments
                const expandedState = {};
                data.forEach(comment => {
                    expandedState[comment._id] = false;
                });
                setExpandedComments(expandedState);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to load comments');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!blogId) {
            setError('Blog ID is missing. Cannot submit comments.');
            return;
        }
        if (commentText.length < 10) {
            setError('Comment must be at least 10 characters long');
            return;
        }

        try {
            const payload = {
                blogId,
                name,
                email,
                text: commentText,
                parentCommentId: replyTo?._id
            };
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                setCommentText('');
                setReplyTo(null);
                setError('');
                if (saveInfo) {
                    localStorage.setItem('commentName', name);
                    localStorage.setItem('commentEmail', email);
                }
                fetchComments();
            } else {
                setError(data.error || 'Failed to submit comment');
            }
        } catch (err) {
            setError('Failed to submit comment');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const toggleExpandComment = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const loadMoreComments = () => {
        setVisibleComments(prev => prev + 5);
    };

    const toggleReplies = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 mb-8">
            <h2 className=" amsfonts mb-4">Comments ({comments.length})</h2>
            
            {/* Comment Form */}
            <div className=" p-4 rounded-lg mb-6">
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {replyTo && (
                    <div className="mb-3 text-sm bg-blue-50 p-2 rounded">
                        <span className="text-gray-600">Replying to {replyTo.name}</span>
                        <button 
                            onClick={() => setReplyTo(null)}
                            className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row gap-4 mb-3">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Name*</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Email*</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-1">Comment*</label>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            required
                            minLength={10}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            rows="3"
                            placeholder="Write your comment here..."
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-xs text-gray-600">
                            <input
                                type="checkbox"
                                checked={saveInfo}
                                onChange={(e) => setSaveInfo(e.target.checked)}
                                className="mr-2"
                            />
                            Save my details for next time
                        </label>
                        
                        <button
                            type="submit"
                            className="bg-gray-300 amsfonts text-gray-900 px-4 py-2 rounded text-xs hover:bg-gray-400"
                        >
                            {replyTo ? 'Post Reply' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.slice(0, visibleComments).map((comment) => (
                    <div key={comment._id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mt-1">
                                {comment.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="amsfonts text-xs">{comment.name}</h4>
                                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-sm mt-1">
                                    {comment.text.length > 180 && !expandedComments[comment._id] 
                                        ? `${comment.text.substring(0, 180)}... `
                                        : comment.text}
                                    {comment.text.length > 180 && (
                                        <button 
                                            onClick={() => toggleExpandComment(comment._id)}
                                            className="text-blue-500 hover:text-blue-700 text-xs"
                                        >
                                            {expandedComments[comment._id] ? 'Show less' : 'Read more'}
                                        </button>
                                    )}
                                </p>
                                
                                <div className="flex items-center gap-4 mt-2">
                                    <button
                                        onClick={() => setReplyTo(comment)}
                                        className="text-blue-500 text-xs hover:text-blue-700"
                                    >
                                        Reply
                                    </button>
                                    {comment.replies.length > 0 && (
                                        <button
                                            onClick={() => toggleReplies(comment._id)}
                                            className="text-gray-500 text-xs hover:text-gray-700"
                                        >
                                            {expandedComments[comment._id] 
                                                ? 'Hide replies' 
                                                : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Replies - Hidden by default */}
                        {comment.replies.length > 0 && expandedComments[comment._id] && (
                            <div className="ml-12 mt-4 space-y-4">
                                {comment.replies.map((reply) => (
                                    <div key={reply._id} className="flex items-start gap-3">
                                        <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-1">
                                            {reply.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h5 className="amsfonts text-xs">{reply.name}</h5>
                                                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                            </div>
                                            <p className="text-xs mt-1">
                                                {reply.text.length > 180 && !expandedComments[reply._id] 
                                                    ? `${reply.text.substring(0, 180)}... `
                                                    : reply.text}
                                                {reply.text.length > 180 && (
                                                    <button 
                                                        onClick={() => toggleExpandComment(reply._id)}
                                                        className="text-blue-500 hover:text-blue-700 text-xs"
                                                    >
                                                        {expandedComments[reply._id] ? 'Show less' : 'Read more'}
                                                    </button>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {visibleComments < comments.length && (
                <button
                    onClick={loadMoreComments}
                    className="mt-6 text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                    More Comments ↓
                </button>
            )}
        </div>
    );
}