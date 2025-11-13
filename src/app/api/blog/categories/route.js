// src/app/api/blog/categories/route.js

import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    await dbConnect();


    //  Remove status condition
    const categories = await Blog.distinct('categories', {});

    // Filter out null/undefined and ensure array
    const validCategories = (categories || []).filter(cat =>
      cat && typeof cat === 'string' && cat.trim().length > 0
    );



    return NextResponse.json(validCategories, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error) {

    return NextResponse.json([], {
      status: 500,
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}