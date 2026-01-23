import dbConnect from "@/lib/dbMongoose";
import Travel from "@/models/Travel";
import cloudinary from "@/utils/cloudinary";


// Helper function to generate safe slugs
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Helper function to get transformation type based on category
function getTransformationType(category) {
    const transformationMap = {
        'Journey': 'journey',
        'Historical': 'gallery',
        'Gallery': 'gallery'
    };
    return transformationMap[category] || 'default';
}

// Helper function to upload image to Cloudinary with FIXED 1200x628 size
async function uploadToCloudinary(imageBuffer, folderName) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
                // FIXED SIZE: 1200x628 pixels for ALL categories
                transformation: [
                    {
                        width: 1200,
                        height: 628,
                        crop: 'fill', // Fill the entire area, may crop if needed
                        gravity: 'auto', // Auto-focus on important parts
                        quality: 'auto:good',
                        format: 'webp'
                    }
                ],
                // Create responsive versions for different devices
                responsive_breakpoints: {
                    create_derived: true,
                    bytes_step: 20000,
                    min_width: 320,
                    max_width: 1200,
                    max_images: 4
                },
                // Store optimized versions
                eager: [
                    // Thumbnail for grid view
                    { width: 400, height: 209, crop: 'fill', format: 'webp' },
                    // Medium for cards
                    { width: 800, height: 419, crop: 'fill', format: 'webp' },
                    // Large for detail view
                    { width: 1200, height: 628, crop: 'fill', format: 'webp' }
                ],
                eager_async: true,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) reject(error);
                else {
                    resolve({
                        original: result.secure_url,
                        thumbnail: result.eager?.[0]?.secure_url || result.secure_url,
                        medium: result.eager?.[1]?.secure_url || result.secure_url,
                        large: result.eager?.[2]?.secure_url || result.secure_url,
                        public_id: result.public_id,
                        responsive: result.responsive_breakpoints?.[0]?.breakpoints || []
                    });
                }
            }
        );
        uploadStream.end(imageBuffer);
    });
}

// Image validation
function validateImage(image) {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (image.size > MAX_FILE_SIZE) {
        throw new Error('Image size should be less than 10MB');
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
        throw new Error('Only JPEG, PNG, WebP images allowed');
    }

    return true;
}

export async function POST(req, { params }) {
    await dbConnect();
    try {
        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const location = formData.get('location');
        const category = formData.get('category');
        const image = formData.get('image');

        // Validation
        if (!title || !description || !location || !category || !image) {
            return new Response(
                JSON.stringify({ error: 'All fields are required' }),
                { status: 400 }
            );
        }

        const slug = generateSlug(title);

        // Validate image
        validateImage(image);

        // Upload image to Cloudinary with FIXED 1200x628 size
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const imageData = await uploadToCloudinary(imageBuffer, 'mesbahoffwego');

        if (category === 'Journey') {
            const existingJourney = await Travel.findOne({ category: 'Journey' });
            if (existingJourney) {
                // Update existing Journey
                const updatedJourney = await Travel.findOneAndUpdate(
                    { category: 'Journey' },
                    {
                        title,
                        slug,
                        description,
                        imageUrl: imageData.large, // Use large version (1200x628)
                        imageUrls: imageData,
                        location
                    },
                    { new: true }
                );
                return new Response(
                    JSON.stringify({
                        success: true,
                        data: updatedJourney,
                        message: 'Journey updated successfully'
                    }),
                    { status: 200 }
                );
            }
        }

        // Add new entry for non-Journey categories
        const travel = new Travel({
            title,
            slug,
            description,
            imageUrl: imageData.large, // Use large version (1200x628)
            imageUrls: imageData,
            location,
            category
        });
        await travel.save();

        return new Response(
            JSON.stringify({
                success: true,
                data: travel,
                message: 'Travel added successfully'
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in POST:', error);
        return new Response(
            JSON.stringify({
                error: error.message || 'Failed to add/update travel'
            }),
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const { slug } = params;
        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const location = formData.get('location');
        const category = formData.get('category');
        const image = formData.get('image');

        let updateData = {
            title,
            description,
            location,
            category,
            slug: generateSlug(title)
        };

        if (image && image.size > 0) {
            // Validate new image
            validateImage(image);

            const imageBuffer = Buffer.from(await image.arrayBuffer());
            const imageData = await uploadToCloudinary(imageBuffer, 'mesbahoffwego');

            updateData.imageUrl = imageData.large; // Use large version (1200x628)
            updateData.imageUrls = imageData;
        }

        const travel = await Travel.findOneAndUpdate(
            { slug },
            updateData,
            { new: true, runValidators: true }
        );

        if (!travel) {
            return new Response(
                JSON.stringify({ error: 'Travel not found' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: travel,
                message: 'Travel updated successfully'
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in PUT:', error);
        return new Response(
            JSON.stringify({
                error: error.message || 'Failed to update travel'
            }),
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const { slug } = params;
        const travel = await Travel.findOneAndDelete({ slug });
        if (!travel) throw new Error('Travel not found');
        return new Response(JSON.stringify({ message: 'Travel deleted' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete travel' }), { status: 500 });
    }
}


