
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        try {
            const users = await User.find({});
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: "Failed to fetch users" });
        }
    }

    else if (req.method === "POST") {
        try {
            const { name, email } = req.body;
            const newUser = new User({ name, email });
            await newUser.save();
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(400).json({ error: "Failed to create user" });
        }
    }

    else if (req.method === "PUT") {
        try {
            const { email, image } = req.body;

            // Find the user by email and update the image field
            const user = await User.findOneAndUpdate(
                { email },
                { image },
                { new: true } // Return the updated document
            );

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: "Failed to update user profile" });
        }
    }

    else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
