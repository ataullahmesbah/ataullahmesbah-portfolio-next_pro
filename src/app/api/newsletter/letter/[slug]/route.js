// src/app/api/newsletter/letter/[slug]/route.js
import dbConnect from '@/lib/dbMongoose';
import Newsletter from '@/models/newsletter';
import { NextResponse } from 'next/server';

// GET: Fetch a single newsletter by slug and increment views
export async function GET(request, { params }) {
    await dbConnect();

    try {
        const { slug } = params;
        const newsletter = await Newsletter.findOne({ slug });

        if (!newsletter) {
            return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
        }

        // Increment views
        newsletter.views = (newsletter.views || 0) + 1;
        await newsletter.save();

        return NextResponse.json(newsletter.toObject(), { status: 200 });
    } catch (error) {
        console.error('Error fetching newsletter:', error);
        return NextResponse.json({ error: 'Failed to fetch newsletter', message: error.message }, { status: 500 });
    }
}