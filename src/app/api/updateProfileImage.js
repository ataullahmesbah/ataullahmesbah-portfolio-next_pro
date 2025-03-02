import dbConnect from "@/lib/dbMongoose";
import User from "@/models/User";

dbConnect();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, image } = req.body;
    console.log('Updating profile image for:', email, 'with URL:', image); // Check the input

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { image },
            { new: true }
        );
        console.log('Updated user:', user); // Check the updated user
        res.status(200).json(user);
    } catch (err) {
        console.error('Error updating profile image:', err);
        res.status(500).json({ message: 'Failed to update profile image' });
    }
}