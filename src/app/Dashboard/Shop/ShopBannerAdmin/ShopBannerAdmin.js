'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const ShopBannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    highlights: [''],
    cta: '',
    bg: '',
    textColor: '',
    badgeColor: '',
    features: [{ icon: '', text: '' }],
    image: '',
    link: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/products/shop-banner');
      const data = await response.json();
      if (data.success) setBanners(data.data);
      else setError(data.error || 'Failed to fetch banners');
    } catch (err) {
      setError('Network error while fetching banners');
    }
  };

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === 'highlight') {
      const newHighlights = [...formData.highlights];
      newHighlights[index] = value;
      setFormData({ ...formData, highlights: newHighlights });
    } else if (type === 'feature') {
      const newFeatures = [...formData.features];
      newFeatures[index][name] = value;
      setFormData({ ...formData, features: newFeatures });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addHighlight = () => setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  const addFeature = () => setFormData({ ...formData, features: [{ icon: '', text: '' }] });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('No file selected');
      return;
    }
    setImageFile(file);
    setError(null);
    setUploading(true);

    // Log environment variables for debugging
    console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log('Upload Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      setError('Cloudinary configuration missing. Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET are set in .env');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append('fetch_format', 'webp');
    formData.append('quality', 'auto');
    formData.append('width', '1920');
    formData.append('height', '1080');
    formData.append('crop', 'fill');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Cloudinary upload failed');
      }
      const data = await response.json();
      setFormData({ ...formData, image: data.secure_url });
    } catch (err) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title &&
      formData.subtitle &&
      formData.highlights.every((h) => h) &&
      formData.cta &&
      formData.bg &&
      formData.textColor &&
      formData.badgeColor &&
      formData.features.every((f) => f.icon && f.text) &&
      formData.image &&
      formData.link
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid()) {
      setError('Please fill all required fields, including the image');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const body = editingId ? { ...formData, id: editingId } : formData;

    try {
      const response = await fetch('/api/products/shop-banner', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save banner');
      }
      await fetchBanners();
      setFormData({
        title: '',
        subtitle: '',
        highlights: [''],
        cta: '',
        bg: '',
        textColor: '',
        badgeColor: '',
        features: [{ icon: '', text: '' }],
        image: '',
        link: '',
      });
      setEditingId(null);
      setImageFile(null);
    } catch (err) {
      setError(`Save failed: ${err.message}`);
    }
  };

  const handleEdit = (banner) => {
    setFormData(banner);
    setEditingId(banner._id);
    setError(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Shop Banners</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {uploading && <div className="text-blue-500 mb-4">Uploading image to Cloudinary...</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <label className="block text-sm font-medium">Title (Main heading in hero section)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g., Elite Member Exclusive"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subtitle (Subheading below title)</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g., Enjoy special privileges with Team Mesbah membership"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Highlights (Promo badges above title)</label>
          {formData.highlights.map((highlight, index) => (
            <input
              key={index}
              type="text"
              value={highlight}
              onChange={(e) => handleInputChange(e, index, 'highlight')}
              placeholder={`e.g., ${['FREE Shipping on Orders Over ৳2000', 'Early Access to New Collections', 'Members-Only Discounts'][index] || 'Enter highlight text'}`}
              className="w-full p-2 border rounded mb-2"
              required
            />
          ))}
          <button type="button" onClick={addHighlight} className="text-blue-600">
            Add Another Highlight
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium">CTA (Call-to-action button text)</label>
          <input
            type="text"
            name="cta"
            value={formData.cta}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g., Join Now"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Background (CSS class for background gradient)</label>
          <input
            type="text"
            name="bg"
            value={formData.bg}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g., bg-gradient-to-br from-gray-900 via-purple-900/70 to-gray-900"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Text Color (CSS class for text color)</label>
          <input
            type="text"
            name="textColor"
            value={formData.textColor}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g., text-white"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Badge Color (CSS class for promo badge gradient)</label>
          <input
            type="text"
            name="badgeColor"
            value={formData.badgeColor}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g., from-purple-600 to-indigo-600"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Features (Icon + text below subtitle)</label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                name="icon"
                value={feature.icon}
                onChange={(e) => handleInputChange(e, index, 'feature')}
                placeholder="e.g., 🚚"
                className="w-1/4 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="text"
                value={feature.text}
                onChange={(e) => handleInputChange(e, index, 'feature')}
                placeholder={`e.g., ${['Free Delivery', 'Exclusive Products', 'VIP Treatment'][index] || 'Enter feature text'}`}
                className="w-3/4 p-2 border rounded"
                required
              />
            </div>
          ))}
          <button type="button" onClick={addFeature} className="text-blue-600">
            Add Another Feature
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium">Image (WebP, 1920x1080, hero background image)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
            disabled={uploading}
          />
          {formData.image && <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover mt-2" />}
          <p className="text-sm text-gray-500 mt-1">Upload image to Cloudinary (auto-converted to WebP, 1920x1080)</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Link (CTA button destination)</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g., /membership"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={uploading || !isFormValid()}
          className={`px-4 py-2 rounded text-white ${
            uploading || !isFormValid() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {editingId ? 'Update Banner' : 'Add Banner'}
        </button>
      </form>

      {/* Banner List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Existing Banners</h2>
        <div className="grid gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{banner.title}</h3>
                <p>{banner.subtitle}</p>
                <img src={banner.image} alt={banner.title} className="w-16 h-16 object-cover mt-2" />
              </div>
              <button
                onClick={() => handleEdit(banner)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopBannerAdmin;