
import dbConnect from '@/lib/dbMongoose';
import WebDevelopment from '@/models/WebDevelopment';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const service = await WebDevelopment.findById(id).lean();
            if (!service) {
                return NextResponse.json({ error: 'Service not found' }, { status: 404 });
            }
            return NextResponse.json(service, { status: 200 });
        } else {
            const services = await WebDevelopment.find().lean();
            return NextResponse.json(services, { status: 200 });
        }
    } catch (error) {

        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const category = formData.get('category');
        const services = JSON.parse(formData.get('services'));

        if (!category || !services || !Array.isArray(services) || services.length === 0) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        if (services.some(s => !s.name || !s.description)) {
            return NextResponse.json({ error: 'Invalid service data' }, { status: 400 });
        }

        const serviceData = { category, services };
        const webService = await WebDevelopment.create(serviceData);

        return NextResponse.json({ message: 'Service created successfully', data: webService }, { status: 201 });
    } catch (error) {

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

        if (!id || !category || !services || !Array.isArray(services) || services.length === 0) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        if (services.some(s => !s.name || !s.description)) {
            return NextResponse.json({ error: 'Invalid service data' }, { status: 400 });
        }

        const updatedService = await WebDevelopment.findByIdAndUpdate(
            id,
            { category, services },
            { new: true }
        );

        if (!updatedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service updated successfully', data: updatedService }, { status: 200 });
    } catch (error) {

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

        const deletedService = await WebDevelopment.findByIdAndDelete(id);

        if (!deletedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}