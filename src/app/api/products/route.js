
import cloudinary from '@/utils/cloudinary';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';
import { getServerSession } from 'next-auth';
import Products from '@/models/Products';


export async function GET(request) {
  await dbConnect();
  try {
    const products = await Products.find({}).lean();
    if (!products || products.length === 0) {
      return Response.json({ message: 'No products found' }, { status: 200 });
    }
    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
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

    // Log form data for debugging
    console.log('Form Data:', Object.fromEntries(formData));

    // Validate required fields
    const requiredFields = ['title', 'bdtPrice', 'description', 'mainImage', 'productType'];
    const missingFields = requiredFields.filter((field) => !formData.get(field));
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

    // Upload main image
    const mainImageFile = formData.get('mainImage');
    if (!mainImageFile.size) {
      return Response.json({ error: 'Main image is invalid' }, { status: 400 });
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
    const additionalImagesFiles = formData.getAll('additionalImages').filter((file) => file.size > 0);
    const additionalImages = await Promise.all(
      additionalImagesFiles.slice(0, 5).map(async (file) => {
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
      owner: session.user.name,
    });

    await product.save();
    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return Response.json({ error: `Validation failed: ${errors.join(', ')}` }, { status: 400 });
    }
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
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
    console.error('Error deleting product:', error);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}