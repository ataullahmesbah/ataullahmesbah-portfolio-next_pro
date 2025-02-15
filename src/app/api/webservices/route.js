// src/app/api/webservices/route.js

import { connectDB } from "@/lib/dbConnect";



export async function GET() {
    try {
        const db = await connectDB();
        const webservices = await db.collection("webservices").find({}).toArray();

        if (!webservices.length) {
            console.warn("⚠️ No web services found in the database.");
        }

        return new Response(JSON.stringify(webservices), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("❌ Failed to fetch web services:", error);
        return new Response(
            JSON.stringify({ message: "Failed to fetch web services" }),
            { status: 500 }
        );
    }
}
