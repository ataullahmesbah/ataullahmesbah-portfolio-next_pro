"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
    { value: 'link', label: 'Hyperlink' },
];

const UpdateBlogPostPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        metaTitle: '',
        category: '',
        categories: [],
        author: session?.user?.name || '',
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
            existingImageUrl: '',
            href: '',
            target: '_blank'
        }],
        keyPoints: [],
        tags: [],
        // SEO fields
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');

    useEffect(() => {
        if (!slug) {
            setError('No slug provided');
            setLoading(false);
            return;
        }

        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blog/${slug}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch blog');
                const blog = await res.json();

                setFormData({
                    title: blog.title || '',
                    slug: blog.slug || '',
                    metaTitle: blog.metaTitle || '',
                    category: blog.categories?.[0] || '',
                    categories: blog.categories || [],
                    author: blog.author || session?.user?.name || '',
                    metaDescription: blog.metaDescription || '',
                    shortDescriptions: blog.shortDescriptions?.length ? blog.shortDescriptions : [''],
                    mainImage: null,
                    imageAlt: blog.mainImage ? 'Existing Image' : '',
                    contentSections: blog.content.map(item => ({
                        contentType: item.type === 'image' ? 'image' :
                            item.type === 'link' ? 'link' : `text-${item.tag || 'p'}`,
                        data: item.data || '',
                        bulletPoints: item.bulletPoints || [],
                        alt: item.alt || '',
                        image: null,
                        existingImageUrl: item.type === 'image' ? item.data : '',
                        href: item.href || '',
                        target: item.target || '_blank'
                    })),
                    keyPoints: blog.keyPoints || [],
                    tags: blog.tags || [],
                    // SEO fields
                    structuredData: blog.structuredData || '',
                    faqs: blog.faqs || [{ question: '', answer: '' }],
                    lsiKeywords: blog.lsiKeywords || [],
                    semanticRelatedTerms: blog.semanticRelatedTerms || [],
                    geoLocation: blog.geoLocation || { targetCountry: '', targetCity: '' },
                    language: blog.language || 'en',
                    sgeOptimized: blog.sgeOptimized || false,
                    conversationalPhrases: blog.conversationalPhrases || [],
                    directAnswers: blog.directAnswers || [{ question: '', answer: '' }],
                    expertAuthor: blog.expertAuthor || false,
                    authorCredentials: blog.authorCredentials || '',
                    citations: blog.citations || [{ source: '', link: '' }],
                });

                if (blog.mainImage) {
                    setMainImagePreview(blog.mainImage);
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
                setError(error.message);
                toast.error('Failed to load blog data');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug, session]);

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
                updatedSections[index].href = '';
                updatedSections[index].target = '_blank';
            } else if (value === 'image') {
                updatedSections[index].data = '';
                updatedSections[index].bulletPoints = [];
                updatedSections[index].href = '';
                updatedSections[index].target = '_blank';
            } else if (value === 'link') {
                updatedSections[index].data = '';
                updatedSections[index].bulletPoints = [];
                updatedSections[index].image = null;
                updatedSections[index].alt = '';
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
        const file = e.target.files[0];
        if (!file) return;

        if (e.target.name === 'mainImage') {
            setFormData({ ...formData, mainImage: file });
            setMainImagePreview(URL.createObjectURL(file));
        } else if (index !== null) {
            const updatedSections = [...formData.contentSections];
            updatedSections[index].image = file;
            updatedSections[index].existingImageUrl = '';
            setFormData({ ...formData, contentSections: updatedSections });
        }
    };

    const addContentSection = () => {
        setFormData({
            ...formData,
            contentSections: [
                ...formData.contentSections,
                {
                    contentType: 'text-p',
                    data: '',
                    bulletPoints: [],
                    alt: '',
                    image: null,
                    existingImageUrl: '',
                    href: '',
                    target: '_blank'
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

    // SEO field handlers
    const handleFAQChange = (index, field, value) => {
        const updatedFAQs = [...formData.faqs];
        updatedFAQs[index][field] = value;
        setFormData({ ...formData, faqs: updatedFAQs });
    };

    const addFAQ = () => {
        setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] });
    };

    const removeFAQ = (index) => {
        const updatedFAQs = formData.faqs.filter((_, i) => i !== index);
        setFormData({ ...formData, faqs: updatedFAQs });
    };

    const handleDirectAnswerChange = (index, field, value) => {
        const updatedDirectAnswers = [...formData.directAnswers];
        updatedDirectAnswers[index][field] = value;
        setFormData({ ...formData, directAnswers: updatedDirectAnswers });
    };

    const addDirectAnswer = () => {
        setFormData({ ...formData, directAnswers: [...formData.directAnswers, { question: '', answer: '' }] });
    };

    const removeDirectAnswer = (index) => {
        const updatedDirectAnswers = formData.directAnswers.filter((_, i) => i !== index);
        setFormData({ ...formData, directAnswers: updatedDirectAnswers });
    };

    const handleCitationChange = (index, field, value) => {
        const updatedCitations = [...formData.citations];
        updatedCitations[index][field] = value;
        setFormData({ ...formData, citations: updatedCitations });
    };

    const addCitation = () => {
        setFormData({ ...formData, citations: [...formData.citations, { source: '', link: '' }] });
    };

    const removeCitation = (index) => {
        const updatedCitations = formData.citations.filter((_, i) => i !== index);
        setFormData({ ...formData, citations: updatedCitations });
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
                    } else if (section.existingImageUrl) {
                        return {
                            type: 'image',
                            data: section.existingImageUrl,
                            alt: section.alt || '',
                            tag: 'image'
                        };
                    }
                    throw new Error('Image file is required for image sections');
                } else if (section.contentType === 'link') {
                    // Link section processing
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
                    // Text section processing
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
            }).filter(section => section);

            if (contentSections.length === 0) {
                throw new Error('At least one valid content section is required');
            }

            formDataToSend.append('content', JSON.stringify(contentSections));
            formDataToSend.append('keyPoints', JSON.stringify(formData.keyPoints.filter(p => p.trim())));
            formDataToSend.append('tags', JSON.stringify(formData.tags.filter(t => t.trim())));
            formDataToSend.append('categories', JSON.stringify([formData.category].filter(c => c.trim())));

            // SEO fields
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

            const response = await fetch(`/api/blog/${slug}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update blog post');
            }

            const result = await response.json();
            toast.success('Blog post updated successfully!');
            router.push('/admin-dashboard/blog/allblogs');
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.message || 'Failed to update blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center">
                <p>Loading blog data...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center">
                <p className="text-red-500">Please sign in to update a blog post.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 md:p-6 lg:p-8">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    Update Blog Post
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
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image</label>
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                                <input type="file" name="mainImage" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" accept="image/*" />
                                <p className="mt-2 text-xs text-gray-500">Upload a new image to replace (WebP, 1200x630px recommended)</p>
                                {mainImagePreview && (
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-400 mb-1">Current Image:</p>
                                        <img src={mainImagePreview} alt="Current main" className="h-32 object-contain mx-auto" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image Alt Text</label>
                            <input type="text" name="imageAlt" value={formData.imageAlt} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Describe the image for accessibility" />
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
                                                placeholder="Enter your content here. Use [link text](URL) format for hyperlinks."
                                                rows="4"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 text-sm text-gray-400">
                                            <p>Hyperlink Format: [link text](URL)</p>
                                            <p>Example: [Stanford University](https://stanford.edu)</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-300 mb-2 text-sm">Bullet Points (Optional)</label>
                                            <input
                                                type="text"
                                                value={section.bulletPoints?.join(', ') || ''}
                                                onChange={(e) => handleContentSectionChange(index, 'bulletPoints', e.target.value)}
                                                className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Comma separated points"
                                            />
                                            {section.bulletPoints?.length > 0 && (
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
                                                />
                                                {section.existingImageUrl && !section.image && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-400 mb-1">Current Image:</p>
                                                        <img
                                                            src={section.existingImageUrl}
                                                            alt="Current content"
                                                            className="h-32 object-contain mx-auto"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-300 mb-2 text-sm">Image Alt Text *</label>
                                            <input
                                                type="text"
                                                value={section.alt || ''}
                                                onChange={(e) => handleContentSectionChange(index, 'alt', e.target.value)}
                                                className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Describe the image for accessibility"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Link Content */}
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

                                        <div className="mb-4 p-3 bg-gray-900 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-300 mb-2">Link Preview:</h4>
                                            <a
                                                href={section.href || '#'}
                                                target={section.target}
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:text-purple-300 underline"
                                            >
                                                {section.data || 'Link text'}
                                            </a>
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

                    {/* SEO Optimization Section */}
                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                        <h2 className="text-xl font-bold text-gray-300 mb-4">SEO Optimization</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="en">English</option>
                                    <option value="bn">Bengali</option>
                                    <option value="hi">Hindi</option>
                                </select>
                            </div>

                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    id="sgeOptimized"
                                    name="sgeOptimized"
                                    checked={formData.sgeOptimized}
                                    onChange={(e) => setFormData({ ...formData, sgeOptimized: e.target.checked })}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                                />
                                <label htmlFor="sgeOptimized" className="ml-2 block text-sm text-gray-300">
                                    SGE Optimized
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="expertAuthor"
                                    name="expertAuthor"
                                    checked={formData.expertAuthor}
                                    onChange={(e) => setFormData({ ...formData, expertAuthor: e.target.checked })}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                                />
                                <label htmlFor="expertAuthor" className="ml-2 block text-sm text-gray-300">
                                    Expert Author
                                </label>
                            </div>
                        </div>

                        {/* GEO Targeting */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-300 mb-3">GEO Targeting</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 text-sm">Target Country</label>
                                    <input
                                        type="text"
                                        value={formData.geoLocation.targetCountry}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            geoLocation: { ...formData.geoLocation, targetCountry: e.target.value }
                                        })}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="e.g., Bangladesh"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 text-sm">Target City</label>
                                    <input
                                        type="text"
                                        value={formData.geoLocation.targetCity}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            geoLocation: { ...formData.geoLocation, targetCity: e.target.value }
                                        })}
                                        className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="e.g., Dhaka"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* LSI Keywords */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-300 mb-3">LSI Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {formData.lsiKeywords.map((keyword, index) => (
                                    <span key={index} className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm">
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...formData.lsiKeywords];
                                                updated.splice(index, 1);
                                                setFormData({ ...formData, lsiKeywords: updated });
                                            }}
                                            className="ml-2 text-red-400 hover:text-red-300"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add LSI keyword"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            e.preventDefault();
                                            setFormData({
                                                ...formData,
                                                lsiKeywords: [...formData.lsiKeywords, e.target.value.trim()]
                                            });
                                            e.target.value = '';
                                        }
                                    }}
                                    className="p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* FAQs Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-300 mb-3">FAQs</h3>
                            {formData.faqs.map((faq, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-900 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-gray-300">FAQ {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...formData.faqs];
                                                updated.splice(index, 1);
                                                setFormData({ ...formData, faqs: updated });
                                            }}
                                            className="text-red-500 hover:text-red-400 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-gray-300 mb-1 text-sm">Question</label>
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) => {
                                                const updated = [...formData.faqs];
                                                updated[index].question = e.target.value;
                                                setFormData({ ...formData, faqs: updated });
                                            }}
                                            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1 text-sm">Answer</label>
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) => {
                                                const updated = [...formData.faqs];
                                                updated[index].answer = e.target.value;
                                                setFormData({ ...formData, faqs: updated });
                                            }}
                                            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            rows="2"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    faqs: [...formData.faqs, { question: '', answer: '' }]
                                })}
                                className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
                            >
                                <span className="mr-1">+</span> Add FAQ
                            </button>
                        </div>

                        {/* Author Credentials Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-300 mb-3">Author Credentials</h3>
                            <textarea
                                value={formData.authorCredentials}
                                onChange={(e) => setFormData({ ...formData, authorCredentials: e.target.value })}
                                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Example: Dr. John Doe is a renowned cardiologist with 15 years of experience. He holds an MD from Harvard Medical School and is a fellow of the American College of Cardiology. Dr. Doe has published over 50 research papers..."
                                rows="4"
                            />
                            <p className="text-sm text-gray-400 mt-2">
                                Author credentials help establish E-A-T (Expertise, Authoritativeness, Trustworthiness) which is important for SEO.
                            </p>
                        </div>

                        {/* DATA */}

                        {/* Structured Data Information */}
                        <div className="mb-6 p-4 bg-gray-900 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-300 mb-2">Structured Data Information</h3>
                            <p className="text-sm text-gray-400">
                                Structured data (JSON-LD) will be automatically generated from your blog content and displayed on the blog detail page.
                                This helps search engines understand your content better and may result in rich search results.
                            </p>
                        </div>
                    </div>



                    <div className="pt-4">
                        <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Blog Post...
                                </>
                            ) : 'Update Blog Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateBlogPostPage;