
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const CONTENT_TYPES = [
  { value: 'text-h1', label: 'Heading 1 (h1)' },
  { value: 'text-h2', label: 'Heading 2 (h2)' },
  { value: 'text-h3', label: 'Heading 3 (h3)' },
  { value: 'text-h4', label: 'Heading 4 (h4)' },
  { value: 'text-h5', label: 'Heading 5 (h5)' },
  { value: 'text-h6', label: 'Heading 6 (h6)' },
  { value: 'text-p', label: 'Paragraph (p)' },
  { value: 'image', label: 'Image' },
  { value: 'link', label: 'Hyperlink' },
];

// Simple function to render markdown hyperlinks
const renderMarkdownLinks = (text) => {
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let lastIndex = 0;
  const elements = [];
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match;
    const startIndex = match.index;
    const endIndex = markdownLinkRegex.lastIndex;

    // Add text before the link
    if (startIndex > lastIndex) {
      elements.push(text.slice(lastIndex, startIndex));
    }

    // Add the link
    elements.push(
      <a
        key={startIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-400 hover:text-purple-300 underline"
      >
        {linkText}
      </a>
    );

    lastIndex = endIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
};

const AddBlogPostPage = () => {
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
      contentType: 'text-p',
      data: '',
      bulletPoints: [],
      alt: '',
      image: null,
      href: '',
      target: '_blank'
    }],
    keyPoints: [],
    tags: [],
    structuredData: '',
    faqs: [{ question: '', answer: '' }],
    lsiKeywords: [],
    semanticRelatedTerms: [],
    geoLocation: { targetCountry: '', targetCity: '' },
    language: 'en',
    sgeOptimized: false,
    conversationalPhrases: [],
    directAnswers: [{ question: '', answer: '' }],
    expertAuthor: false,
    authorCredentials: '',
    citations: [{ source: '', link: '' }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState('');

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
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'title') {
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
    setFormData(prev => {
      const updatedDescriptions = [...prev.shortDescriptions];
      updatedDescriptions[index] = value;
      return { ...prev, shortDescriptions: updatedDescriptions };
    });
  };

  const addShortDescription = () => {
    setFormData(prev => ({
      ...prev,
      shortDescriptions: [...prev.shortDescriptions, '']
    }));
  };

  const removeShortDescription = (index) => {
    setFormData(prev => {
      const updatedDescriptions = prev.shortDescriptions.filter((_, i) => i !== index);
      return { ...prev, shortDescriptions: updatedDescriptions };
    });
  };

  const handleContentSectionChange = (index, field, value) => {
    setFormData(prev => {
      const updatedSections = [...prev.contentSections];
      if (field === 'contentType') {
        updatedSections[index] = {
          ...updatedSections[index],
          contentType: value,
          data: '',
          bulletPoints: [],
          alt: '',
          image: null,
          href: '',
          target: '_blank'
        };
      } else if (field === 'bulletPoints') {
        updatedSections[index].bulletPoints = value.split(',').map(p => p.trim()).filter(p => p);
      } else {
        updatedSections[index][field] = value;
      }
      return { ...prev, contentSections: updatedSections };
    });
  };

  const handleFileChange = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === 'mainImage') {
      setFormData(prev => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    } else if (index !== null) {
      setFormData(prev => {
        const updatedSections = [...prev.contentSections];
        updatedSections[index] = { ...updatedSections[index], image: file };
        return { ...prev, contentSections: updatedSections };
      });
    }
  };

  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      contentSections: [
        ...prev.contentSections,
        {
          contentType: 'text-p',
          data: '',
          bulletPoints: [],
          alt: '',
          image: null,
          href: '',
          target: '_blank'
        }
      ],
    }));
  };

  const removeContentSection = (index) => {
    setFormData(prev => {
      const updatedSections = prev.contentSections.filter((_, i) => i !== index);
      return { ...prev, contentSections: updatedSections };
    });
  };

  const handleKeyPointsChange = (index, value) => {
    setFormData(prev => {
      const updatedKeyPoints = [...prev.keyPoints];
      updatedKeyPoints[index] = value;
      return { ...prev, keyPoints: updatedKeyPoints };
    });
  };

  const addKeyPoint = () => {
    setFormData(prev => ({ ...prev, keyPoints: [...prev.keyPoints, ''] }));
  };

  const removeKeyPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (index, value) => {
    setFormData(prev => {
      const updatedTags = [...prev.tags];
      updatedTags[index] = value;
      return { ...prev, tags: updatedTags };
    });
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleLSIKeywordsChange = (index, value) => {
    setFormData(prev => {
      const updatedLSIKeywords = [...prev.lsiKeywords];
      updatedLSIKeywords[index] = value;
      return { ...prev, lsiKeywords: updatedLSIKeywords };
    });
  };

  const addLSIKeyword = () => {
    setFormData(prev => ({ ...prev, lsiKeywords: [...prev.lsiKeywords, ''] }));
  };

  const removeLSIKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      lsiKeywords: prev.lsiKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleSemanticRelatedTermsChange = (index, value) => {
    setFormData(prev => {
      const updatedTerms = [...prev.semanticRelatedTerms];
      updatedTerms[index] = value;
      return { ...prev, semanticRelatedTerms: updatedTerms };
    });
  };

  const addSemanticRelatedTerm = () => {
    setFormData(prev => ({ ...prev, semanticRelatedTerms: [...prev.semanticRelatedTerms, ''] }));
  };

  const removeSemanticRelatedTerm = (index) => {
    setFormData(prev => ({
      ...prev,
      semanticRelatedTerms: prev.semanticRelatedTerms.filter((_, i) => i !== index)
    }));
  };

  const handleConversationalPhrasesChange = (index, value) => {
    setFormData(prev => {
      const updatedPhrases = [...prev.conversationalPhrases];
      updatedPhrases[index] = value;
      return { ...prev, conversationalPhrases: updatedPhrases };
    });
  };

  const addConversationalPhrase = () => {
    setFormData(prev => ({ ...prev, conversationalPhrases: [...prev.conversationalPhrases, ''] }));
  };

  const removeConversationalPhrase = (index) => {
    setFormData(prev => ({
      ...prev,
      conversationalPhrases: prev.conversationalPhrases.filter((_, i) => i !== index)
    }));
  };

  const handleFAQChange = (index, field, value) => {
    setFormData(prev => {
      const updatedFAQs = [...prev.faqs];
      updatedFAQs[index] = { ...updatedFAQs[index], [field]: value };
      return { ...prev, faqs: updatedFAQs };
    });
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFAQ = (index) => {
    setFormData(prev => {
      const updatedFAQs = prev.faqs.filter((_, i) => i !== index);
      return { ...prev, faqs: updatedFAQs };
    });
  };

  const handleDirectAnswerChange = (index, field, value) => {
    setFormData(prev => {
      const updatedDirectAnswers = [...prev.directAnswers];
      updatedDirectAnswers[index] = { ...updatedDirectAnswers[index], [field]: value };
      return { ...prev, directAnswers: updatedDirectAnswers };
    });
  };

  const addDirectAnswer = () => {
    setFormData(prev => ({
      ...prev,
      directAnswers: [...prev.directAnswers, { question: '', answer: '' }]
    }));
  };

  const removeDirectAnswer = (index) => {
    setFormData(prev => {
      const updatedDirectAnswers = prev.directAnswers.filter((_, i) => i !== index);
      return { ...prev, directAnswers: updatedDirectAnswers };
    });
  };

  const handleCitationChange = (index, field, value) => {
    setFormData(prev => {
      const updatedCitations = [...prev.citations];
      updatedCitations[index] = { ...updatedCitations[index], [field]: value };
      return { ...prev, citations: updatedCitations };
    });
  };

  const addCitation = () => {
    setFormData(prev => ({
      ...prev,
      citations: [...prev.citations, { source: '', link: '' }]
    }));
  };

  const removeCitation = (index) => {
    setFormData(prev => {
      const updatedCitations = prev.citations.filter((_, i) => i !== index);
      return { ...prev, citations: updatedCitations };
    });
  };

  const handleGeoLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      geoLocation: { ...prev.geoLocation, [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mainImage) {
      toast.error('Main image is required');
      return;
    }

    const hasEmptyImageSection = formData.contentSections.some(
      section => section.contentType === 'image' && !section.image
    );

    if (hasEmptyImageSection) {
      toast.error('Please upload an image for all image sections');
      return;
    }

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
      formDataToSend.append('imageAlt', formData.imageAlt);

      if (formData.mainImage) {
        formDataToSend.append('mainImage', formData.mainImage);
      }

      const contentSections = formData.contentSections.map((section, index) => {
        if (section.contentType === 'image') {
          if (section.image) {
            formDataToSend.append('contentImages', section.image);
            return {
              type: 'image',
              data: `image-${index}-${Date.now()}`,
              alt: section.alt || '',
              tag: 'image'
            };
          }
          throw new Error('Image file is required for image sections');
        } else if (section.contentType === 'link') {
          if (!section.data.trim() || !section.href.trim()) {
            throw new Error('Link text and URL are required for link sections');
          }
          return {
            type: 'link',
            data: section.data,
            tag: 'a',
            href: section.href,
            target: section.target || '_blank'
          };
        } else {
          const tag = section.contentType.split('-')[1] || 'p';
          if (!section.data.trim()) {
            throw new Error('Content cannot be empty for text sections');
          }
          return {
            type: 'text',
            data: section.data, // Markdown stored as-is
            tag: tag,
            bulletPoints: section.bulletPoints || []
          };
        }
      }).filter(section => section);

      if (contentSections.length === 0) {
        throw new Error('At least one valid content section is required');
      }

      formDataToSend.append('content', JSON.stringify(contentSections));
      formDataToSend.append('keyPoints', JSON.stringify(formData.keyPoints.filter(p => p.trim())));
      formDataToSend.append('tags', JSON.stringify(formData.tags.filter(t => t.trim())));
      formDataToSend.append('categories', JSON.stringify([formData.category].filter(c => c.trim())));
      formDataToSend.append('structuredData', formData.structuredData);
      formDataToSend.append('faqs', JSON.stringify(formData.faqs));
      formDataToSend.append('lsiKeywords', JSON.stringify(formData.lsiKeywords));
      formDataToSend.append('semanticRelatedTerms', JSON.stringify(formData.semanticRelatedTerms));
      formDataToSend.append('geoLocation', JSON.stringify(formData.geoLocation));
      formDataToSend.append('language', formData.language);
      formDataToSend.append('sgeOptimized', formData.sgeOptimized);
      formDataToSend.append('conversationalPhrases', JSON.stringify(formData.conversationalPhrases));
      formDataToSend.append('directAnswers', JSON.stringify(formData.directAnswers));
      formDataToSend.append('expertAuthor', formData.expertAuthor);
      formDataToSend.append('authorCredentials', formData.authorCredentials);
      formDataToSend.append('citations', JSON.stringify(formData.citations));

      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formDataToSend,
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog post');
      }

      const result = await response.json();
      toast.success('Blog post created successfully!');
      router.push('/admin-dashboard/blog/allblogs', { scroll: false });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center">
        <p className="text-red-500">Please sign in to create a blog post.</p>
      </div>
    );
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
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter blog title (10-75 characters)"
                maxLength="75"
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.title.length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Auto-generated from title"
                maxLength="75"
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.slug.length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Meta Title *</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter meta title (10-75 characters)"
                maxLength="75"
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">{formData.metaTitle.length}/75 characters</div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                list="categorySuggestions"
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Select or enter new category"
                required
              />
              <datalist id="categorySuggestions">
                {formData.categories.map((cat, index) => (
                  <option key={index} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Meta Description *</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter meta description (50-160 characters)"
              rows="3"
              maxLength="160"
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image * (1200*628 Pixels)</label>
            <input
              type="file"
              name="mainImage"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              accept="image/*"
              required
            />
            {mainImagePreview && (
              <div className="mt-2">
                <Image
                  src={mainImagePreview}
                  alt="Main image preview"
                  width={128}
                  height={128}
                  className="object-contain mx-auto"
                />
              </div>
            )}
            <div className="mt-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image Alt Text *</label>
              <input
                type="text"
                name="imageAlt"
                value={formData.imageAlt}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the image for accessibility"
                required
              />
            </div>
          </div>

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

                {section.contentType.startsWith('text-') && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Content *</label>
                      <textarea
                        value={section.data}
                        onChange={(e) => handleContentSectionChange(index, 'data', e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your content here. Use [link text](URL) format for inline hyperlinks. Example: It's important to do thorough [keyword research](https://example.com) beforehand."
                        rows="4"
                        required
                      />
                    </div>
                    <div className="mb-4 text-sm text-gray-400">
                      <p>Hyperlink Format: [link text](URL)</p>
                      <p>Example: It is important to do thorough [keyword research](https://example.com) beforehand.</p>
                    </div>
                    {section.data && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Content Preview:</h4>
                        <div className="text-gray-300 p-2 bg-gray-900 rounded-lg">
                          {renderMarkdownLinks(section.data)}
                        </div>
                      </div>
                    )}
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

                {section.contentType === 'image' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Image * (800*600 Px)</label>
                      <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, index)}
                          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                          accept="image/*"
                          required
                        />
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

                {section.contentType === 'link' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Link Text *</label>
                      <input
                        type="text"
                        value={section.data}
                        onChange={(e) => handleContentSectionChange(index, 'data', e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter link text"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">URL *</label>
                      <input
                        type="url"
                        value={section.href}
                        onChange={(e) => handleContentSectionChange(index, 'href', e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Link Target</label>
                      <select
                        value={section.target}
                        onChange={(e) => handleContentSectionChange(index, 'target', e.target.value)}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="_blank">Open in new tab (_blank)</option>
                        <option value="_self">Open in same tab (_self)</option>
                        <option value="_parent">Open in parent frame (_parent)</option>
                        <option value="_top">Open in full body of the window (_top)</option>
                      </select>
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
            <label className="block text-gray-300 text-sm font-medium">Short Descriptions</label>
            {formData.shortDescriptions.map((desc, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => handleShortDescriptionChange(index, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter short description"
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
            <button
              type="button"
              onClick={addShortDescription}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Short Description
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Key Points</label>
            {formData.keyPoints.map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleKeyPointsChange(index, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter key point"
                />
                <button
                  type="button"
                  onClick={() => removeKeyPoint(index)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addKeyPoint}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Key Point
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Tags</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagsChange(index, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter tag"
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Tag
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">LSI Keywords</label>
            {formData.lsiKeywords.map((keyword, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => handleLSIKeywordsChange(index, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter LSI keyword"
                />
                <button
                  type="button"
                  onClick={() => removeLSIKeyword(index)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLSIKeyword}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add LSI Keyword
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Semantic Related Terms</label>
            {formData.semanticRelatedTerms.map((term, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleSemanticRelatedTermsChange(index, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter semantic related term"
                />
                <button
                  type="button"
                  onClick={() => removeSemanticRelatedTerm(index)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSemanticRelatedTerm}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Semantic Related Term
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Conversational Phrases</label>
            {formData.conversationalPhrases.map((phrase, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => handleConversationalPhrasesChange(index, e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter conversational phrase"
                />
                <button
                  type="button"
                  onClick={() => removeConversationalPhrase(index)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addConversationalPhrase}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Conversational Phrase
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Structured Data (JSON-LD)</label>
            <textarea
              name="structuredData"
              value={formData.structuredData}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter structured data in JSON-LD format"
              rows="5"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">FAQs</label>
            {formData.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Question *</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter FAQ question"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Answer *</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter FAQ answer"
                    rows="3"
                    required
                  />
                </div>
                {formData.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove FAQ
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFAQ}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Direct Answers</label>
            {formData.directAnswers.map((answer, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Question</label>
                  <input
                    type="text"
                    value={answer.question}
                    onChange={(e) => handleDirectAnswerChange(index, 'question', e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter direct answer question"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Answer</label>
                  <textarea
                    value={answer.answer}
                    onChange={(e) => handleDirectAnswerChange(index, 'answer', e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter direct answer"
                    rows="3"
                  />
                </div>
                {formData.directAnswers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDirectAnswer(index)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove Direct Answer
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDirectAnswer}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Direct Answer
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Citations</label>
            {formData.citations.map((citation, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Source</label>
                  <input
                    type="text"
                    value={citation.source}
                    onChange={(e) => handleCitationChange(index, 'source', e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter citation source"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm">Link</label>
                  <input
                    type="url"
                    value={citation.link}
                    onChange={(e) => handleCitationChange(index, 'link', e.target.value)}
                    className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>
                {formData.citations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCitation(index)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove Citation
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCitation}
              className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
            >
              <span className="mr-1">+</span> Add Citation
            </button>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Geo Location</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Target Country</label>
                <input
                  type="text"
                  value={formData.geoLocation.targetCountry}
                  onChange={(e) => handleGeoLocationChange('targetCountry', e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter target country"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Target City</label>
                <input
                  type="text"
                  value={formData.geoLocation.targetCity}
                  onChange={(e) => handleGeoLocationChange('targetCity', e.target.value)}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter target city"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">SEO Settings</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sgeOptimized"
                  name="sgeOptimized"
                  checked={formData.sgeOptimized}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="sgeOptimized" className="ml-2 text-sm text-gray-300">
                  SGE Optimized
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="expertAuthor"
                  name="expertAuthor"
                  checked={formData.expertAuthor}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="expertAuthor" className="ml-2 text-sm text-gray-300">
                  Expert Author
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Author Credentials</label>
            <textarea
              name="authorCredentials"
              value={formData.authorCredentials}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter author credentials"
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Create Blog Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlogPostPage;