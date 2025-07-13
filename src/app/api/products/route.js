
import cloudinary from '@/utils/cloudinary';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';
import { getServerSession } from 'next-auth';
import Product from '@/models/Products';
import Category from '@/models/Category';
import mongoose from 'mongoose';



// Sort function for additional images by lastModified date
const ascendingSort = (a, b) => {
    if (a instanceof File && b instanceof File) {
        return b.lastModified - a.lastModified;
    }
    return 0;
};

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Handle fetching categories
    if (searchParams.get('type') === 'categories') {
        try {
            const categories = await Category.find({}).lean();
            return Response.json(categories, { status: 200 });
        } catch (error) {
            return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
        }
    }

    // Handle fetching products
    try {
        const products = await Product.find({}).populate('category').lean();
        return Response.json(products, { status: 200 });
    } catch (error) {
        return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.name) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        console.log('Received formData quantity:', formData.get('quantity')); // Debug log

        // Validate required fields
        const requiredFields = ['title', 'bdtPrice', 'description', 'mainImage', 'productType', 'quantity', 'product_code'];
        const missingFields = requiredFields.filter((field) => !formData.get(field) && formData.get(field) !== '');
        if (missingFields.length > 0) {
            return Response.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate productType
        if (!['Own', 'Affiliate'].includes(formData.get('productType'))) {
            return Response.json({ error: 'Invalid product type' }, { status: 400 });
        }

        // Validate affiliateLink for Affiliate products
        if (formData.get('productType') === 'Affiliate' && !formData.get('affiliateLink')) {
            return Response.json({ error: 'Affiliate link is required for affiliate products' }, { status: 400 });
        }

        // Validate prices
        const bdtPrice = parseFloat(formData.get('bdtPrice'));
        if (isNaN(bdtPrice) || bdtPrice <= 0) {
            return Response.json({ error: 'BDT price must be a positive number' }, { status: 400 });
        }

        // Validate quantity
        const quantityRaw = formData.get('quantity');
        const quantity = parseInt(quantityRaw, 10);
        console.log('Parsed quantity:', quantity); // Debug log
        if (isNaN(quantity) || quantity < 0) {
            return Response.json(
                { error: `Quantity must be a non-negative integer, received: ${quantityRaw}` },
                { status: 400 }
            );
        }

        // Process prices
        const prices = [{ currency: 'BDT', amount: bdtPrice }];
        if (formData.get('usdPrice')) {
            const usdPrice = parseFloat(formData.get('usdPrice'));
            if (isNaN(usdPrice) || usdPrice <= 0) {
                return Response.json({ error: 'USD price must be a positive number' }, { status: 400 });
            }
            prices.push({
                currency: 'USD',
                amount: usdPrice,
                exchangeRate: parseFloat(formData.get('usdExchangeRate')) || undefined,
            });
        }
        if (formData.get('eurPrice')) {
            const eurPrice = parseFloat(formData.get('eurPrice'));
            if (isNaN(eurPrice) || eurPrice <= 0) {
                return Response.json({ error: 'EUR price must be a positive number' }, { status: 400 });
            }
            prices.push({
                currency: 'EUR',
                amount: eurPrice,
                exchangeRate: parseFloat(formData.get('eurExchangeRate')) || undefined,
            });
        }

        // Handle category
        let categoryId;
        const categoryInput = formData.get('category');
        const newCategoryName = formData.get('newCategory');

        if (!categoryInput && !newCategoryName) {
            return Response.json({ error: 'Category or new category name is required' }, { status: 400 });
        }

        if (newCategoryName && newCategoryName.trim()) {
            const slug = newCategoryName
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            let category = await Category.findOne({ slug });
            if (!category) {
                category = new Category({
                    name: newCategoryName.trim(),
                    slug,
                });
                await category.save();
            }
            categoryId = category._id;
        } else if (categoryInput && mongoose.Types.ObjectId.isValid(categoryInput)) {
            const category = await Category.findById(categoryInput);
            if (!category) {
                return Response.json({ error: 'Invalid category' }, { status: 400 });
            }
            categoryId = category._id;
        } else {
            return Response.json({ error: 'Invalid category selection' }, { status: 400 });
        }

        // Upload main image
        const mainImageFile = formData.get('mainImage');
        if (!(mainImageFile instanceof File) || mainImageFile.size === 0) {
            return Response.json({ error: 'Main image is required and must be a valid file' }, { status: 400 });
        }
        if (!mainImageFile.type.startsWith('image/')) {
            return Response.json({ error: 'Main image must be an image file' }, { status: 400 });
        }
        if (mainImageFile.size > 5 * 1024 * 1024) {
            return Response.json({ error: 'Main image size must be less than 5MB' }, { status: 400 });
        }
        const mainImageArrayBuffer = await mainImageFile.arrayBuffer();
        const mainImageBuffer = Buffer.from(mainImageArrayBuffer);
        const mainImageResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'products', format: 'webp' },
                (error, result) => (error ? reject(error) : resolve(result))
            ).end(mainImageBuffer);
        });

        // Upload additional images (max 5)
        let additionalImagesFiles = formData.getAll('additionalImages').filter((file) => file instanceof File && file.size > 0);
        additionalImagesFiles = additionalImagesFiles.sort(ascendingSort);
        const additionalImages = await Promise.all(
            additionalImagesFiles.slice(0, 5).map(async (file) => {
                if (!file.type.startsWith('image/')) {
                    throw new Error(`Additional image ${file.name} must be an image file`);
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`Additional image ${file.name} size must be less than 5MB`);
                }
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'products/additional', format: 'webp' },
                        (error, result) => (error ? reject(error) : resolve(result.secure_url))
                    ).end(buffer);
                });
            })
        );

        // Process bullet points
        const bulletPoints = formData.get('bulletPoints')
            ? formData.get('bulletPoints')
                .split(',')
                .map((point) => point.trim())
                .filter((point) => point.length > 0)
            : [];

        // Process additional descriptions
        const descriptions = formData.get('descriptions')
            ? formData.get('descriptions')
                .split('|||')
                .map((desc) => desc.trim())
                .filter((desc) => desc.length > 0)
            : [];

        // Generate slug from title
        let slug = formData.get('title')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        // Ensure slug uniqueness
        let slugCount = 0;
        let uniqueSlug = slug;
        while (await Product.findOne({ slug: uniqueSlug })) {
            slugCount++;
            uniqueSlug = `${slug}-${slugCount}`;
        }

        const product = new Product({
            title: formData.get('title'),
            slug: uniqueSlug,
            prices,
            mainImage: mainImageResult.secure_url,
            additionalImages,
            description: formData.get('description'),
            product_code: formData.get('product_code'),
            descriptions,
            bulletPoints,
            productType: formData.get('productType'),
            affiliateLink: formData.get('productType') === 'Affiliate' ? formData.get('affiliateLink') : undefined,
            owner: session.user.name,
            category: categoryId,
            quantity,
        });

        console.log('Product to save:', product); // Debug log
        await product.save();
        return Response.json(product, { status: 201 });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return Response.json({ error: `Validation failed: ${errors.join(', ')}` }, { status: 400 });
        }
        if (error.message.includes('image')) {
            return Response.json({ error: error.message }, { status: 400 });
        }
        return Response.json({ error: `Failed to create product: ${error.message}` }, { status: 500 });
    }
}