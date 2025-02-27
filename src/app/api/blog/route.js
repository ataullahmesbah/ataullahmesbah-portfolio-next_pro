// src/app/api/blog/route.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import Blog from '@/models/Blog';
import { connectDB } from '@/lib/dbConnect';


// GET all blogs
export async function GET() {
  try {
    const db = await connectDB();
    console.log('✅ Connected to MongoDB');

    const blogs = await db.collection('blogs').find().sort({ publishDate: -1 }).toArray();
    console.log('Fetched blogs from MongoDB:', blogs); // Log the fetched blogs

    return NextResponse.json(blogs);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


// POST a new blog (protected route)
export async function POST(request) {
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const newBlog = new Blog(body);
        await newBlog.save();
        return NextResponse.json(newBlog, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}