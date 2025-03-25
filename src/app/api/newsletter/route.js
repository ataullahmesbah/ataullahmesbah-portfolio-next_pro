// src/app/api/newsletter/route.js

import dbConnect from "@/lib/dbMongoose";
import NewsletterSubscriber from "@/models/newsletterSubscriber"; // Model banate hobe
import { NextResponse } from "next/server";

// POST: Save a new subscriber
export async function POST(request) {
    await dbConnect();

    try {
        const { email, name } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if email already exists
        const existingSubscriber = await NewsletterSubscriber.findOne({ email });
        if (existingSubscriber) {
            return NextResponse.json({ error: "Email already subscribed" }, { status: 400 });
        }

        const subscriber = new NewsletterSubscriber({ email, name });
        await subscriber.save();

        return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        return NextResponse.json({ error: "Failed to subscribe", message: error.message }, { status: 500 });
    }
}