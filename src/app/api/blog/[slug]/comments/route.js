// src/app/api/blog/[slug]/comments/route.js
import { NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

import Blog from '@/models/Blog';
import { connectDB } from '@/lib/dbConnect';


// POST a new comment (protected route)
export async function POST(request, { params }) {
    await connectDB();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;
    const { comment } = await request.json();

    try {
        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }

        // Add comment to the blog
        blog.comments.push({ user: token.userId, comment });
        await blog.save();

        return NextResponse.json(blog, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}