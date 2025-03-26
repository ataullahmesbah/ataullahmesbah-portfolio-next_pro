// src/app/api/newsletter/stats/route.js
import dbConnect from "@/lib/dbMongoose";
import NewsletterSubscriber from "@/models/newsletterSubscriber";
import { NextResponse } from "next/server";

export async function GET(request) {
    await dbConnect();

    const authToken = request.headers.get('authorization');
    if (authToken !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        // Total subscribers
        const totalSubscribers = await NewsletterSubscriber.countDocuments();

        // Synced vs unsynced subscribers
        const syncedSubscribers = await NewsletterSubscriber.countDocuments({ brevoSynced: true });
        const unsyncedSubscribers = totalSubscribers - syncedSubscribers;

        // Recent subscribers (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentSubscribers = await NewsletterSubscriber.countDocuments({
            subscribedAt: { $gte: sevenDaysAgo }
        });

        // Country-wise distribution
        const countryDistribution = await NewsletterSubscriber.aggregate([
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Subscription over time (daily for the last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const subscriptionOverTime = await NewsletterSubscriber.aggregate([
            { $match: { subscribedAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // All subscribers for table
        const subscribers = await NewsletterSubscriber.find()
            .sort({ subscribedAt: -1 })
            .limit(100);

        return NextResponse.json({
            stats: {
                totalSubscribers,
                syncedSubscribers,
                unsyncedSubscribers,
                recentSubscribers,
                countryDistribution,
                subscriptionOverTime,
                subscribers
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats", details: error.message },
            { status: 500 }
        );
    }
}