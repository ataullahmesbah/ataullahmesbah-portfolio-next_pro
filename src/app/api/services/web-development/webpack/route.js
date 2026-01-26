
import dbConnect from '@/lib/dbMongoose';
import WebPackage from '@/models/WebPackage';
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const webPackage = await WebPackage.findById(id).lean();
            if (!webPackage) {
                return NextResponse.json({ error: 'Package not found' }, { status: 404 });
            }
            return NextResponse.json(webPackage, { status: 200 });
        } else {
            const packages = await WebPackage.find().lean();
            return NextResponse.json(packages, { status: 200 });
        }
    } catch (error) {

        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const features = JSON.parse(formData.get('features'));
        const price = parseFloat(formData.get('price'));
        const discount = parseFloat(formData.get('discount'));

        if (!name || !description || !features || !Array.isArray(features) || features.length === 0 || !price || !discount) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        const packageData = { name, description, features, price, discount };
        const webPackage = await WebPackage.create(packageData);

        return NextResponse.json({ message: 'Package created successfully', data: webPackage }, { status: 201 });
    } catch (error) {

        return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const formData = await request.formData();
        const id = formData.get('id');
        const name = formData.get('name');
        const description = formData.get('description');
        const features = JSON.parse(formData.get('features'));
        const price = parseFloat(formData.get('price'));
        const discount = parseFloat(formData.get('discount'));

        if (!id || !name || !description || !features || !Array.isArray(features) || features.length === 0 || !price || !discount) {
            return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
        }

        const updatedPackage = await WebPackage.findByIdAndUpdate(
            id,
            { name, description, features, price, discount },
            { new: true }
        );

        if (!updatedPackage) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Package updated successfully', data: updatedPackage }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing package ID' }, { status: 400 });
        }

        const deletedPackage = await WebPackage.findByIdAndDelete(id);

        if (!deletedPackage) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Package deleted successfully' }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }
}