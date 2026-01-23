// src/app/api/projects/route.js
import dbConnect from "@/lib/dbMongoose";
import Project from "@/models/project";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";


export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const limit = searchParams.get('limit');
        const minimal = searchParams.get('minimal');

        // Single project by slug
        if (slug) {
            const project = await Project.findOne({ slug })
                .select(minimal ? 'title subtitle description category mainImage imageAlt slug' : '-__v')
                .lean();

            if (!project) {
                return NextResponse.json({ error: "Project not found" }, { status: 404 });
            }

            // Update views without waiting
            Project.updateOne({ slug }, { $inc: { views: 1 } }).exec();
            return NextResponse.json({ project });
        }

        // Multiple projects with limit
        const query = Project.find({}).sort({ createdAt: -1 });

        if (limit) {
            query.limit(parseInt(limit));
        }

        if (minimal) {
            query.select('title subtitle description category mainImage imageAlt slug');
        }

        const projects = await query.lean();
        return NextResponse.json(projects);

    } catch (error) {

        return NextResponse.json(
            { error: "Failed to fetch projects", message: error.message },
            { status: 500 }
        );
    }
}


// POST: Create a new project (Admin only)
export async function POST(request) {
    await dbConnect();

    try {
        const formData = await request.formData();


        const title = formData.get('title');
        const subtitle = formData.get('subtitle');
        const description = formData.get('description');
        const contentShort = formData.get('contentShort');
        const contentSections = formData.getAll('contentSections');
        const tags = formData.getAll('tags');
        const bulletPoints = formData.getAll('bulletPoints');
        const category = formData.get('category');
        const keyPoints = formData.getAll('keyPoints');
        const websiteFeatures = formData.getAll('websiteFeatures');
        const supportSystem = formData.get('supportSystem');
        const metaDescription = formData.get('metaDescription');
        const imageAlt = formData.get('imageAlt');
        const mainImageFile = formData.get('mainImage');
        const galleryFiles = formData.getAll('gallery');
        const galleryNames = formData.getAll('galleryNames');
        const galleryAlts = formData.getAll('galleryAlts');
        // Add these lines to get the link fields
        const projectLink = formData.get('projectLink');
        const projectLinkText = formData.get('projectLinkText') || 'Visit Project Site';

        // Validate required fields
        if (!title || !subtitle || !description || !contentShort || !category || !metaDescription || !imageAlt || !mainImageFile) {

            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Limit metaDescription to 160 characters
        const trimmedMetaDescription = metaDescription.slice(0, 160);

        // Upload main image to Cloudinary (convert to WebP)
        let mainImageUrl = '';
        if (mainImageFile && mainImageFile.size > 0) {
            const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
            mainImageUrl = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'projects/main',
                        fetch_format: 'webp', // Convert to WebP
                        quality: 'auto', // Automatically optimize quality
                        flags: 'lossy', // Use lossy compression for better file size
                    },
                    (error, result) => {
                        if (error) {

                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                ).end(mainImageBuffer);
            });
        } else {

            return NextResponse.json({ error: "Main image is required" }, { status: 400 });
        }

        // Upload gallery images to Cloudinary (convert to WebP)
        const gallery = [];
        for (let i = 0; i < galleryFiles.length; i++) {
            const file = galleryFiles[i];
            if (file && file.size > 0) { // Ensure the file is valid
                const buffer = Buffer.from(await file.arrayBuffer());
                const url = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: 'projects/gallery',
                            fetch_format: 'webp', // Convert to WebP
                            quality: 'auto', // Automatically optimize quality
                            flags: 'lossy', // Use lossy compression for better file size
                        },
                        (error, result) => {
                            if (error) {

                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    ).end(buffer);
                });
                gallery.push({
                    url,
                    name: galleryNames[i] || `Gallery Image ${i + 1}`,
                    alt: galleryAlts[i] || `Gallery image ${i + 1} for ${title}`,
                });
            }
        }

        // Structure content sections with tags and bullet points
        const contentData = contentSections.map((content, index) => ({
            content,
            tag: tags[index] || 'p',
            bulletPoints: bulletPoints[index] ? bulletPoints[index].split(',').map(item => item.trim()) : [],
        }));

        // Debug: Log the gallery data before saving


        // Create new project
        const projectData = {
            title,
            subtitle,
            description,
            contentShort,
            content: contentData,
            category,
            mainImage: mainImageUrl,
            imageAlt,
            gallery,
            keyPoints,
            websiteFeatures,
            supportSystem,
            metaDescription: trimmedMetaDescription,
            views: 0,
            projectLink: projectLink || undefined, // This is correct
            projectLinkText: projectLinkText || 'Visit Project Site' // Ensure default is set
        };



        const project = new Project(projectData);
        await project.save();


        return NextResponse.json({ message: "Project created successfully", project }, { status: 201 });
    } catch (error) {

        return NextResponse.json({
            error: "Failed to create project",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}