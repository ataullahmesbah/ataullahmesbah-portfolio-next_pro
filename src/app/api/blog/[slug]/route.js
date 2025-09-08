// src/app/api/blog/[slug]/route.js

import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
  await dbConnect();
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) {
      console.error('Blog not found for slug:', params.slug);
      return new Response(JSON.stringify({ error: 'Blog not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0' },
      });
    }
    console.log('Fetched blog:', blog);
    return new Response(JSON.stringify(blog), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('GET error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blog' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0' },
    });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { slug } = params;
  console.log('PUT request for slug:', slug);

  try {
    const formData = await req.formData();
    console.log('FormData keys:', [...formData.keys()]);

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      console.error('No blog found for slug:', slug);
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    // Validate required fields
    const requiredFields = ['title', 'metaTitle', 'metaDescription', 'author'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    // Update basic fields
    blog.title = formData.get('title');
    blog.metaTitle = formData.get('metaTitle');
    blog.metaDescription = formData.get('metaDescription');
    blog.author = formData.get('author');
    console.log('Updated basic fields:', { title: blog.title, metaTitle: blog.metaTitle, metaDescription: blog.metaDescription, author: blog.author });

    // Handle JSON fields
    const jsonFields = ['shortDescriptions', 'keyPoints', 'tags', 'categories', 'faqs', 'lsiKeywords', 'semanticRelatedTerms', 'geoLocation', 'conversationalPhrases', 'directAnswers', 'citations'];
    for (const field of jsonFields) {
      if (formData.has(field)) {
        try {
          blog[field] = JSON.parse(formData.get(field) || '[]');
          console.log(`Parsed ${field}:`, blog[field]);
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
          return NextResponse.json(
            { success: false, error: `Invalid ${field} format` },
            { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
          );
        }
      }
    }

    // Handle main image
    const mainImageFile = formData.get('mainImage');
    if (mainImageFile && mainImageFile.size > 0) {
      console.log('Uploading new main image:', mainImageFile.name);
      const arrayBuffer = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'blog_images', format: 'webp', quality: 'auto' },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(buffer);
      });
      blog.mainImage = result.secure_url;
      console.log('Updated mainImage:', blog.mainImage);
    }

    // Process content sections
    if (formData.has('content')) {
      let content;
      try {
        content = JSON.parse(formData.get('content') || '[]');
        console.log('Parsed content:', content);
      } catch (error) {
        console.error('Error parsing content:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid content format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }

      const contentImages = formData.getAll('contentImages');
      console.log('Content images count:', contentImages.length);
      let imageIndex = 0;

      blog.content = await Promise.all(
        content.map(async (item) => {
          if (item.type === 'image') {
            if (item.data && (item.data.startsWith('http://') || item.data.startsWith('https://'))) {
              console.log('Keeping existing image URL:', item.data);
              return {
                type: 'image',
                data: item.data,
                alt: item.alt || '',
                tag: 'image'
              };
            } else {
              console.log('Uploading new content image at index:', imageIndex);
              const imageFile = contentImages[imageIndex];
              imageIndex++;

              if (imageFile && imageFile.size > 0) {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const result = await new Promise((resolve, reject) => {
                  cloudinary.uploader.upload_stream(
                    { folder: 'blog_images/content', format: 'webp', quality: 'auto' },
                    (error, result) => error ? reject(error) : resolve(result)
                  ).end(buffer);
                });
                return {
                  type: 'image',
                  data: result.secure_url,
                  alt: item.alt || '',
                  tag: 'image'
                };
              }
              throw new Error('Image file missing for image content section');
            }
          } else if (item.type === 'link') {
            if (!item.data?.trim() || !item.href?.trim()) {
              throw new Error('Link content and href cannot be empty');
            }
            return {
              type: 'link',
              data: item.data,
              tag: 'a',
              href: item.href,
              target: item.target || '_blank'
            };
          } else {
            if (!item.data?.trim()) {
              throw new Error('Text content cannot be empty');
            }
            return {
              type: 'text',
              data: item.data,
              tag: item.tag || 'p',
              bulletPoints: item.bulletPoints || []
            };
          }
        })
      );
      console.log('Updated blog.content:', blog.content);
    }

    // Calculate read time
    const wordCount = blog.content
      .filter(item => item.type === 'text')
      .reduce((count, item) => count + item.data.split(/\s+/).length, 0);
    blog.readTime = Math.max(1, Math.ceil(wordCount / 200));
    console.log('Calculated readTime:', blog.readTime);

    // Update other fields
    if (formData.has('structuredData')) blog.structuredData = formData.get('structuredData');
    if (formData.has('language')) blog.language = formData.get('language');
    if (formData.has('sgeOptimized')) blog.sgeOptimized = formData.get('sgeOptimized') === 'true';
    if (formData.has('expertAuthor')) blog.expertAuthor = formData.get('expertAuthor') === 'true';
    if (formData.has('authorCredentials')) blog.authorCredentials = formData.get('authorCredentials');

    try {
      await blog.save();
      console.log('Blog saved successfully:', blog);
      return NextResponse.json(
        { success: true, data: blog },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    } catch (error) {
      console.error('Error saving blog:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to save blog' },
        { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update blog' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}