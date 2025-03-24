// src/app/api/admin/project-stats/route.js
import { NextResponse } from 'next/server';

import Project from '@/models/project';
import dbConnect from '@/lib/dbMongoose';

export async function GET() {
    try {
        // Connect to MongoDB
        await dbConnect();

        // Total Projects
        const totalProjects = await Project.countDocuments();

        // Total Views
        const totalViews = await Project.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]).then(result => result[0]?.totalViews || 0);

        // Projects by Category
        const projectsByCategory = await Project.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        // Top 5 Most Viewed Projects
        const topViewedProjects = await Project.find()
            .sort({ views: -1 })
            .limit(5)
            .select('title views')
            .lean();

        // Average Views per Project
        const avgViews = totalProjects ? totalViews / totalProjects : 0;

        // Projects Created Over Time (last 12 months)
        const projectsOverTime = await Project.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id': 1 } },
        ]);

        // Projects with Gallery
        const projectsWithGallery = await Project.countDocuments({ 'gallery.0': { $exists: true } });
        const galleryPercentage = totalProjects ? (projectsWithGallery / totalProjects) * 100 : 0;

        // Average Gallery Images per Project
        const avgGalleryImages = await Project.aggregate([
            { $match: { 'gallery.0': { $exists: true } } },
            { $group: { _id: null, avg: { $avg: { $size: '$gallery' } } } },
        ]).then(result => result[0]?.avg || 0);

        // Projects with Key Points and Website Features
        const projectsWithKeyPoints = await Project.countDocuments({ 'keyPoints.0': { $exists: true } });
        const keyPointsPercentage = totalProjects ? (projectsWithKeyPoints / totalProjects) * 100 : 0;

        const projectsWithWebsiteFeatures = await Project.countDocuments({ 'websiteFeatures.0': { $exists: true } });
        const websiteFeaturesPercentage = totalProjects ? (projectsWithWebsiteFeatures / totalProjects) * 100 : 0;

        // Average Key Points and Website Features
        const avgKeyPoints = await Project.aggregate([
            { $match: { 'keyPoints.0': { $exists: true } } },
            { $group: { _id: null, avg: { $avg: { $size: '$keyPoints' } } } },
        ]).then(result => result[0]?.avg || 0);

        const avgWebsiteFeatures = await Project.aggregate([
            { $match: { 'websiteFeatures.0': { $exists: true } } },
            { $group: { _id: null, avg: { $avg: { $size: '$websiteFeatures' } } } },
        ]).then(result => result[0]?.avg || 0);

        // Projects with Support System
        const projectsWithSupport = await Project.countDocuments({ supportSystem: { $ne: '' } });
        const supportPercentage = totalProjects ? (projectsWithSupport / totalProjects) * 100 : 0;

        // Average Meta Description Length
        const avgMetaDescLength = await Project.aggregate([
            { $group: { _id: null, avg: { $avg: { $strLenCP: '$metaDescription' } } } },
        ]).then(result => result[0]?.avg || 0);

        // Projects with Meta Description Exceeding 160 Characters
        const metaDescExceeding = await Project.countDocuments({
            $expr: { $gt: [{ $strLenCP: '$metaDescription' }, 160] },
        });

        return NextResponse.json({
            totalProjects,
            totalViews,
            projectsByCategory,
            topViewedProjects,
            avgViews,
            projectsOverTime,
            galleryPercentage,
            avgGalleryImages,
            keyPointsPercentage,
            avgKeyPoints,
            websiteFeaturesPercentage,
            avgWebsiteFeatures,
            supportPercentage,
            avgMetaDescLength,
            metaDescExceeding,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching project stats:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics', message: error.message }, { status: 500 });
    }
}