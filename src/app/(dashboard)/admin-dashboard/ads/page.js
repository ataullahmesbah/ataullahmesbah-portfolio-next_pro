// app/admin/ads/page.js
'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage, FaCalendar, FaClock } from 'react-icons/fa';

export default function AdminAdsPage() {
    const [ads, setAds] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        buttonText: 'Shop Now',
        buttonLink: '',
        couponCode: '',
        autoCloseDelay: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
        backgroundColor: '#7C3AED',
        textColor: '#FFFFFF',
        buttonColor: '#F59E0B',
        priority: 1
    });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const res = await fetch('/api/admin/ads');
            const data = await res.json();
            setAds(data);
        } catch (error) {
            console.error('Failed to fetch ads:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingAd ? `/api/admin/ads/${editingAd._id}` : '/api/admin/ads';
            const method = editingAd ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowForm(false);
                setEditingAd(null);
                setFormData({
                    title: '',
                    description: '',
                    image: '',
                    buttonText: 'Shop Now',
                    buttonLink: '',
                    couponCode: '',
                    autoCloseDelay: 10,
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: '',
                    isActive: true,
                    backgroundColor: '#7C3AED',
                    textColor: '#FFFFFF',
                    buttonColor: '#F59E0B',
                    priority: 1
                });
                fetchAds();
            }
        } catch (error) {
            console.error('Failed to save ad:', error);
        }
    };

    const handleDelete = async (adId) => {
        if (confirm('Are you sure you want to delete this ad?')) {
            try {
                await fetch(`/api/admin/ads/${adId}`, { method: 'DELETE' });
                fetchAds();
            } catch (error) {
                console.error('Failed to delete ad:', error);
            }
        }
    };

    const handleEdit = (ad) => {
        setEditingAd(ad);
        setFormData({
            title: ad.title || '',
            description: ad.description || '',
            image: ad.image || '',
            buttonText: ad.buttonText || 'Shop Now',
            buttonLink: ad.buttonLink || '',
            couponCode: ad.couponCode || '',
            autoCloseDelay: ad.autoCloseDelay || 10,
            startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '',
            isActive: ad.isActive,
            backgroundColor: ad.backgroundColor || '#7C3AED',
            textColor: ad.textColor || '#FFFFFF',
            buttonColor: ad.buttonColor || '#F59E0B',
            priority: ad.priority || 1
        });
        setShowForm(true);
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Ads Management</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaPlus /> Create New Ad
                    </button>
                </div>

                {/* Ads List */}
                <div className="grid gap-6">
                    {ads.map(ad => (
                        <div key={ad._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    {ad.image && (
                                        <img
                                            src={ad.image}
                                            alt={ad.title}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {ad.title || 'No Title'}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-xs ${ad.isActive ? 'bg-green-500' : 'bg-red-500'
                                                }`}>
                                                {ad.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-2">{ad.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <FaClock />
                                                <span>{ad.autoCloseDelay}s auto-close</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaCalendar />
                                                <span>
                                                    {new Date(ad.startDate).toLocaleDateString()}
                                                    {ad.endDate && ` - ${new Date(ad.endDate).toLocaleDateString()}`}
                                                </span>
                                            </div>
                                            <div>
                                                <span>Priority: {ad.priority}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-sm text-gray-400">
                                                Impressions: {ad.impressions} | Clicks: {ad.clicks}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(ad)}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                    >
                                        <FaEdit className="text-white" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad._id)}
                                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                                    >
                                        <FaTrash className="text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold text-white mb-4">
                                {editingAd ? 'Edit Ad' : 'Create New Ad'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Title (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                            placeholder="Enter ad title"
                                        />
                                    </div>

                                    {/* Button Text */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Button Text
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.buttonText}
                                            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                            placeholder="Shop Now"
                                        />
                                    </div>

                                    {/* Image URL */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Image URL (Optional) - Use Cloudinary
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                            placeholder="https://res.cloudinary.com/..."
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                            placeholder="Enter ad description"
                                        />
                                    </div>

                                    {/* Button Link */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Button Link (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.buttonLink}
                                            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    {/* Coupon Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Coupon Code (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.couponCode}
                                            onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                            placeholder="SUMMER20"
                                        />
                                    </div>

                                    {/* Auto Close Delay */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Auto Close (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            min="5"
                                            max="60"
                                            value={formData.autoCloseDelay}
                                            onChange={(e) => setFormData({ ...formData, autoCloseDelay: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Priority (1-10)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        />
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        />
                                    </div>

                                    {/* Colors */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Background Color
                                        </label>
                                        <input
                                            type="color"
                                            value={formData.backgroundColor}
                                            onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                            className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Button Color
                                        </label>
                                        <input
                                            type="color"
                                            value={formData.buttonColor}
                                            onChange={(e) => setFormData({ ...formData, buttonColor: e.target.value })}
                                            className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Active Switch */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-gray-300">
                                        Active
                                    </label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingAd(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        {editingAd ? 'Update Ad' : 'Create Ad'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}