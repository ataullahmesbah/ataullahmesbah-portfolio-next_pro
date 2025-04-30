
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbMongoose';
import cloudinary from '@/utils/cloudinary';
import Products from '@/models/Products';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET: Fetch single product
export async function GET(request, { params }) {
    await dbConnect();
    try {
        const product = await Products.findById(params.id);
        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch product' }), { status: 500 });
    }
}

// PUT: Update a product
export async function PUT(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const price = parseFloat(formData.get('price'));
        const description = formData.get('description');
        const productType = formData.get('productType');
        const affiliateLink = formData.get('affiliateLink');
        const bulletPoints = JSON.parse(formData.get('bulletPoints'));
        const mainImageFile = formData.get('mainImage');
        const additionalImagesFiles = formData.getAll('additionalImages');

        const updateData = {
            title,
            price,
            description,
            productType,
            affiliateLink: productType === 'Affiliate' ? affiliateLink : null,
            bulletPoints,
        };

        if (mainImageFile) {
            const mainImageUpload = await cloudinary.uploader.upload(mainImageFile, {
                folder: 'portfolio-shop',
                format: 'webp',
            });
            updateData.mainImage = mainImageUpload.secure_url;
        }

        if (additionalImagesFiles.length > 0) {
            const additionalImages = [];
            for (const file of additionalImagesFiles) {
                const upload = await cloudinary.uploader.upload(file, {
                    folder: 'portfolio-shop',
                    format: 'webp',
                });
                additionalImages.push(upload.secure_url);
            }
            updateData.additionalImages = additionalImages;
        }

        const product = await Products.findByIdAndUpdate(params.id, updateData, { new: true });
        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update product' }), { status: 500 });
    }
}

// DELETE: Delete a product
export async function DELETE(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const product = await Products.findByIdAndDelete(params.id);
        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
    }
}