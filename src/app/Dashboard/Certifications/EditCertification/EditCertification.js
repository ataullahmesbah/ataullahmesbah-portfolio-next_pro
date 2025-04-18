'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import UiLoader from '@/app/components/Loader/UiLoader/UiLoader';


export default function EditCertification({ params }) {
    const { id } = params;
    const [formData, setFormData] = useState({
        niche: '',
        title: '',
        issuer: '',
        credentialId: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'admin') {
            fetchCertification();
        } else if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    const fetchCertification = async () => {
        try {
            const res = await fetch(`/api/certifications?id=${id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch certification');
            }
            const data = await res.json();
            if (data._id) {
                setFormData({
                    niche: data.niche || '',
                    title: data.title || '',
                    issuer: data.issuer || '',
                    credentialId: data.credentialId || '', // Fixed typo: CredentialId → credentialId
                });
            } else {
                throw new Error('Certification not found');
            }
        } catch (error) {
            console.error('Fetch certification error:', error);
            toast.error(error.message || 'Failed to fetch certification');
            router.push('/admin/certifications');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('id', id);
            data.append('niche', formData.niche);
            data.append('title', formData.title);
            data.append('issuer', formData.issuer);
            data.append('credentialId', formData.credentialId);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const res = await fetch('/api/certifications', {
                method: 'PUT',
                body: data,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to update certification');
            }

            toast.success('Certification updated successfully!');
            router.push('/admin/certifications');
        } catch (error) {
            console.error('Update certification error:', error);
            toast.error(error.message || 'Failed to update certification');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <UiLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Edit Certification</h2>

                <div className="mb-4">
                    <label htmlFor="niche" className="block text-sm font-medium text-gray-300">
                        Niche
                    </label>
                    <select
                        id="niche"
                        name="niche"
                        value={formData.niche}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="" disabled>
                            Select niche
                        </option>
                        <option value="SEO">SEO</option>
                        <option value="Developer">Developer</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Content Creation">Content Creation</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="issuer" className="block text-sm font-medium text-gray-300">
                        Issuer
                    </label>
                    <input
                        type="text"
                        id="issuer"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="credentialId" className="block text-sm font-medium text-gray-300">
                        Credential ID (Optional)
                    </label>
                    <input
                        type="text"
                        id="credentialId"
                        name="credentialId"
                        value={formData.credentialId}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                        Certificate Image (Optional)
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? <UiLoader /> : 'Update Certification'}
                </button>
            </form>
        </div>
    );
}