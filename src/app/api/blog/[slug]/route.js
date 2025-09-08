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
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0' },
      });
    }
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

    // Update basic fields
    if (formData.has('title')) blog.title = formData.get('title');
    if (formData.has('metaTitle')) blog.metaTitle = formData.get('metaTitle');
    if (formData.has('metaDescription')) blog.metaDescription = formData.get('metaDescription');

    if (formData.has('shortDescriptions')) {
      try {
        blog.shortDescriptions = JSON.parse(formData.get('shortDescriptions') || '[]');
        console.log('Parsed shortDescriptions:', blog.shortDescriptions);
      } catch (error) {
        console.error('Error parsing shortDescriptions:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid shortDescriptions format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }

    if (formData.has('author')) blog.author = formData.get('author');

    if (formData.has('keyPoints')) {
      try {
        blog.keyPoints = JSON.parse(formData.get('keyPoints') || '[]');
        console.log('Parsed keyPoints:', blog.keyPoints);
      } catch (error) {
        console.error('Error parsing keyPoints:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid keyPoints format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }

    if (formData.has('tags')) {
      try {
        blog.tags = JSON.parse(formData.get('tags') || '[]');
        console.log('Parsed tags:', blog.tags);
      } catch (error) {
        console.error('Error parsing tags:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid tags format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }

    if (formData.has('categories')) {
      try {
        blog.categories = JSON.parse(formData.get('categories') || '[]');
        console.log('Parsed categories:', blog.categories);
      } catch (error) {
        console.error('Error parsing categories:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid categories format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }

    // Handle main image update
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
              console.warn('No new image provided, keeping existing:', item.data);
              return {
                type: 'image',
                data: item.data,
                alt: item.alt || '',
                tag: 'image'
              };
            }
          } else if (item.type === 'link') {
            return {
              type: 'link',
              data: item.data,
              tag: 'a',
              href: item.href,
              target: item.target || '_blank'
            };
          } else {
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

    // Update SEO fields
    if (formData.has('structuredData')) blog.structuredData = formData.get('structuredData');
    if (formData.has('faqs')) {
      try {
        blog.faqs = JSON.parse(formData.get('faqs') || '[]');
        console.log('Parsed faqs:', blog.faqs);
      } catch (error) {
        console.error('Error parsing faqs:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid faqs format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
    if (formData.has('lsiKeywords')) {
      try {
        blog.lsiKeywords = JSON.parse(formData.get('lsiKeywords') || '[]');
        console.log('Parsed lsiKeywords:', blog.lsiKeywords);
      } catch (error) {
        console.error('Error parsing lsiKeywords:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid lsiKeywords format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
    if (formData.has('semanticRelatedTerms')) {
      try {
        blog.semanticRelatedTerms = JSON.parse(formData.get('semanticRelatedTerms') || '[]');
        console.log('Parsed semanticRelatedTerms:', blog.semanticRelatedTerms);
      } catch (error) {
        console.error('Error parsing semanticRelatedTerms:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid semanticRelatedTerms format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
    if (formData.has('geoLocation')) {
      try {
        blog.geoLocation = JSON.parse(formData.get('geoLocation') || '{}');
        console.log('Parsed geoLocation:', blog.geoLocation);
      } catch (error) {
        console.error('Error parsing geoLocation:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid geoLocation format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
    if (formData.has('language')) blog.language = formData.get('language');
    if (formData.has('sgeOptimized')) blog.sgeOptimized = formData.get('sgeOptimized') === 'true';
    if (formData.has('conversationalPhrases')) {
      try {
        blog.conversationalPhrases = JSON.parse(formData.get('conversationalPhrases') || '[]');
        console.log('Parsed conversationalPhrases:', blog.conversationalPhrases);
      } catch (error) {
        console.error('Error parsing conversationalPhrases:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid conversationalPhrases format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
    if (formData.has('directAnswers')) {
      try {
        blog.directAnswers = JSON.parse(formData.get('directAnswers') || '[]');
        console.log('Parsed directAnswers:', blog.directAnswers);
      } catch (error) {
        console.error('Error parsing directAnswers:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid directAnswers format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }
    if (formData.has('expertAuthor')) blog.expertAuthor = formData.get('expertAuthor') === 'true';
    if (formData.has('authorCredentials')) blog.authorCredentials = formData.get('authorCredentials');
    if (formData.has('citations')) {
      try {
        blog.citations = JSON.parse(formData.get('citations') || '[]');
        console.log('Parsed citations:', blog.citations);
      } catch (error) {
        console.error('Error parsing citations:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid citations format' },
          { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
      }
    }

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