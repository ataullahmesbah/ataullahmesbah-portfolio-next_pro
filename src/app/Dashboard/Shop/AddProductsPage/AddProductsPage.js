'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddProduct() {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        bdtPrice: '',
        usdPrice: '',
        eurPrice: '',
        usdExchangeRate: '',
        eurExchangeRate: '',
        description: '',
        descriptions: [''],
        bulletPoints: '',
        productType: 'Own',
        affiliateLink: '',
        mainImage: null,
        additionalImages: [], // Initialize as empty array
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Basic validation
        if (!formData.title || !formData.bdtPrice || !formData.description || !formData.mainImage) {
            setError('Please fill all required fields');
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('bdtPrice', formData.bdtPrice);
        data.append('description', formData.description);
        data.append('productType', formData.productType);
        data.append('bulletPoints', formData.bulletPoints);
        data.append('mainImage', formData.mainImage);

        // Only append if exists
        if (formData.usdPrice) data.append('usdPrice', formData.usdPrice);
        if (formData.eurPrice) data.append('eurPrice', formData.eurPrice);
        if (formData.affiliateLink) data.append('affiliateLink', formData.affiliateLink);

        // Add additional images
        formData.additionalImages.forEach(img => {
            if (img) data.append('additionalImages', img);
        });

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                body: data,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to add product');
            }

            router.push('/admin/products');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDescriptionChange = (index, value) => {
        const newDescriptions = [...formData.descriptions];
        newDescriptions[index] = value;
        setFormData({ ...formData, descriptions: newDescriptions });
    };

    const addDescription = () => {
        setFormData({ ...formData, descriptions: [...formData.descriptions, ''] });
    };

    const removeDescription = (index) => {
        const newDescriptions = formData.descriptions.filter((_, i) => i !== index);
        setFormData({ ...formData, descriptions: newDescriptions.length ? newDescriptions : [''] });
    };

    const addImageInput = () => {
        if (formData.additionalImages.length < 5) {
            setFormData({ ...formData, additionalImages: [...formData.additionalImages, null] });
        }
    };

    const removeImageInput = (index) => {
        const newImages = formData.additionalImages.filter((_, i) => i !== index);
        setFormData({ ...formData, additionalImages: newImages });
    };

    const handleImageChange = (index, file) => {
        const newImages = [...formData.additionalImages];
        newImages[index] = file;
        setFormData({ ...formData, additionalImages: newImages });
    };

    return (
        <div className="bg-gray-800 min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Add New Product</h1>

                <div className="bg-gray-700 rounded-lg shadow-lg p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Owner Info */}
                    <div className="mb-8 p-4 bg-gray-600 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-300 mb-3">Product Owner</h2>
                        <div>
                            <p className="text-sm text-gray-400">Logged in as</p>
                            <p className="font-medium text-white">{session?.user?.name || 'Not available'}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Title*</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Price Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">BDT Price*</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">৳</span>
                                        <input
                                            type="number"
                                            value={formData.bdtPrice}
                                            onChange={(e) => setFormData({ ...formData, bdtPrice: e.target.value })}
                                            className="w-full pl-8 pr-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">USD Price</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={formData.usdPrice}
                                            onChange={(e) => setFormData({ ...formData, usdPrice: e.target.value })}
                                            className="w-full pl-8 pr-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    {formData.usdPrice && (
                                        <div className="mt-2">
                                            <label className="block text-xs text-gray-400 mb-1">Exchange Rate (1 USD = ? BDT)</label>
                                            <input
                                                type="number"
                                                value={formData.usdExchangeRate}
                                                onChange={(e) => setFormData({ ...formData, usdExchangeRate: e.target.value })}
                                                className="w-full px-3 py-1 text-xs bg-gray-600 border border-gray-500 rounded-md text-white"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">EUR Price</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">€</span>
                                        <input
                                            type="number"
                                            value={formData.eurPrice}
                                            onChange={(e) => setFormData({ ...formData, eurPrice: e.target.value })}
                                            className="w-full pl-8 pr-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    {formData.eurPrice && (
                                        <div className="mt-2">
                                            <label className="block text-xs text-gray-400 mb-1">Exchange Rate (1 EUR = ? BDT)</label>
                                            <input
                                                type="number"
                                                value={formData.eurExchangeRate}
                                                onChange={(e) => setFormData({ ...formData, eurExchangeRate: e.target.value })}
                                                className="w-full px-3 py-1 text-xs bg-gray-600 border border-gray-500 rounded-md text-white"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Description*</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Descriptions</label>
                                {formData.descriptions.map((desc, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <textarea
                                            value={desc}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {formData.descriptions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDescription(index)}
                                                className="ml-2 text-red-500"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addDescription}
                                    className="text-blue-500"
                                >
                                    + Add More Description
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Bullet Points (comma separated)</label>
                                <textarea
                                    value={formData.bulletPoints}
                                    onChange={(e) => setFormData({ ...formData, bulletPoints: e.target.value })}
                                    placeholder="Feature 1, Feature 2, Feature 3"
                                    rows={3}
                                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="mt-2">
                                    <p className="text-xs text-gray-400">Preview:</p>
                                    <div className="mt-1 p-2 bg-gray-600 rounded-md text-sm text-gray-300">
                                        {formData.bulletPoints.split(',').filter(Boolean).map((point, i) => (
                                            <div key={i} className="flex items-start mb-1">
                                                <span className="mr-2">•</span>
                                                <span>{point.trim()}</span>
                                            </div>
                                        ))}
                                        {!formData.bulletPoints && (
                                            <p className="text-gray-500">No bullet points added yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Type */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">Product Type*</label>
                                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="Own"
                                            checked={formData.productType === 'Own'}
                                            onChange={() => setFormData({ ...formData, productType: 'Own' })}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500"
                                        />
                                        <span className="ml-2 text-gray-300">Own Product</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            value="Affiliate"
                                            checked={formData.productType === 'Affiliate'}
                                            onChange={() => setFormData({ ...formData, productType: 'Affiliate' })}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500"
                                        />
                                        <span className="ml-2 text-gray-300">Affiliate Product</span>
                                    </label>
                                </div>
                            </div>

                            {formData.productType === 'Affiliate' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Affiliate Link*</label>
                                    <input
                                        type="url"
                                        value={formData.affiliateLink}
                                        onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                                        required={formData.productType === 'Affiliate'}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Main Image*</label>
                                // For main image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFormData({ ...formData, mainImage: e.target.files[0] });
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Images (max 5)</label>
                                // For additional images
                                {formData.additionalImages.map((img, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const newImages = [...formData.additionalImages];
                                                newImages[index] = e.target.files[0];
                                                setFormData({ ...formData, additionalImages: newImages });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImageInput(index)}
                                            className="ml-2 text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {formData.additionalImages.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={addImageInput}
                                        className="text-blue-500"
                                    >
                                        + Add Image
                                    </button>
                                )}
                                <p className="mt-2 text-xs text-gray-400">
                                    {formData.additionalImages.length > 0
                                        ? `${formData.additionalImages.length} image(s) selected`
                                        : 'No additional images selected'}
                                </p>
                            </div>
                        </ div >

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-6 py-3 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Adding Product...
                                    </span>
                                ) : (
                                    'Add Product'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}