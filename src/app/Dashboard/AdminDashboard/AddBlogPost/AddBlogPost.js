"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const AddBlogPostPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    category: '',
    categories: [],
    author: session?.user?.name || 'Unknown Author',
    metaDescription: '',
    shortDescriptions: [''], // Changed to array for multiple descriptions
    mainImage: null,
    imageAlt: '',
    contentSections: [{ content: '', tag: 'p', bulletPoints: [], image: null, imageAlt: '' }],
    keyPoints: [],
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setFormData(prev => ({ ...prev, author: session.user.name }));
    }
  }, [session]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/blog/categories');
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({ ...prev, categories: data }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 75),
        metaTitle: value.slice(0, 75),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleShortDescriptionChange = (index, value) => {
    const updatedDescriptions = [...formData.shortDescriptions];
    updatedDescriptions[index] = value;
    setFormData({ ...formData, shortDescriptions: updatedDescriptions });
  };

  const addShortDescription = () => {
    setFormData({ ...formData, shortDescriptions: [...formData.shortDescriptions, ''] });
  };

  const removeShortDescription = (index) => {
    const updatedDescriptions = formData.shortDescriptions.filter((_, i) => i !== index);
    setFormData({ ...formData, shortDescriptions: updatedDescriptions });
  };

  const handleFileChange = (e, index = null) => {
    if (e.target.name === 'mainImage') {
      setFormData({ ...formData, mainImage: e.target.files[0] });
    } else if (index !== null) {
      const updatedSections = [...formData.contentSections];
      updatedSections[index].image = e.target.files[0];
      setFormData({ ...formData, contentSections: updatedSections });
    }
  };

  const handleContentSectionChange = (index, field, value) => {
    const updatedSections = [...formData.contentSections];
    if (field === 'bulletPoints') {
      const points = value.split(',').map(point => point.trim()).filter(point => point.length > 0);
      updatedSections[index][field] = points;
    } else {
      updatedSections[index][field] = value;
    }
    setFormData({ ...formData, contentSections: updatedSections });
  };

  const addContentSection = () => {
    setFormData({
      ...formData,
      contentSections: [...formData.contentSections, { content: '', tag: 'p', bulletPoints: [], image: null, imageAlt: '' }],
    });
  };

  const removeContentSection = (index) => {
    const updatedSections = formData.contentSections.filter((_, i) => i !== index);
    setFormData({ ...formData, contentSections: updatedSections });
  };

  const handleKeyPointsChange = (index, value) => {
    const updatedKeyPoints = [...formData.keyPoints];
    updatedKeyPoints[index] = value;
    setFormData({ ...formData, keyPoints: updatedKeyPoints });
  };

  const addKeyPoint = () => {
    setFormData({ ...formData, keyPoints: [...formData.keyPoints, ''] });
  };

  const handleTagsChange = (index, value) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData({ ...formData, tags: updatedTags });
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('metaTitle', formData.metaTitle);
      formDataToSend.append('metaDescription', formData.metaDescription);
      formDataToSend.append('shortDescriptions', JSON.stringify(formData.shortDescriptions.filter(d => d.trim()))); // Array of descriptions
      formDataToSend.append('author', session?.user?.name || 'Unknown Author');
      formDataToSend.append('publishDate', new Date().toISOString());
      if (formData.mainImage) formDataToSend.append('mainImage', formData.mainImage);

      const contentSections = formData.contentSections.map(section => {
        const sectionData = { type: section.image ? 'image' : 'text' };
        if (section.image) {
          formDataToSend.append('contentImages', section.image);
          sectionData.data = section.image.name;
          sectionData.alt = section.imageAlt || '';
        } else {
          sectionData.data = section.content;
          sectionData.bulletPoints = section.bulletPoints; // Preserve bullet points
        }
        return sectionData;
      });
      formDataToSend.append('content', JSON.stringify(contentSections));

      formDataToSend.append('keyPoints', JSON.stringify(formData.keyPoints.filter(p => p.trim())));
      formDataToSend.append('tags', JSON.stringify(formData.tags.filter(t => t.trim())));
      formDataToSend.append('categories', JSON.stringify([formData.category].filter(c => c.trim())));

      console.log('FormData to send:', [...formDataToSend.entries()]);

      const response = await fetch('/api/blog', { method: 'POST', body: formDataToSend });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to create blog post');

      toast.success('Blog post created successfully!');
      router.push('/admin-dashboard/blog/bloginfo');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 md:p-6 lg:p-8">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Add New Blog Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter blog title (10-75 characters)" maxLength="75" required />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.title.length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Auto-generated from title" maxLength="75" required />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.slug.length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Meta Title *</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter meta title (10-75 characters)" maxLength="75" required />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.metaTitle.length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Category *</label>
              <div className="relative">
                <input type="text" name="category" value={formData.category} onChange={handleChange} list="categorySuggestions" className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Select or enter new category" required />
                <datalist id="categorySuggestions">{formData.categories.map((cat, index) => (<option key={index} value={cat} />))}</datalist>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Author *</label>
              <input type="text" name="author" value={formData.author} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-not-allowed" readOnly disabled />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Meta Description *</label>
            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter meta description (50-160 characters)" rows="3" maxLength="160" required />
            <div className="text-right text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</div>
          </div>
          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Short Descriptions (Optional)</label>
            {formData.shortDescriptions.map((desc, index) => (
              <div key={index} className="flex items-center space-x-2">
                <textarea
                  value={desc}
                  onChange={(e) => handleShortDescriptionChange(index, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Short Description ${index + 1} (optional)`}
                  rows="2"
                />
                {formData.shortDescriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeShortDescription(index)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addShortDescription} className="flex items-center text-purple-400 hover:text-purple-300 text-sm">
              <span className="mr-1">+</span> Add Another Short Description
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image *</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                <input type="file" name="mainImage" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" accept="image/*" required />
                <p className="mt-2 text-xs text-gray-500">Recommended: WebP format, 1200x630px</p>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image Alt Text *</label>
              <input type="text" name="imageAlt" value={formData.imageAlt} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Describe the image for accessibility" required />
            </div>
          </div>
          <div className="space-y-6">
            <label className="block text-gray-300 text-sm font-medium">Content Sections</label>
            {formData.contentSections.map((section, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-300">Section {index + 1}</h3>
                  {formData.contentSections.length > 1 && (
                    <button type="button" onClick={() => removeContentSection(index)} className="text-red-500 hover:text-red-400 text-sm flex items-center">Remove Section</button>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Content Type *</label>
                  <select value={section.tag} onChange={(e) => handleContentSectionChange(index, 'tag', e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Content *</label>
                  <textarea value={section.content} onChange={(e) => handleContentSectionChange(index, 'content', e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter your content here" rows="4" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Bullet Points (Optional)</label>
                  <input type="text" value={section.bulletPoints.join(', ')} onChange={(e) => handleContentSectionChange(index, 'bulletPoints', e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Comma separated points" />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if not needed</p>
                  {section.bulletPoints.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Preview Bullet Points:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300">{section.bulletPoints.map((point, i) => (<li key={i}>{point}</li>))}</ul>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Add Image (Optional)</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                      <input type="file" onChange={(e) => handleFileChange(e, index)} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" accept="image/*" />
                      <p className="mt-2 text-xs text-gray-500">Recommended: WebP format, 1200x630px</p>
                    </div>
                  </div>
                  {section.image && (
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">Image Alt Text</label>
                      <input type="text" value={section.imageAlt} onChange={(e) => handleContentSectionChange(index, 'imageAlt', e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Describe the image for accessibility" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={addContentSection} className="flex items-center text-purple-400 hover:text-purple-300 text-sm"><span className="mr-1">+</span> Add Another Content Section</button>
          </div>
          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Key Points (Optional)</label>
            {formData.keyPoints.map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="text" value={point} onChange={(e) => handleKeyPointsChange(index, e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter key point" />
              </div>
            ))}
            <button type="button" onClick={addKeyPoint} className="flex items-center text-purple-400 hover:text-purple-300 text-sm"><span className="mr-1">+</span> Add Key Point</button>
          </div>
          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Tags (Optional)</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="text" value={tag} onChange={(e) => handleTagsChange(index, e.target.value)} className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter tag" />
              </div>
            ))}
            <button type="button" onClick={addTag} className="flex items-center text-purple-400 hover:text-purple-300 text-sm"><span className="mr-1">+</span> Add Tag</button>
          </div>
          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Blog Post...
                </>
              ) : 'Create Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlogPostPage;