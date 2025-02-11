import connectDB from '@/lib/mongodb.js';
import mongoose from 'mongoose';

// Define the schema (if not already defined)
const ReviewSchema = new mongoose.Schema({
    user_name: String,
    user_position: String,
    rating: Number,
    description: String,
    image: String
});

// Create model
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        try {
            const reviews = await Review.find({});
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ error: "Error fetching reviews" });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
