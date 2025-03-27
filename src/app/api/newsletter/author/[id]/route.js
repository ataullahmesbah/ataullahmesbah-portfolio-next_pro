// api/newsletter/author[id]/route.js

import dbConnect from "@/lib/dbMongoose";
import Newsletter from '@/models/newsletter';

export async function GET(req, { params }) {
    await dbConnect();

    try {
        const newsletters = await Newsletter.find({ authorId: params.id })
            .sort({ publishDate: -1 })
            .limit(10);

        return new Response(JSON.stringify(newsletters), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}