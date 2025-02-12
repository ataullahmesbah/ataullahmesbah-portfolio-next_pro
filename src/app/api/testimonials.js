import { dbConnect } from "@/lib/dbConnect";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        const collection = await dbConnect("testimonials"); // Database Collection Name
        const testimonials = await collection.find({}).toArray(); // Fetch Data

        res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database Error", error: error.message });
    }
}
