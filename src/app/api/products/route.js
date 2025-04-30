
import cloudinary from '@/utils/cloudinary';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';
import { getServerSession } from 'next-auth';
import Product from '@/models/Product';

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
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const formData = await request.formData();

        // Log form data for debugging
        console.log('Form Data:', Object.fromEntries(formData));

        // Validate required fields
        if (!formData.get('title')) {
            return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
        }
        if (!formData.get('bdtPrice')) {
            return new Response(JSON.stringify({ error: 'BDT price is required' }), { status: 400 });
        }
        if (!formData.get('description')) {
            return new Response(JSON.stringify({ error: 'Description is required' }), { status: 400 });
        }
        if (!formData.get('mainImage')) {
            return new Response(JSON.stringify({ error: 'Main image is required' }), { status: 400 });
        }

        // Process prices
        const prices = [];
        if (formData.get('bdtPrice')) {
            prices.push({
                currency: 'BDT',
                amount: parseFloat(formData.get('bdtPrice')),
            });
        }
        if (formData.get('usdPrice')) {
            prices.push({
                currency: 'USD',
                amount: parseFloat(formData.get('usdPrice')),
                exchangeRate: parseFloat(formData.get('usdExchangeRate')) || undefined,
            });
        }
        if (formData.get('eurPrice')) {
            prices.push({
                currency: 'EUR',
                amount: parseFloat(formData.get('eurPrice')),
                exchangeRate: parseFloat(formData.get('eurExchangeRate')) || undefined,
            });
        }

        if (prices.length === 0) {
            return new Response(JSON.stringify({ error: 'At least one price (BDT) is required' }), { status: 400 });
        }

        // Upload main image
        const mainImageFile = formData.get('mainImage');
        const mainImageArrayBuffer = await mainImageFile.arrayBuffer();
        const mainImageBuffer = Buffer.from(mainImageArrayBuffer);
        const mainImageResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'products', format: 'webp' },
                (error, result) => (error ? reject(error) : resolve(result))
            ).end(mainImageBuffer);
        });

        // Upload additional images (max 5)
        let additionalImagesFiles = formData.getAll('additionalImages');
        // Ensure additionalImagesFiles is an array
        if (!Array.isArray(additionalImagesFiles)) {
            additionalImagesFiles = additionalImagesFiles ? [additionalImagesFiles] : [];
        }
        const additionalImages = await Promise.all(
            additionalImagesFiles.slice(0, 5).map(async (file) => {
                if (!file || !file.size) return null; // Skip empty files
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'products/additional', format: 'webp' },
                        (error, result) => (error ? reject(error) : resolve(result.secure_url))
                    ).end(buffer);
                });
            })
        ).then((results) => results.filter((url) => url)); // Filter null values after Promise.all resolves

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

        const product = new Product({
            title: formData.get('title'),
            prices,
            mainImage: mainImageResult.secure_url,
            additionalImages,
            description: formData.get('description'),
            descriptions,
            bulletPoints,
            productType: formData.get('productType'),
            affiliateLink: formData.get('productType') === 'Affiliate' ? formData.get('affiliateLink') : undefined,
            owner: session.user.name, // Only store name
        });

        await product.save();
        return new Response(JSON.stringify(product), { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
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