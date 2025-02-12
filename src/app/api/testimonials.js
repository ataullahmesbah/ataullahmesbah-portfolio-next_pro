import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
    try {
        const db = await dbConnect("testimonials"); // Ensure dbConnect is awaited
        const data = await db.find({}).toArray(); // Get all testimonials

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "No testimonials found" });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error loading testimonials", error: error.message });
    }
}
