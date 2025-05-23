

import dbConnect from '@/lib/dbMongoose';
import SEOService from '@/models/SEOService';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const service = await SEOService.findById(id).lean();
            if (!service) {
                return NextResponse.json({ error: 'Service not found' }, { status: 404 });
            }
            return NextResponse.json(service, { status: 200 });
        } else {
            const services = await SEOService.find().lean();
            return NextResponse.json(services, { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching SEO services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const category = formData.get('category');
        const services = JSON.parse(formData.get('services'));
        const images = formData.getAll('images');

        if (!category || !services || !images || services.length !== images.length) {
            return NextResponse.json({ error: 'Missing or mismatched required fields' }, { status: 400 });
        }

        if (!Array.isArray(services) || services.some(s => !s.name || !s.description)) {
            return NextResponse.json({ error: 'Invalid services data' }, { status: 400 });
        }

        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const buffer = Buffer.from(await image.arrayBuffer());
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: 'image', format: 'webp' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    ).end(buffer);
                });
            })
        );

        const serviceData = services.map((service, index) => ({
            name: service.name,
            description: service.description,
            image: uploadedImages[index],
        }));

        const seoService = await SEOService.findOneAndUpdate(
            { category },
            { $set: { services: serviceData } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: 'Service created successfully', data: seoService }, { status: 201 });
    } catch (error) {
        console.error('Error creating SEO service:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const id = formData.get('id');
        const category = formData.get('category');
        const services = JSON.parse(formData.get('services'));
        const images = formData.getAll('images');

        if (!id || !category || !services) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!Array.isArray(services) || services.some(s => !s.name || !s.description)) {
            return NextResponse.json({ error: 'Invalid services data' }, { status: 400 });
        }

        const existingService = await SEOService.findById(id);
        if (!existingService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const uploadedImages = images.length > 0 && images[0] ? await Promise.all(
            images.map(async (image) => {
                const buffer = Buffer.from(await image.arrayBuffer());
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: 'image', format: 'webp' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    ).end(buffer);
                });
            })
        ) : null;

        const serviceData = services.map((service, index) => ({
            name: service.name,
            description: service.description,
            image: uploadedImages && uploadedImages[index] ? uploadedImages[index] : existingService.services[index]?.image || '',
        }));

        const updatedService = await SEOService.findByIdAndUpdate(
            id,
            { category, services: serviceData },
            { new: true }
        );

        if (!updatedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service updated successfully', data: updatedService }, { status: 200 });
    } catch (error) {
        console.error('Error updating SEO service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing service ID' }, { status: 400 });
        }

        const deletedService = await SEOService.findByIdAndDelete(id);

        if (!deletedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting SEO service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}