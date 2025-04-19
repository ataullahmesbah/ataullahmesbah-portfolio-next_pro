'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import UiLoader from '@/app/components/Loader/UiLoader/UiLoader';


export default function AddCertificationForm() {
    const [formData, setFormData] = useState({
        niche: '',
        title: '',
        issuer: '',
        credentialId: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
            // Validate form data
            if (!formData.niche || !formData.title || !formData.issuer) {
                throw new Error('Please fill all required fields');
            }
            if (!formData.image) {
                throw new Error('Please upload a certificate image');
            }

            const data = new FormData();
            data.append('niche', formData.niche);
            data.append('title', formData.title);
            data.append('issuer', formData.issuer);
            data.append('credentialId', formData.credentialId);
            data.append('image', formData.image);

            // Log FormData for debugging
            console.log('Submitting FormData:', {
                niche: formData.niche,
                title: formData.title,
                issuer: formData.issuer,
                credentialId: formData.credentialId,
                image: formData.image.name,
            });

            const res = await fetch('/api/certifications', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) {
                const error = await res.json();
                console.error('API error response:', error);
                throw new Error(error.message || 'Failed to add certification');
            }

            const result = await res.json();
            console.log('API success response:', result);

            toast.success('Certification added successfully!');
            router.push('/admin-dashboard/certification/all-certifications');
        } catch (error) {
            console.error('Add certification error:', error);
            toast.error(error.message || 'Failed to add certification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Add Certification</h2>

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
                        Certificate Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? <UiLoader /> : 'Add Certification'}
                </button>
            </form>
        </div>
    );
}