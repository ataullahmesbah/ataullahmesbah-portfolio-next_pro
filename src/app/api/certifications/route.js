import { NextResponse } from 'next/server';
import Certification from '@/models/Certification';
import { getServerSession } from 'next-auth/next';
import cloudinary from '@/utils/cloudinary';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    try {
        await dbConnect();
        const certifications = await Certification.find().lean();
        return NextResponse.json(certifications);
    } catch (error) {
        console.error('GET certifications error:', error);
        return NextResponse.json({ message: 'Failed to fetch certifications' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const niche = formData.get('niche');
        const title = formData.get('title');
        const issuer = formData.get('issuer');
        const credentialId = formData.get('credentialId');
        const image = formData.get('image');

        if (!niche || !title || !issuer || !image) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'certifications', format: 'webp' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            image.stream().pipe(stream);
        });

        await dbConnect();
        const certification = await Certification.create({
            niche,
            title,
            issuer,
            credentialId,
            image: uploadResult.secure_url,
        });

        return NextResponse.json(certification, { status: 201 });
    } catch (error) {
        console.error('POST certification error:', error);
        return NextResponse.json({ message: 'Failed to create certification' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const id = formData.get('id');
        const niche = formData.get('niche');
        const title = formData.get('title');
        const issuer = formData.get('issuer');
        const credentialId = formData.get('credentialId');
        const image = formData.get('image');

        if (!id || !niche || !title || !issuer) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        const updateData = { niche, title, issuer, credentialId };

        if (image && image.size > 0) {
            // Upload new image to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'certifications', format: 'webp' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                image.stream().pipe(stream);
            });
            updateData.image = uploadResult.secure_url;
        }

        const certification = await Certification.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!certification) {
            return NextResponse.json({ message: 'Certification not found' }, { status: 404 });
        }

        return NextResponse.json(certification);
    } catch (error) {
        console.error('PUT certification error:', error);
        return NextResponse.json({ message: 'Failed to update certification' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ message: 'Certification ID required' }, { status: 400 });
        }

        await dbConnect();
        const certification = await Certification.findByIdAndDelete(id);
        if (!certification) {
            return NextResponse.json({ message: 'Certification not found' }, { status: 404 });
        }

        // Delete image from Cloudinary
        if (certification.image) {
            const publicId = certification.image.match(/certifications\/(.+)\.webp$/i)?.[1];
            if (publicId) {
                await cloudinary.uploader.destroy(`certifications/${publicId}`);
            }
        }

        return NextResponse.json({ message: 'Certification deleted' });
    } catch (error) {
        console.error('DELETE certification error:', error);
        return NextResponse.json({ message: 'Failed to delete certification' }, { status: 500 });
    }
}