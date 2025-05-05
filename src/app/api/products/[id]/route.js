
import Product from '@/models/Products';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';


export async function GET(request, { params }) {
    await dbConnect();
    try {
        const productId = params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return Response.json({ error: 'Invalid product ID' }, { status: 400 });
        }
        const product = await Product.findById(productId).populate('category').lean();
        if (!product) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }
        return Response.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
        return Response.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        console.error('DELETE /api/products/[id]: Unauthorized - No session');
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const productId = params.id;
        console.log('DELETE /api/products/[id]: Attempting to delete product:', productId);
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error('DELETE /api/products/[id]: Invalid product ID:', productId);
            return Response.json({ error: 'Invalid product ID' }, { status: 400 });
        }
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            console.error('DELETE /api/products/[id]: Product not found:', productId);
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }
        console.log('DELETE /api/products/[id]: Product deleted:', productId);
        return Response.json({ message: 'Product deleted' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/products/[id]: Error deleting product:', error);
        return Response.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        console.error('PUT /api/products/[id]: Unauthorized - No session');
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const productId = params.id;
        console.log('PUT /api/products/[id]: Attempting to update product:', productId);
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error('PUT /api/products/[id]: Invalid product ID:', productId);
            return Response.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const formData = await request.formData();
        console.log('PUT /api/products/[id]: FormData entries:', [...formData.entries()]);

        // Extract fields
        const title = formData.get('title');
        const bdtPrice = parseFloat(formData.get('bdtPrice'));
        const usdPrice = formData.get('usdPrice') ? parseFloat(formData.get('usdPrice')) : null;
        const eurPrice = formData.get('eurPrice') ? parseFloat(formData.get('eurPrice')) : null;
        const usdExchangeRate = formData.get('usdExchangeRate') ? parseFloat(formData.get('usdExchangeRate')) : null;
        const eurExchangeRate = formData.get('eurExchangeRate') ? parseFloat(formData.get('eurExchangeRate')) : null;
        const description = formData.get('description');
        const descriptions = formData.get('descriptions')?.split('|||').filter((desc) => desc.trim()) || [];
        const bulletPoints = formData.get('bulletPoints')?.split(',').map((point) => point.trim()).filter(Boolean) || [];
        const productType = formData.get('productType');
        const affiliateLink = formData.get('affiliateLink') || null;
        const categoryId = formData.get('category');
        const newCategory = formData.get('newCategory');
        const mainImage = formData.get('mainImage');
        const existingMainImage = formData.get('existingMainImage');
        const additionalImages = formData.getAll('additionalImages').filter((img) => img.size > 0);
        const existingAdditionalImages = formData.get('existingAdditionalImages')
            ? JSON.parse(formData.get('existingAdditionalImages'))
            : [];

        // Validate required fields
        if (!title || isNaN(bdtPrice) || bdtPrice <= 0 || !description || (!categoryId && !newCategory) || (!mainImage && !existingMainImage)) {
            console.error('PUT /api/products/[id]: Missing or invalid required fields');
            return Response.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        // Handle category
        let category;
        if (newCategory) {
            category = await Category.findOneAndUpdate(
                { name: newCategory },
                { name: newCategory },
                { upsert: true, new: true }
            );
        } else if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            category = await Category.findById(categoryId);
            if (!category) {
                console.error('PUT /api/products/[id]: Category not found:', categoryId);
                return Response.json({ error: 'Category not found' }, { status: 404 });
            }
        } else {
            console.error('PUT /api/products/[id]: Invalid category ID:', categoryId);
            return Response.json({ error: 'Invalid category ID' }, { status: 400 });
        }

        // Handle images
        let mainImageUrl = existingMainImage;
        if (mainImage && mainImage.size > 0) {
            const mainImageStream = Readable.from(mainImage.stream());
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                mainImageStream.pipe(uploadStream);
            });
            mainImageUrl = uploadResult.secure_url;
        }

        const additionalImageUrls = [...existingAdditionalImages];
        for (const img of additionalImages) {
            const imgStream = Readable.from(img.stream());
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                imgStream.pipe(uploadStream);
            });
            additionalImageUrls.push(uploadResult.secure_url);
        }

        // Prepare prices
        const prices = [{ currency: 'BDT', amount: bdtPrice }];
        if (usdPrice && usdExchangeRate) {
            prices.push({ currency: 'USD', amount: usdPrice, exchangeRate: usdExchangeRate });
        }
        if (eurPrice && eurExchangeRate) {
            prices.push({ currency: 'EUR', amount: eurPrice, exchangeRate: eurExchangeRate });
        }

        // Generate slug
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                title,
                slug,
                prices,
                category: category._id,
                description,
                descriptions,
                bulletPoints,
                productType,
                affiliateLink,
                mainImage: mainImageUrl,
                additionalImages: additionalImageUrls,
                owner: session.user.name,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedProduct) {
            console.error('PUT /api/products/[id]: Product not found:', productId);
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }

        console.log('PUT /api/products/[id]: Product updated:', productId);
        return Response.json({ message: 'Product updated', product: updatedProduct }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/products/[id]: Error updating product:', error);
        return Response.json({ error: `Failed to update product: ${error.message}` }, { status: 500 });
    }
}