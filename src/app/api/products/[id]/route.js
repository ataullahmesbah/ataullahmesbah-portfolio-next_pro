

//app/api/products/[id]/route.js

import Product from '@/models/Products';
import { getServerSession } from 'next-auth/next';
import Category from '@/models/Category';
import slugify from 'slugify';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';
import cloudinary from '@/utils/cloudinary';
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
        return Response.json({ error: `Failed to fetch product: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const productId = params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return Response.json({ error: 'Invalid product ID' }, { status: 400 });
        }
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }
        return Response.json({ message: 'Product deleted' }, { status: 200 });
    } catch (error) {
        return Response.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const productId = params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return Response.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const formData = await request.formData();
        const title = formData.get('title');
        const bdtPrice = parseFloat(formData.get('bdtPrice'));
        const usdPrice = formData.get('usdPrice') ? parseFloat(formData.get('usdPrice')) : null;
        const eurPrice = formData.get('eurPrice') ? parseFloat(formData.get('eurPrice')) : null;
        const usdExchangeRate = formData.get('usdExchangeRate') ? parseFloat(formData.get('usdExchangeRate')) : null;
        const eurExchangeRate = formData.get('eurExchangeRate') ? parseFloat(formData.get('eurExchangeRate')) : null;
        const description = formData.get('description');
        const product_code = formData.get('product_code');
        const descriptions = formData.get('descriptions')?.split('|||')?.filter((desc) => desc.trim()) || [];
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
        const quantity = parseInt(formData.get('quantity')); // Added quantity

        // Validate required fields
        if (!title || !bdtPrice || !description || !product_code || (!categoryId && !newCategory) || (!mainImage && !existingMainImage) || isNaN(quantity) || quantity < 0) {
            return Response.json({ error: 'Missing required fields or invalid quantity' }, { status: 400 });
        }

        // Handle category
        let category;
        if (newCategory) {
            category = await Category.findOneAndUpdate(
                { name: newCategory },
                { name: newCategory, slug: slugify(newCategory, { lower: true, strict: true }) },
                { upsert: true, new: true }
            );
        } else {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return Response.json({ error: 'Invalid category ID' }, { status: 400 });
            }
            category = await Category.findById(categoryId);
            if (!category) {
                return Response.json({ error: 'Category not found' }, { status: 404 });
            }
        }

        // Handle image uploads
        let mainImageUrl = existingMainImage;
        if (mainImage && mainImage.size > 0) {
            const buffer = Buffer.from(await mainImage.arrayBuffer());
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                stream.end(buffer);
            });
            mainImageUrl = uploadResult.secure_url;
        }

        // Initialize additionalImageUrls with existing images
        let additionalImageUrls = Array.isArray(existingAdditionalImages) ? [...existingAdditionalImages] : [];
        for (const image of additionalImages) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'products' },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                stream.end(buffer);
            });
            additionalImageUrls.push(uploadResult.secure_url);
        }

        // Prepare prices
        const prices = [{ currency: 'BDT', amount: bdtPrice }];
        if (usdPrice) {
            prices.push({ currency: 'USD', amount: usdPrice, exchangeRate: usdExchangeRate });
        }
        if (eurPrice) {
            prices.push({ currency: 'EUR', amount: eurPrice, exchangeRate: eurExchangeRate });
        }

        // Update product
        const slug = slugify(title, { lower: true, strict: true });
        const product = await Product.findByIdAndUpdate(
            productId,
            {
                title,
                slug,
                prices,
                description,
                descriptions,
                bulletPoints,
                productType,
                affiliateLink,
                category: category._id,
                mainImage: mainImageUrl,
                additionalImages: additionalImageUrls,
                owner: session.user.name,
                quantity, // Added quantity
                product_code,
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }

        return Response.json({ message: 'Product updated', product }, { status: 200 });
    } catch (error) {
        return Response.json({ error: `Failed to update product: ${error.message}` }, { status: 500 });
    }
}