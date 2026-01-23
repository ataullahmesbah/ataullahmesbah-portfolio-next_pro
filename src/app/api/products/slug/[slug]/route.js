// api/products/slug[slug]/route.js

import dbConnect from '@/lib/dbMongoose';
import Product from '@/models/Products';


export async function GET(request, { params }) {
    await dbConnect();
    try {
        const product = await Product.findOne({ slug: params.slug })
            .populate('category')
            .lean();
        if (!product) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }
        return Response.json(product, { status: 200 });
    } catch (error) {
     
        return Response.json({ error: `Failed to fetch product: ${error.message}` }, { status: 500 });
    }
}