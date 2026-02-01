// app/components/ModeratorComments.jsx - NEW FILE
'use client';
import { useState, useEffect } from 'react';
import { FiCheck, FiClock, FiUser, FiMail, FiFileText, FiChevronDown } from 'react-icons/fi';

export default function ModeratorComments() {
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingComments, setPendingComments] = useState([]);
    const [approvedComments, setApprovedComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedComments, setExpandedComments] = useState({});

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError('');

            let endpoint, method;

            if (activeTab === 'pending') {
                endpoint = '/api/comments/moderator';
                method = 'GET';
            } else {
                endpoint = '/api/comments/moderator';
                method = 'POST'; // Using POST for approved comments
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            const data = await response.json();

            if (activeTab === 'pending') {
                setPendingComments(data);
            } else {
                setApprovedComments(data);
            }
        } catch (err) {
            setError(err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (commentId, replyId = null) => {
        try {
            setError('');

            const response = await fetch('/api/comments/moderator', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentId, replyId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to approve');
            }

            // Refetch comments after successful approval
            await fetchComments();
        } catch (err) {
            setError(err.message);
            console.error('Approve error:', err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [activeTab]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const toggleCommentExpansion = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const currentComments = activeTab === 'pending' ? pendingComments : approvedComments;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Moderator Comments Management</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        You can approve comments and replies. Delete function is restricted to admin only.
                    </p>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <FiClock className="mr-2" />
                            Pending Approval
                            {pendingComments.length > 0 && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {pendingComments.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('approved')}
                            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <FiCheck className="mr-2" />
                            Approved Comments
                        </button>
                    </nav>
                </div>

                <div className="bg-gray-50 p-6">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : currentComments.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} comments</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === 'pending'
                                    ? 'All comments have been moderated'
                                    : 'No comments have been approved yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {currentComments.map((comment) => (
                                <div key={comment._id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="p-4 sm:p-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                                                <FiUser className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">{comment.name}</h4>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <p className="text-xs text-gray-500 flex items-center">
                                                                <FiMail className="mr-1" /> {comment.email}
                                                            </p>
                                                            <p className="text-xs text-gray-500 flex items-center">
                                                                <FiFileText className="mr-1" /> Blog: {comment.blogTitle || `ID: ${comment.blogId}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(comment.createdAt)}
                                                    </div>
                                                </div>

                                                <div className="mt-3 text-sm text-gray-700">
                                                    <p>{comment.text}</p>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    {comment.replies.length > 0 && (
                                                        <button
                                                            onClick={() => toggleCommentExpansion(comment._id)}
                                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                                        >
                                                            {expandedComments[comment._id] ? 'Hide replies' : `Show replies (${comment.replies.length})`}
                                                            <FiChevronDown className={`ml-1 transition-transform ${expandedComments[comment._id] ? 'transform rotate-180' : ''}`} />
                                                        </button>
                                                    )}

                                                    <div className="flex space-x-2">
                                                        {/* Show Approve button only in Pending tab */}
                                                        {activeTab === 'pending' && (
                                                            <button
                                                                onClick={() => handleApprove(comment._id)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                            >
                                                                <FiCheck className="mr-1" /> Approve
                                                            </button>
                                                        )}
                                                        {/* ❌ Delete button removed for moderator */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Replies Section */}
                                        {expandedComments[comment._id] && comment.replies.length > 0 && (
                                            <div className="mt-6 ml-12 space-y-4">
                                                {comment.replies.map((reply) => (
                                                    <div key={reply._id} className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 bg-gray-200 rounded-full p-2">
                                                                <FiUser className="h-5 w-5 text-gray-600" />
                                                            </div>
                                                            <div className="ml-3 flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-900">{reply.name}</h4>
                                                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                                            <FiMail className="mr-1" /> {reply.email}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {formatDate(reply.createdAt)}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-2 text-sm text-gray-700">
                                                                    <p>{reply.text}</p>
                                                                </div>

                                                                <div className="mt-3 flex justify-end space-x-2">
                                                                    {/* Show Approve button only for pending replies */}
                                                                    {activeTab === 'pending' && !reply.isApproved && (
                                                                        <button
                                                                            onClick={() => handleApprove(comment._id, reply._id)}
                                                                            className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                        >
                                                                            <FiCheck className="mr-1" /> Approve
                                                                        </button>
                                                                    )}
                                                                    {/* ❌ Delete button removed for moderator */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}