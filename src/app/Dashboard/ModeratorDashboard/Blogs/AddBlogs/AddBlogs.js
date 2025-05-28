"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const CONTENT_TYPES = [
  { value: 'text-h1', label: 'Heading 1 (h1)' },
  { value: 'text-h2', label: 'Heading 2 (h2)' },
  { value: 'text-h3', label: 'Heading 3 (h3)' },
  { value: 'text-h4', label: 'Heading 4 (h4)' },
  { value: 'text-h5', label: 'Heading 5 (h5)' },
  { value: 'text-h6', label: 'Heading 6 (h6)' },
  { value: 'text-p', label: 'Paragraph (p)' },
  { value: 'image', label: 'Image' },
];

const AddBlogPostModerator = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    category: '',
    categories: [],
    author: '',
    metaDescription: '',
    shortDescriptions: [''],
    mainImage: null,
    imageAlt: '',
    contentSections: [{
      contentType: 'text-p', // Default to paragraph
      data: '',
      bulletPoints: [],
      alt: '',
      image: null
    }],
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
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 75),
        metaTitle: value.slice(0, 75),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleContentSectionChange = (index, field, value) => {
    const updatedSections = [...formData.contentSections];

    if (field === 'contentType') {
      updatedSections[index].contentType = value;
      // Reset data when changing type
      if (value.startsWith('text-')) {
        updatedSections[index].data = '';
        updatedSections[index].bulletPoints = [];
        updatedSections[index].image = null;
        updatedSections[index].alt = '';
      } else {
        updatedSections[index].data = '';
        updatedSections[index].bulletPoints = [];
      }
    } else if (field === 'bulletPoints') {
      const points = value.split(',').map(p => p.trim()).filter(p => p);
      updatedSections[index].bulletPoints = points;
    } else {
      updatedSections[index][field] = value;
    }

    setFormData({ ...formData, contentSections: updatedSections });
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

  const addContentSection = () => {
    setFormData({
      ...formData,
      contentSections: [
        ...formData.contentSections,
        {
          contentType: 'text-p', // Default to paragraph
          data: '',
          bulletPoints: [],
          alt: '',
          image: null
        }
      ],
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
      formDataToSend.append('shortDescriptions', JSON.stringify(formData.shortDescriptions.filter(d => d.trim())));
      formDataToSend.append('author', formData.author);
      formDataToSend.append('publishDate', new Date().toISOString());

      if (formData.mainImage) {
        formDataToSend.append('mainImage', formData.mainImage);
      }

      // Process content sections for API
      const contentSections = formData.contentSections.map(section => {
        if (section.contentType === 'image') {
          if (section.image) {
            formDataToSend.append('contentImages', section.image);
            return {
              type: 'image',
              data: section.image.name,
              alt: section.alt || '',
              tag: 'image'
            };
          }
          throw new Error('Image file is required for image sections');
        } else {
          const [_, tag] = section.contentType.split('-');
          if (!section.data.trim()) {
            throw new Error('Content cannot be empty for text sections');
          }
          return {
            type: 'text',
            data: section.data,
            tag: tag,
            bulletPoints: section.bulletPoints || []
          };
        }
      }).filter(section => section); // Remove any undefined sections

      if (contentSections.length === 0) {
        throw new Error('At least one valid content section is required');
      }

      formDataToSend.append('content', JSON.stringify(contentSections));
      formDataToSend.append('keyPoints', JSON.stringify(formData.keyPoints.filter(p => p.trim())));
      formDataToSend.append('tags', JSON.stringify(formData.tags.filter(t => t.trim())));
      formDataToSend.append('categories', JSON.stringify([formData.category].filter(c => c.trim())));

      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog post');
      }

      const result = await response.json();
      toast.success('Blog post created successfully!');
      router.push('/moderator-dashboard/blog/all-blogs');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

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
              <div className="text-right text-xs text-gray-500 mt-1">{(formData.title || '').length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Auto-generated from title" maxLength="75" required />
              <div className="text-right text-xs text-gray-500 mt-1">{(formData.slug || '').length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Meta Title *</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter meta title (10-75 characters)" maxLength="75" required />
              <div className="text-right text-xs text-gray-500 mt-1">{(formData.metaTitle || '').length}/75 characters</div>
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
            <div className="text-right text-xs text-gray-500 mt-1">{(formData.metaDescription || '').length}/160 characters</div>
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
              <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image 1600px × 900px (16:9 aspect ratio) *</label>
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


          {/* Content Sections */}
          <div className="space-y-6">
            <label className="block text-gray-300 text-sm font-medium">Content Sections</label>
            {formData.contentSections.map((section, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-300">Section {index + 1}</h3>
                  {formData.contentSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContentSection(index)}
                      className="text-red-500 hover:text-red-400 text-sm flex items-center"
                    >
                      Remove Section
                    </button>
                  )}
                </div>

                {/* Content Type Selector */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Content Type *</label>
                  <select
                    value={section.contentType}
                    onChange={(e) => handleContentSectionChange(index, 'contentType', e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CONTENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Text Content */}
                {section.contentType.startsWith('text-') && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Content *</label>
                      <textarea
                        value={section.data}
                        onChange={(e) => handleContentSectionChange(index, 'data', e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your content here"
                        rows="4"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Bullet Points (Optional)</label>
                      <input
                        type="text"
                        value={section.bulletPoints.join(', ')}
                        onChange={(e) => handleContentSectionChange(index, 'bulletPoints', e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Comma separated points"
                      />
                      {section.bulletPoints.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Preview Bullet Points:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-300">
                            {section.bulletPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Image Content */}
                {section.contentType === 'image' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Image *</label>
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                          accept="image/*"
                          required
                        />
                        <p className="mt-2 text-xs text-gray-500">Recommended: WebP format, 1200x630px</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Image Alt Text *</label>
                      <input
                        type="text"
                        value={section.alt}
                        onChange={(e) => handleContentSectionChange(index, 'alt', e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe the image for accessibility"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addContentSection}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Another Content Section
            </button>
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

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
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

export default AddBlogPostModerator;