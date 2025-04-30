'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UpdateProduct({ params }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        productType: 'Own',
        affiliateLink: '',
        bulletPoints: [''],
        mainImage: null,
        additionalImages: [],
    });

    useEffect(() => {
        async function fetchProduct() {
            const res = await fetch(`/api/products/${params.id}`);
            const data = await res.json();
            setFormData({
                title: data.title,
                price: data.price,
                description: data.description,
                productType: data.productType,
                affiliateLink: data.affiliateLink || '',
                bulletPoints: data.bulletPoints,
                mainImage: null,
                additionalImages: [],
            });
        }
        fetchProduct();
    }, [params.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            alert('You must be logged in');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('productType', formData.productType);
        data.append('affiliateLink', formData.affiliateLink);
        data.append('bulletPoints', JSON.stringify(formData.bulletPoints));
        if (formData.mainImage) data.append('mainImage', formData.mainImage);
        formData.additionalImages.forEach((img) => data.append('additionalImages', img));

        const res = await fetch(`/api/products/${params.id}`, {
            method: 'PUT',
            body: data,
        });

        if (res.ok) {
            alert('Product updated successfully');
            router.push('/admin-dashboard/shop/all-products');
        } else {
            alert('Failed to update product');
        }
    };

    const handleBulletPointChange = (index, value) => {
        const newBulletPoints = [...formData.bulletPoints];
        newBulletPoints[index] = value;
        setFormData({ ...formData, bulletPoints: newBulletPoints });
    };

    const addBulletPoint = () => {
        setFormData({ ...formData, bulletPoints: [...formData.bulletPoints, ''] });
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Update Product</h1>
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label className="block font-semibold">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Price (BDT)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Product Type</label>
                    <select
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                        className="border rounded w-full p-2"
                    >
                        <option value="Own">Own Website Product</option>
                        <option value="Affiliate">Affiliate/Dropshipping</option>
                    </select>
                </div>
                {formData.productType === 'Affiliate' && (
                    <div className="mb-4">
                        <label className="block font-semibold">Affiliate Link</label>
                        <input
                            type="url"
                            value={formData.affiliateLink}
                            onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block font-semibold">Bullet Points</label>
                    {formData.bulletPoints.map((point, index) => (
                        <input
                            key={index}
                            type="text"
                            value={point}
                            onChange={(e) => handleBulletPointChange(index, e.target.value)}
                            className="border rounded w-full p-2 mb-2"
                        />
                    ))}
                    <button
                        type="button"
                        onClick={addBulletPoint}
                        className="text-blue-500"
                    >
                        + Add Bullet Point
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Main Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, mainImage: e.target.files[0] })}
                        className="border rounded w-full p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Additional Images (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setFormData({ ...formData, additionalImages: Array.from(e.target.files) })}
                        className="border rounded w-full p-2"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update Product
                </button>
            </form>
        </div>
    );
}