// src/app/api/newsletter/route.js
import dbConnect from "@/lib/dbMongoose";
import NewsletterSubscriber from "@/models/newsletterSubscriber";
import { NextResponse } from "next/server";
import axios from "axios";

// POST: Subscribe a new user
export async function POST(request) {
    await dbConnect();

    try {
        const { email, name } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        // Check existing subscriber
        const existingSubscriber = await NewsletterSubscriber.findOne({ email });
        if (existingSubscriber) {
            return NextResponse.json(
                {
                    error: "You're already subscribed!",
                    existing: true
                },
                { status: 400 }
            );
        }

        // Capture IP address (improve capture method)
        let ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        if (ipAddress && ipAddress.includes(',')) {
            ipAddress = ipAddress.split(',')[0].trim(); // Take the first IP if multiple are present
        }
        console.log("Captured IP Address:", ipAddress); // Debug log

        // Capture country
        const country = await getCountryFromIP(ipAddress);
        console.log("Captured Country:", country); // Debug log

        // Save to database first (primary storage)
        const subscriber = new NewsletterSubscriber({
            email,
            name,
            brevoSynced: false,
            ipAddress: ipAddress || 'unknown',
            country: country || 'Unknown'
        });
        await subscriber.save();

        // Brevo Integration (secondary)
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID);

        if (!BREVO_API_KEY || !BREVO_LIST_ID) {
            console.error("Brevo configuration missing");
            return NextResponse.json(
                {
                    message: "Subscribed successfully (local)",
                    warning: "Mailing list service currently unavailable"
                },
                { status: 200 }
            );
        }

        try {
            const brevoResponse = await axios.post(
                "https://api.brevo.com/v3/contacts",
                {
                    email: email,
                    attributes: {
                        FIRSTNAME: name || "",
                        LASTNAME: "",
                        SMS: ""
                    },
                    listIds: [BREVO_LIST_ID],
                    updateEnabled: true
                },
                {
                    headers: {
                        "api-key": BREVO_API_KEY,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    timeout: 5000
                }
            );

            // Update sync status in DB if successful
            await NewsletterSubscriber.updateOne(
                { email },
                { brevoSynced: true, brevoSyncedAt: new Date() }
            );

            return NextResponse.json(
                { message: "Subscribed successfully!" },
                { status: 201 }
            );

        } catch (brevoError) {
            console.error("Brevo sync failed:", brevoError.response?.data || brevoError.message);
            return NextResponse.json(
                {
                    message: "Subscribed successfully!",
                    warning: "Mailing list sync delayed (will retry later)"
                },
                { status: 200 }
            );
        }

    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json(
            {
                error: "Subscription failed",
                details: process.env.NODE_ENV === 'development' ? error.message : null
            },
            { status: 500 }
        );
    }
}

// GET: List all subscribers (for admin panel)
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
        const subscribers = await NewsletterSubscriber.find()
            .sort({ subscribedAt: -1 })
            .limit(100);

        return NextResponse.json({
            subscribers,
            total: await NewsletterSubscriber.countDocuments()
        });
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return NextResponse.json(
            { error: "Failed to fetch subscribers", details: error.message },
            { status: 500 }
        );
    }
}

// DELETE: Delete a subscriber
export async function DELETE(request) {
    await dbConnect();

    const authToken = request.headers.get('authorization');
    if (authToken !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const subscriber = await NewsletterSubscriber.findOne({ email });
        if (!subscriber) {
            return NextResponse.json(
                { error: "Subscriber not found" },
                { status: 404 }
            );
        }

        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        if (BREVO_API_KEY && subscriber.brevoSynced) {
            try {
                await axios.delete(
                    `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
                    {
                        headers: {
                            "api-key": BREVO_API_KEY,
                            "Content-Type": "application/json"
                        },
                        timeout: 5000
                    }
                );
            } catch (brevoError) {
                console.error("Failed to delete from Brevo:", brevoError.response?.data || brevoError.message);
            }
        }

        await NewsletterSubscriber.deleteOne({ email });

        return NextResponse.json({
            message: "Subscriber deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        return NextResponse.json(
            { error: "Failed to delete subscriber", details: error.message },
            { status: 500 }
        );
    }
}

// Helper function to get country from IP

async function getCountryFromIP(ip) {
    if (ip === 'unknown' || !ip || ip === '::1' || ip === '127.0.0.1') {
        console.log("IP is localhost or unknown, returning 'Unknown'");
        return 'Unknown';
    }

    try {
        // Try ipinfo.io first
        const ipinfoToken = process.env.IPINFO_TOKEN;
        if (ipinfoToken) {
            console.log(`Fetching country from ipinfo.io for IP: ${ip}`);
            const response = await fetch(`https://ipinfo.io/${ip}/json?token=${ipinfoToken}`);
            if (response.ok) {
                const data = await response.json();
                console.log("ipinfo.io response:", data);
                return data.country || 'Unknown';
            } else {
                console.log(`ipinfo.io failed with status: ${response.status}`);
            }
        } else {
            console.log("IPINFO_TOKEN not set, falling back to ip-api.com");
        }

        // Fallback to ip-api.com if ipinfo.io fails
        console.log(`Fetching country from ip-api.com for IP: ${ip}`);
        const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}?fields=country`);
        if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            console.log("ip-api.com response:", data);
            return data.country || 'Unknown';
        } else {
            console.log(`ip-api.com failed with status: ${fallbackResponse.status}`);
        }

        return 'Unknown';
    } catch (error) {
        console.error("Error fetching country from IP:", error.message);
        return 'Unknown';
    }
}