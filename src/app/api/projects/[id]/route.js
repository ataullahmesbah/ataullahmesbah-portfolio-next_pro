// src/app/api/projects/[id]/route.js


import dbConnect from "@/lib/dbMongoose";
import Project from "@/models/project";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";

// GET: Fetch a single project by ID and increment views
export async function GET(request, { params }) {
    await dbConnect();

    try {
        const { id } = params;
        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        // Increment views
        project.views = (project.views || 0) + 1;
        await project.save();
        return NextResponse.json(project.toObject(), { status: 200 });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ error: "Failed to fetch project", message: error.message }, { status: 500 });
    }
}

// PUT: Update a project (Admin only)
export async function PUT(request, { params }) {
    await dbConnect();

    try {
        const { id } = params;
        const formData = await request.formData();
        const title = formData.get('title');
        const subtitle = formData.get('subtitle');
        const description = formData.get('description');
        const contentShort = formData.get('contentShort');
        const content = formData.get('content'); // Get content as a JSON string
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
        // Add these new fields
        const projectLink = formData.get('projectLink');
        const projectLinkText = formData.get('projectLinkText') || 'Visit Project Site';

        // Add logging here
        console.log("Received projectLink for PUT:", projectLink);
        console.log("Received projectLinkText for PUT:", projectLinkText);

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Update fields
        project.title = title || project.title;
        project.subtitle = subtitle || project.subtitle;
        project.description = description || project.description;
        project.contentShort = contentShort || project.contentShort;
        if (content) {
            project.content = JSON.parse(content); // Parse the JSON string into an array of objects
        }
        project.category = category || project.category;
        project.keyPoints = keyPoints.length > 0 ? keyPoints : project.keyPoints;
        project.websiteFeatures = websiteFeatures.length > 0 ? websiteFeatures : project.websiteFeatures;
        project.supportSystem = supportSystem || project.supportSystem;
        project.metaDescription = metaDescription || project.metaDescription;
        project.imageAlt = imageAlt || project.imageAlt;
        project.views = project.views || 0;
        project.updatedAt = Date.now();

        project.projectLink = projectLink || project.projectLink;
        project.projectLinkText = projectLinkText || project.projectLinkText;

        // Update main image if provided (convert to WebP)
        if (mainImageFile && mainImageFile.size > 0) {
            const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
            const mainImageUrl = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'projects/main',
                        fetch_format: 'webp', // Convert to WebP
                        quality: 'auto', // Automatically optimize quality
                        flags: 'lossy', // Use lossy compression for better file size
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                ).end(mainImageBuffer);
            });
            project.mainImage = mainImageUrl;
        }

        // Update gallery images if provided (convert to WebP)
        if (galleryFiles && galleryFiles.length > 0) {
            const gallery = [];
            for (let i = 0; i < galleryFiles.length; i++) {
                const file = galleryFiles[i];
                if (file && file.size > 0) {
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
                                if (error) reject(error);
                                else resolve(result.secure_url);
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
            project.gallery = gallery.length > 0 ? gallery : project.gallery;
        }

        await project.save();
        return NextResponse.json({ message: "Project updated successfully", project }, { status: 200 });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ error: "Failed to update project", message: error.message }, { status: 500 });
    }
}

// DELETE: Delete a project (Admin only)
export async function DELETE(request, { params }) {
    await dbConnect();

    try {
        const { id } = params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: "Failed to delete project", message: error.message }, { status: 500 });
    }
}