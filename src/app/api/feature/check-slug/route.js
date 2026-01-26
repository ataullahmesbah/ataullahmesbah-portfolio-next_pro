// app/api/feature/check-slug/route.js
import dbConnect from '@/lib/dbMongoose';
import FeaturedStory from '@/models/FeaturedStory';
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
        }

        const existingStory = await FeaturedStory.findOne({ slug });

        return NextResponse.json({
            exists: !!existingStory,
            slug: slug
        });

    } catch (error) {
        
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}