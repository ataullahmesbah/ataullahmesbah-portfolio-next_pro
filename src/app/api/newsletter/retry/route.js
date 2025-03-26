import dbConnect from "@/lib/dbMongoose";
import NewsletterSubscriber from "@/models/newsletterSubscriber";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    await dbConnect();

    // Add simple authentication
    const authToken = request.headers.get('authorization');
    if (authToken !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        // Find all unsynced subscribers (max 100 at a time)
        const unsyncedSubscribers = await NewsletterSubscriber.find({
            brevoSynced: false,
            $or: [
                { retryAttempts: { $exists: false } }, // Backward compatibility
                { retryAttempts: { $lt: 3 } } // Max 3 attempts
            ]
        }).limit(100);

        if (unsyncedSubscribers.length === 0) {
            return NextResponse.json({
                message: "No pending subscribers to retry"
            });
        }

        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID);

        if (!BREVO_API_KEY || !BREVO_LIST_ID) {
            throw new Error("Brevo configuration missing");
        }

        let successfulSyncs = 0;
        const errors = [];

        // Process each subscriber
        for (const subscriber of unsyncedSubscribers) {
            try {
                await axios.post(
                    "https://api.brevo.com/v3/contacts",
                    {
                        email: subscriber.email,
                        attributes: {
                            FIRSTNAME: subscriber.name || "",
                            LASTNAME: "",
                            SMS: ""
                        },
                        listIds: [BREVO_LIST_ID],
                        updateEnabled: true
                    },
                    {
                        headers: {
                            "api-key": BREVO_API_KEY,
                            "Content-Type": "application/json"
                        },
                        timeout: 5000
                    }
                );

                // Mark as synced
                await NewsletterSubscriber.updateOne(
                    { _id: subscriber._id },
                    {
                        brevoSynced: true,
                        brevoSyncedAt: new Date(),
                        retryAttempts: 0
                    }
                );
                successfulSyncs++;

            } catch (error) {
                // Increment retry counter
                await NewsletterSubscriber.updateOne(
                    { _id: subscriber._id },
                    {
                        $inc: { retryAttempts: 1 },
                        lastError: error.response?.data?.message || error.message
                    }
                );
                errors.push({
                    email: subscriber.email,
                    error: error.response?.data?.message || error.message
                });
            }
        }

        return NextResponse.json({
            message: `Retry completed`,
            stats: {
                totalProcessed: unsyncedSubscribers.length,
                successful: successfulSyncs,
                failed: errors.length
            },
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error("Retry process failed:", error);
        return NextResponse.json(
            {
                error: "Retry process failed",
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
}