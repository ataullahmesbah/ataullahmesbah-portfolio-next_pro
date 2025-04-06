import dbConnect from "@/lib/dbMongoose";
import Travel from "@/models/Travel";
import cloudinary from "@/utils/cloudinary";

// Helper function to generate safe slugs
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/&/g, 'and') // Replace & with 'and'
        .replace(/[^\w\s-]/g, '') // Remove all non-word chars except spaces and hyphens
        .trim() // Trim whitespace
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Replace multiple - with single -
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

        const slug = generateSlug(title); // Use the safe slug generator

        // Upload image to Cloudinary
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const imageUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { format: 'webp', folder: 'mesbahoffwego' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            );
            uploadStream.end(imageBuffer);
        });

        if (category === 'Journey') {
            const existingJourney = await Travel.findOne({ category: 'Journey' });
            if (existingJourney) {
                // Update existing Journey
                const updatedJourney = await Travel.findOneAndUpdate(
                    { category: 'Journey' },
                    { title, slug, description, imageUrl, location },
                    { new: true }
                );
                return new Response(JSON.stringify(updatedJourney), { status: 200 });
            }
        }

        // Add new entry for non-Journey categories
        const travel = new Travel({ title, slug, description, imageUrl, location, category });
        await travel.save();
        return new Response(JSON.stringify(travel), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to add/update travel' }), { status: 500 });
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

        let updateData = { title, description, location, category };
        updateData.slug = generateSlug(title); // Use the safe slug generator

        if (image) {
            const imageBuffer = Buffer.from(await image.arrayBuffer());
            const imageUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { format: 'webp', folder: 'mesbahoffwego' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                uploadStream.end(imageBuffer);
            });
            updateData.imageUrl = imageUrl;
        }

        const travel = await Travel.findOneAndUpdate({ slug }, updateData, { new: true });
        if (!travel) throw new Error('Travel not found');
        return new Response(JSON.stringify(travel), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update travel' }), { status: 500 });
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