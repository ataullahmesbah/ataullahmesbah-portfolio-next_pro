// src/app/api/newsletter/letter/[slug]/route.js

import dbConnect from '@/lib/dbMongoose';
import Newsletter from '@/models/newsletter';
import { NextResponse } from 'next/server';



export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const newsletter = await Newsletter.findOne({ slug });

    if (!newsletter) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      );
    }

    // Increment views
    newsletter.views = (newsletter.views || 0) + 1;
    await newsletter.save();

    return NextResponse.json(newsletter, { status: 200 });
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter', message: error.message },
      { status: 500 }
    );
  }
}

// Add HEAD method for better SEO
export async function HEAD(request, { params }) {
  await dbConnect();

  try {
    const { slug } = params;
    const newsletter = await Newsletter.findOne({ slug });

    if (!newsletter) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}