'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function UpdateProduct() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

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
        category: '',
        newCategory: '',
        mainImage: null,
        existingMainImage: '',
        additionalImages: [],
        existingAdditionalImages: [],
        quantity: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState({ mainImage: null, additionalImages: [] });
    const [categories, setCategories] = useState([]);
    const mainImageInputRef = useRef(null);
    const additionalImageInputRefs = useRef([]);

    // Fetch product and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product
                const productRes = await fetch(`/api/products/${productId}`);
                if (!productRes.ok) throw new Error('Failed to fetch product');
                const product = await productRes.json();

                // Fetch categories
                const categoriesRes = await fetch('/api/products?type=categories');
                if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
                const categoriesData = await categoriesRes.json();

                // Set form data
                const bdtPriceObj = product.prices.find((p) => p.currency === 'BDT');
                const usdPriceObj = product.prices.find((p) => p.currency === 'USD');
                const eurPriceObj = product.prices.find((p) => p.currency === 'EUR');

                setFormData({
                    title: product.title || '',
                    bdtPrice: bdtPriceObj?.amount || '',
                    usdPrice: usdPriceObj?.amount || '',
                    eurPrice: eurPriceObj?.amount || '',
                    usdExchangeRate: usdPriceObj?.exchangeRate || '',
                    eurExchangeRate: eurPriceObj?.exchangeRate || '',
                    description: product.description || '',
                    descriptions: product.descriptions.length > 0 ? product.descriptions : [''],
                    bulletPoints: product.bulletPoints.join(', ') || '',
                    productType: product.productType || 'Own',
                    affiliateLink: product.affiliateLink || '',
                    category: product.category?._id || '',
                    newCategory: '',
                    mainImage: null,
                    existingMainImage: product.mainImage || '',
                    additionalImages: [],
                    existingAdditionalImages: product.additionalImages || [],
                    quantity: product.quantity || '',
                });

                setImagePreviews({
                    mainImage: product.mainImage || null,
                    additionalImages: product.additionalImages.map(() => null),
                });

                setCategories(categoriesData);
            } catch (err) {
                setErrors({ general: err.message });
            }
        };

        if (productId) {
            fetchData();
        }
    }, [productId]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.bdtPrice || isNaN(formData.bdtPrice) || formData.bdtPrice <= 0) {
            newErrors.bdtPrice = 'BDT price must be a positive number';
        }
        if (formData.usdPrice && (isNaN(formData.usdPrice) || formData.usdPrice <= 0)) {
            newErrors.usdPrice = 'USD price must be a positive number';
        }
        if (formData.eurPrice && (isNaN(formData.eurPrice) || formData.eurPrice <= 0)) {
            newErrors.eurPrice = 'EUR price must be a positive number';
        }
        if (formData.usdPrice && formData.usdExchangeRate && (isNaN(formData.usdExchangeRate) || formData.usdExchangeRate <= 0)) {
            newErrors.usdExchangeRate = 'USD exchange rate must be a positive number';
        }
        if (formData.eurPrice && formData.eurExchangeRate && (isNaN(formData.eurExchangeRate) || formData.eurExchangeRate <= 0)) {
            newErrors.eurExchangeRate = 'EUR exchange rate must be a positive number';
        }
        if (!formData.description.trim()) newErrors.description = 'Primary description is required';
        if (formData.productType === 'Affiliate' && !formData.affiliateLink.trim()) {
            newErrors.affiliateLink = 'Affiliate link is required';
        } else if (formData.affiliateLink && !/^https?:\/\/.+/.test(formData.affiliateLink)) {
            newErrors.affiliateLink = 'Invalid URL format';
        }
        if (!formData.category && !formData.newCategory.trim()) {
            newErrors.category = 'Category or new category name is required';
        }
        if (formData.newCategory && !/^[a-zA-Z0-9\s&-]+$/.test(formData.newCategory)) {
            newErrors.newCategory = 'Category name can only contain letters, numbers, spaces, &, or -';
        }
        if (!formData.mainImage && !formData.existingMainImage) {
            newErrors.mainImage = 'Main image is required';
        }
        if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
            newErrors.quantity = 'Quantity must be a non-negative integer';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (!session) {
            setErrors({ general: 'You must be logged in' });
            setIsSubmitting(false);
            return;
        }

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('bdtPrice', formData.bdtPrice);
        if (formData.usdPrice) data.append('usdPrice', formData.usdPrice);
        if (formData.eurPrice) data.append('eurPrice', formData.eurPrice);
        if (formData.usdExchangeRate) data.append('usdExchangeRate', formData.usdExchangeRate);
        if (formData.eurExchangeRate) data.append('eurExchangeRate', formData.eurExchangeRate);
        data.append('description', formData.description);
        data.append('descriptions', formData.descriptions.filter((desc) => desc.trim()).join('|||'));
        data.append('bulletPoints', formData.bulletPoints);
        data.append('productType', formData.productType);
        if (formData.affiliateLink) data.append('affiliateLink', formData.affiliateLink);
        if (formData.category && formData.category !== 'new') data.append('category', formData.category);
        if (formData.newCategory) data.append('newCategory', formData.newCategory);
        if (formData.mainImage) data.append('mainImage', formData.mainImage);
        data.append('existingMainImage', formData.existingMainImage);
        formData.additionalImages.forEach((img) => {
            if (img) data.append('additionalImages', img);
        });
        data.append('existingAdditionalImages', JSON.stringify(formData.existingAdditionalImages));
        data.append('quantity', formData.quantity);

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                body: data,
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || 'Failed to update product');
            }

            router.push('/admin-dashboard/shop/all-products');
        } catch (err) {
            setErrors({ general: err.message });
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
        if (formData.additionalImages.length + formData.existingAdditionalImages.length < 5) {
            setFormData({ ...formData, additionalImages: [...formData.additionalImages, null] });
            setImagePreviews({ ...imagePreviews, additionalImages: [...imagePreviews.additionalImages, null] });
        }
    };

    const removeImageInput = (index) => {
        const newImages = formData.additionalImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.additionalImages.filter((_, i) => i !== index);
        setFormData({ ...formData, additionalImages: newImages });
        setImagePreviews({ ...imagePreviews, additionalImages: newPreviews });
        if (additionalImageInputRefs.current[index]) {
            additionalImageInputRefs.current[index].value = null;
        }
    };

    const removeExistingImage = (index) => {
        const newExistingImages = formData.existingAdditionalImages.filter((_, i) => i !== index);
        setFormData({ ...formData, existingAdditionalImages: newExistingImages });
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors({ mainImage: 'Please upload a valid image file' });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ mainImage: 'Image size must be less than 5MB' });
                return;
            }
            setFormData({ ...formData, mainImage: file });
            setImagePreviews({ ...imagePreviews, mainImage: URL.createObjectURL(file) });
            setErrors({ ...errors, mainImage: null });
        }
    };

    const handleAdditionalImageChange = (index, e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors({ [`additionalImage${index}`]: 'Please upload a valid image file' });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ [`additionalImage${index}`]: 'Image size must be less than 5MB' });
                return;
            }
            const newImages = [...formData.additionalImages];
            newImages[index] = file;
            const newPreviews = [...imagePreviews.additionalImages];
            newPreviews[index] = URL.createObjectURL(file);
            setFormData({ ...formData, additionalImages: newImages });
            setImagePreviews({ ...imagePreviews, additionalImages: newPreviews });
            setErrors({ ...errors, [`additionalImage${index}`]: null });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Product</h1>

                {errors.general && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Product Owner</h2>
                    <p className="text-sm text-gray-500">Logged in as</p>
                    <p className="font-medium text-gray-800">{session?.user?.name || 'Not available'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title*</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter product title"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity*</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter quantity"
                                min="0"
                                step="1"
                            />
                            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                        newCategory: e.target.value === 'new' ? formData.newCategory : '',
                                    })
                                }
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                                <option value="new">Add New Category</option>
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                            {formData.category === 'new' && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={formData.newCategory}
                                        onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.newCategory ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter new category name"
                                    />
                                    {errors.newCategory && <p className="mt-1 text-sm text-red-500">{errors.newCategory}</p>}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">BDT Price*</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">৳</span>
                                    <input
                                        type="number"
                                        value={formData.bdtPrice}
                                        onChange={(e) => setFormData({ ...formData, bdtPrice: e.target.value })}
                                        className={`w-full pl-8 pr-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.bdtPrice ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                {errors.bdtPrice && <p className="mt-1 text-sm text-red-500">{errors.bdtPrice}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">USD Price</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={formData.usdPrice}
                                        onChange={(e) => setFormData({ ...formData, usdPrice: e.target.value })}
                                        className={`w-full pl-8 pr-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.usdPrice ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                {errors.usdPrice && <p className="mt-1 text-sm text-red-500">{errors.usdPrice}</p>}
                                {formData.usdPrice && (
                                    <div className="mt-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Exchange Rate (1 USD = ? BDT)</label>
                                        <input
                                            type="number"
                                            value={formData.usdExchangeRate}
                                            onChange={(e) => setFormData({ ...formData, usdExchangeRate: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.usdExchangeRate ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                        />
                                        {errors.usdExchangeRate && <p className="mt-1 text-sm text-red-500">{errors.usdExchangeRate}</p>}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">EUR Price</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">€</span>
                                    <input
                                        type="number"
                                        value={formData.eurPrice}
                                        onChange={(e) => setFormData({ ...formData, eurPrice: e.target.value })}
                                        className={`w-full pl-8 pr-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.eurPrice ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                {errors.eurPrice && <p className="mt-1 text-sm text-red-500">{errors.eurPrice}</p>}
                                {formData.eurPrice && (
                                    <div className="mt-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Exchange Rate (1 EUR = ? BDT)</label>
                                        <input
                                            type="number"
                                            value={formData.eurExchangeRate}
                                            onChange={(e) => setFormData({ ...formData, eurExchangeRate: e.target.value })}
                                            className={`w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.eurExchangeRate ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                        />
                                        {errors.eurExchangeRate && <p className="mt-1 text-sm text-red-500">{errors.eurExchangeRate}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Description*</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Describe your product"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Descriptions</label>
                            {formData.descriptions.map((desc, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <textarea
                                        value={desc}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`Additional description ${index + 1}`}
                                    />
                                    {formData.descriptions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDescription(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDescription}
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                                + Add More Description
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points (comma-separated)</label>
                            <textarea
                                value={formData.bulletPoints}
                                onChange={(e) => setFormData({ ...formData, bulletPoints: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Feature 1, Feature 2, Feature 3"
                            />
                            <div className="mt-2">
                                <p className="text-xs text-gray-500">Preview:</p>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                    {formData.bulletPoints.split(',').filter(Boolean).map((point, i) => (
                                        <div key={i} className="flex items-start mb-1">
                                            <span className="mr-2">•</span>
                                            <span>{point.trim()}</span>
                                        </div>
                                    ))}
                                    {!formData.bulletPoints && <p className="text-gray-500">No bullet points added</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Type */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Product Type*</label>
                            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="Own"
                                        checked={formData.productType === 'Own'}
                                        onChange={() => setFormData({ ...formData, productType: 'Own', affiliateLink: '' })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700">Own Product</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="Affiliate"
                                        checked={formData.productType === 'Affiliate'}
                                        onChange={() => setFormData({ ...formData, productType: 'Affiliate' })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700">Affiliate Product</span>
                                </label>
                            </div>
                        </div>

                        {formData.productType === 'Affiliate' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate Link*</label>
                                <input
                                    type="url"
                                    value={formData.affiliateLink}
                                    onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.affiliateLink ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="https://example.com/affiliate"
                                />
                                {errors.affiliateLink && <p className="mt-1 text-sm text-red-500">{errors.affiliateLink}</p>}
                            </div>
                        )}
                    </div>

                    {/* Images */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image*</label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={mainImageInputRef}
                                onChange={handleMainImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.mainImage && <p className="mt-1 text-sm text-red-500">{errors.mainImage}</p>}
                            {imagePreviews.mainImage && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                    <Image
                                        src={imagePreviews.mainImage}
                                        alt="Main image preview"
                                        width={150}
                                        height={150}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (max 5)</label>
                            {formData.existingAdditionalImages.map((img, index) => (
                                <div key={`existing-${index}`} className="flex items-center mb-4">
                                    <Image
                                        src={img}
                                        alt={`Existing additional image ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="rounded-lg object-cover mr-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {formData.additionalImages.map((img, index) => (
                                <div key={index} className="flex items-center mb-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={(el) => (additionalImageInputRefs.current[index] = el)}
                                        onChange={(e) => handleAdditionalImageChange(index, e)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImageInput(index)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                    {errors[`additionalImage${index}`] && (
                                        <p className="mt-1 text-sm text-red-500">{errors[`additionalImage${index}`]}</p>
                                    )}
                                    {imagePreviews.additionalImages[index] && (
                                        <div className="mt-2">
                                            <Image
                                                src={imagePreviews.additionalImages[index]}
                                                alt={`Additional image ${index + 1} preview`}
                                                width={100}
                                                height={100}
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {formData.additionalImages.length + formData.existingAdditionalImages.length < 5 && (
                                <button
                                    type="button"
                                    onClick={addImageInput}
                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                >
                                    + Add Image
                                </button>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                {formData.additionalImages.length + formData.existingAdditionalImages.length > 0
                                    ? `${formData.additionalImages.length + formData.existingAdditionalImages.length} image(s) selected`
                                    : 'No additional images selected'}
                            </p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full px-6 py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Updating Product...
                                </span>
                            ) : (
                                'Update Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}