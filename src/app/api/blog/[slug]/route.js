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
      return new Response(JSON.stringify({ error: 'Blog not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(blog), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch blog' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { slug } = params;

  try {
    const formData = await req.formData();
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    const requiredFields = ['title', 'metaTitle', 'metaDescription', 'author'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Update basic fields
    blog.title = formData.get('title');
    blog.metaTitle = formData.get('metaTitle');
    blog.metaDescription = formData.get('metaDescription');
    blog.author = formData.get('author');
    blog.imageAlt = formData.get('imageAlt') || '';

    // Handle JSON fields
    const jsonFields = ['shortDescriptions', 'keyPoints', 'tags', 'categories', 'faqs',
      'lsiKeywords', 'semanticRelatedTerms', 'geoLocation',
      'conversationalPhrases', 'directAnswers', 'citations'];

    for (const field of jsonFields) {
      if (formData.has(field)) {
        try {
          blog[field] = JSON.parse(formData.get(field) || (field === 'geoLocation' ? '{}' : '[]'));
        } catch (error) {
          return NextResponse.json(
            { success: false, error: `Invalid ${field} format` },
            { status: 400 }
          );
        }
      }
    }

    // Handle main image with specific dimensions
    const mainImageFile = formData.get('mainImage');
    if (mainImageFile && mainImageFile.size > 0) {
      const arrayBuffer = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'blog_main_images',
            format: 'webp',
            quality: 'auto',
            width: 1200,
            height: 628,
            crop: 'fill', // Auto crop to fill the dimensions
            gravity: 'auto' // Auto detect the best area to focus on
          },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(buffer);
      });
      blog.mainImage = result.secure_url;
    }



    // Process content sections
    // Process content images with auto-crop
    if (formData.has('content')) {
      let content;
      try {
        content = JSON.parse(formData.get('content') || '[]');
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid content format' },
          { status: 400 }
        );
      }

      const contentImages = formData.getAll('contentImages');
      let imageIndex = 0;

      blog.content = await Promise.all(
        content.map(async (item) => {
          if (item.type === 'image') {
            if (item.data && (item.data.startsWith('http://') || item.data.startsWith('https://'))) {
              // Existing image - keep the URL
              return {
                type: 'image',
                data: item.data,
                alt: item.alt || '',
                tag: 'image'
              };
            } else {
              // New image upload with auto-crop
              const imageFile = contentImages[imageIndex];
              imageIndex++;

              if (imageFile && imageFile.size > 0) {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const result = await new Promise((resolve, reject) => {
                  cloudinary.uploader.upload_stream(
                    {
                      folder: 'blog_content_images',
                      format: 'webp',
                      quality: 'auto',
                      width: 800,
                      height: 600,
                      crop: 'fill', // Auto crop to fill the dimensions
                      gravity: 'auto' // Auto detect the best area to focus on
                    },
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
    }

    // Calculate read time
    const wordCount = blog.content
      .filter(item => item.type === 'text')
      .reduce((count, item) => count + item.data.split(/\s+/).length, 0);
    blog.readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Update other fields
    if (formData.has('structuredData')) blog.structuredData = formData.get('structuredData');
    if (formData.has('language')) blog.language = formData.get('language');
    if (formData.has('sgeOptimized')) blog.sgeOptimized = formData.get('sgeOptimized') === 'true';
    if (formData.has('expertAuthor')) blog.expertAuthor = formData.get('expertAuthor') === 'true';
    if (formData.has('authorCredentials')) blog.authorCredentials = formData.get('authorCredentials');

    await blog.save();
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update blog' },
      { status: 500 }
    );
  }
}
