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
      { $inc: { views: 1 } }, // Increment views
      { new: true } // Return updated document
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
    const requiredFields = ['title', 'metaTitle', 'metaDescription', 'author'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update basic fields
    blog.title = formData.get('title');
    blog.metaTitle = formData.get('metaTitle');
    blog.metaDescription = formData.get('metaDescription');
    blog.shortDescriptions = JSON.parse(formData.get('shortDescriptions') || '[]');
    blog.author = formData.get('author');
    blog.keyPoints = JSON.parse(formData.get('keyPoints') || '[]');
    blog.tags = JSON.parse(formData.get('tags') || '[]');
    blog.categories = JSON.parse(formData.get('categories') || '[]');

    // SEO ফিল্ডগুলো আপডেট করুন
    blog.structuredData = formData.get('structuredData') || '';
    blog.faqs = JSON.parse(formData.get('faqs') || '[]');
    blog.lsiKeywords = JSON.parse(formData.get('lsiKeywords') || '[]');
    blog.semanticRelatedTerms = JSON.parse(formData.get('semanticRelatedTerms') || '[]');
    blog.geoLocation = JSON.parse(formData.get('geoLocation') || '{}');
    blog.language = formData.get('language') || 'en';
    blog.sgeOptimized = formData.get('sgeOptimized') === 'true';
    blog.conversationalPhrases = JSON.parse(formData.get('conversationalPhrases') || '[]');
    blog.directAnswers = JSON.parse(formData.get('directAnswers') || '[]');
    blog.expertAuthor = formData.get('expertAuthor') === 'true';
    blog.authorCredentials = formData.get('authorCredentials') || '';
    blog.citations = JSON.parse(formData.get('citations') || '[]');

    // Handle main image update
    const mainImageFile = formData.get('mainImage');
    if (mainImageFile && mainImageFile.size > 0) {
      const arrayBuffer = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'blog_images', format: 'webp', quality: 'auto' },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(buffer);
      });
      blog.mainImage = result.secure_url;
    }

    // Process content sections
    const content = JSON.parse(formData.get('content') || '[]');
    const contentImages = formData.getAll('contentImages');
    let imageIndex = 0;

    blog.content = await Promise.all(
      content.map(async (item) => {
        if (item.type === 'image') {
          // Check if this is an existing image (has URL) or new upload (has file)
          if (item.data && (item.data.startsWith('http://') || item.data.startsWith('https://'))) {
            // Existing image - keep the URL
            return {
              type: 'image',
              data: item.data,
              alt: item.alt || '',
              tag: 'image'
            };
          } else {
            // New image upload
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
            throw new Error('Image file is missing for image content section');
          }
        } else if (item.type === 'link') {
          // লিঙ্ক কনটেন্ট প্রসেসিং
          return {
            type: 'link',
            data: item.data,
            tag: 'a',
            href: item.href,
            target: item.target || '_blank'
          };
        } else {
          // Text content
          return {
            type: 'text',
            data: item.data,
            tag: item.tag || 'p',
            bulletPoints: item.bulletPoints || []
          };
        }
      })
    );

    // Calculate read time
    const wordCount = blog.content
      .filter(item => item.type === 'text')
      .reduce((count, item) => count + item.data.split(/\s+/).length, 0);
    blog.readTime = Math.max(1, Math.ceil(wordCount / 200));

    await blog.save();
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update blog' },
      { status: 500 }
    );
  }
}