
import dbConnect from '@/lib/dbMongoose';
import SEOPackage from '@/models/SEOPackage';
import { NextResponse } from 'next/server';



export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const seoPackage = await SEOPackage.findById(id).lean();
            if (!seoPackage) {
                return NextResponse.json({ error: 'Package not found' }, { status: 404 });
            }
            return NextResponse.json(seoPackage, { status: 200 });
        } else {
            const packages = await SEOPackage.find().lean();
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

        if (!name || !description || !features || !price || !discount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!Array.isArray(features) || features.some(f => !f)) {
            return NextResponse.json({ error: 'Invalid features data' }, { status: 400 });
        }

        const packageData = {
            name,
            description,
            features,
            price,
            discount,
        };

        const seoPackage = await SEOPackage.create(packageData);

        return NextResponse.json({ message: 'Package created successfully', data: seoPackage }, { status: 201 });
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

        if (!id || !name || !description || !features || !price || !discount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!Array.isArray(features) || features.some(f => !f)) {
            return NextResponse.json({ error: 'Invalid features data' }, { status: 400 });
        }

        const updatedPackage = await SEOPackage.findByIdAndUpdate(
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

        const deletedPackage = await SEOPackage.findByIdAndDelete(id);

        if (!deletedPackage) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Package deleted successfully' }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }
}