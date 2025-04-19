'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import UiLoader from '@/app/components/Loader/UiLoader/UiLoader';


export default function AllCertifications() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [certifications, setCertifications] = useState([]);
    const [filteredCertifications, setFilteredCertifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'admin') {
            fetchCertifications();
        } else if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    const fetchCertifications = async () => {
        try {
            const res = await fetch('/api/certifications');
            if (!res.ok) {
                throw new Error('Failed to fetch certifications');
            }
            const data = await res.json();
            setCertifications(data);
            setFilteredCertifications(data);
        } catch (error) {
            console.error('Fetch certifications error:', error);
            toast.error('Failed to fetch certifications');
            setCertifications([]);
            setFilteredCertifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = certifications.filter((cert) =>
            cert.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCertifications(filtered);
    }, [searchTerm, certifications]);

    const deleteCertification = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this certification?');
        if (!confirmDelete) return;

        try {
            const res = await fetch('/api/certifications', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to delete certification');
            }

            toast.success('Certification deleted successfully!');
            fetchCertifications();
        } catch (error) {
            console.error('Delete certification error:', error);
            toast.error(error.message || 'Failed to delete certification');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <UiLoader />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-800 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-white">All Award - Certification</h1>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link
                            href="/admin-dashboard/certification/add-certification"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add Certification
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-700">
                                {filteredCertifications.length > 0 ? (
                                    filteredCertifications.map((cert) => (
                                        <tr key={cert._id} className="hover:bg-gray-800">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                {cert.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex gap-2">
                                                <Link
                                                    href={`/admin-dashboard/certification/edit/${cert._id}`}
                                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 text-sm"
                                                >
                                                    <FaEdit className="text-xs" /> Update
                                                </Link>
                                                <button
                                                    onClick={() => deleteCertification(cert._id)}
                                                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1 text-sm"
                                                >
                                                    <FaTrash className="text-xs" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="2"
                                            className="px-6 py-4 text-center text-sm text-gray-400"
                                        >
                                            No certifications found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}