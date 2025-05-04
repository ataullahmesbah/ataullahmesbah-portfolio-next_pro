
import cloudinary from '@/utils/cloudinary';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';
import { getServerSession } from 'next-auth';


export async function GET(request) {
    await dbConnect();
    try {
        const products = await Product.find({}).lean(); // Fetch all products
        if (!products || products.length === 0) {
            return new Response(JSON.stringify({ message: 'No products found' }), { status: 200 });
        }
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
    }
}


export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        // Validate required fields
        const requiredFields = ['title', 'bdtPrice', 'description', 'mainImage'];
        const missingFields = requiredFields.filter(field => !formData.get(field));

        if (missingFields.length > 0) {
            return Response.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Process prices
        const prices = [{
            currency: 'BDT',
            amount: parseFloat(formData.get('bdtPrice'))
        }];

        if (formData.get('usdPrice')) {
            prices.push({
                currency: 'USD',
                amount: parseFloat(formData.get('usdPrice')),
                exchangeRate: parseFloat(formData.get('usdExchangeRate')) || undefined
            });
        }

        if (formData.get('eurPrice')) {
            prices.push({
                currency: 'EUR',
                amount: parseFloat(formData.get('eurPrice')),
                exchangeRate: parseFloat(formData.get('eurExchangeRate')) || undefined
            });
        }

        // Upload main image
        const mainImageFile = formData.get('mainImage');
        const mainImageArrayBuffer = await mainImageFile.arrayBuffer();
        const mainImageBuffer = Buffer.from(mainImageArrayBuffer);
        const mainImageResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'products', format: 'webp' },
                (error, result) => error ? reject(error) : resolve(result)
            ).end(mainImageBuffer);
        });

        // Upload additional images
        const additionalImages = [];
        const additionalImagesFiles = formData.getAll('additionalImages');

        for (const file of additionalImagesFiles) {
            if (file.size > 0) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'products/additional', format: 'webp' },
                        (error, result) => error ? reject(error) : resolve(result)
                    ).end(buffer);
                });
                additionalImages.push(uploadResult.secure_url);
            }
        }

        // Process bullet points
        const bulletPoints = formData.get('bulletPoints')
            ? formData.get('bulletPoints')
                .split(',')
                .map(point => point.trim())
                .filter(point => point.length > 0)
            : [];

        const product = new Product({
            title: formData.get('title'),
            prices,
            mainImage: mainImageResult.secure_url,
            additionalImages,
            description: formData.get('description'),
            bulletPoints,
            productType: formData.get('productType'),
            affiliateLink: formData.get('productType') === 'Affiliate'
                ? formData.get('affiliateLink')
                : undefined,
            owner: {
                id: session.user.id,
                name: session.user.name
            }
        });

        await product.save();
        return Response.json(product, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return Response.json(
            { error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const product = await Product.findByIdAndDelete(params.id);
        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
    }
}