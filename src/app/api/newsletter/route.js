// src/app/api/newsletter/route.js
import dbConnect from "@/lib/dbMongoose";
import NewsletterSubscriber from "@/models/newsletterSubscriber";
import { NextResponse } from "next/server";
import axios from "axios";

// POST: Save a new subscriber and add to Brevo
export async function POST(request) {
    await dbConnect();

    try {
        const { email, name } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if email already exists in database
        const existingSubscriber = await NewsletterSubscriber.findOne({ email });
        if (existingSubscriber) {
            return NextResponse.json({ error: "This email is already subscribed" }, { status: 400 });
        }

        // Save to database
        const subscriber = new NewsletterSubscriber({ email, name });
        await subscriber.save();

        // Add to Brevo using API
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID);

        if (!BREVO_API_KEY || !BREVO_LIST_ID) {
            console.error("Brevo API key or list ID not configured", { BREVO_API_KEY, BREVO_LIST_ID });
            return NextResponse.json({ error: "Server configuration error: Brevo API key or list ID missing" }, { status: 500 });
        }

        try {
            console.log("Attempting to add contact to Brevo:", { email, name, listId: BREVO_LIST_ID });
            const brevoResponse = await axios.post(
                "https://api.brevo.com/v3/contacts",
                {
                    email: email,
                    attributes: { FIRSTNAME: name || "" },
                    listIds: [BREVO_LIST_ID],
                    updateEnabled: true,
                },
                {
                    headers: {
                        "api-key": BREVO_API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Brevo API Response:", brevoResponse.status, brevoResponse.data);

            if (brevoResponse.status !== 201 && brevoResponse.status !== 200) {
                console.error("Brevo API Error:", brevoResponse.data);
                return NextResponse.json({ error: "Failed to add to Brevo list", details: brevoResponse.data.message || brevoResponse.data }, { status: 500 });
            }
        } catch (brevoError) {
            console.error("Brevo API Request Failed:", {
                message: brevoError.message,
                response: brevoError.response?.data,
                status: brevoError.response?.status,
            });
            const errorMessage = brevoError.response?.data?.message || brevoError.message || "Unknown error occurred while adding to Brevo list";
            // If IP address issue, include the link in the error message
            if (errorMessage.includes("unrecognised IP address")) {
                return NextResponse.json(
                    { error: `${errorMessage} Please add your IP address here: https://app.brevo.com/security/authorised_ips` },
                    { status: 500 }
                );
            }
            return NextResponse.json(
                { error: errorMessage },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        return NextResponse.json({ error: "Failed to subscribe", message: error.message }, { status: 500 });
    }
}