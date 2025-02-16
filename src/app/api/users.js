import connectDB from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
    await connectDB();

    if (req.method === "GET") {
        const users = await User.find({});
        return res.status(200).json(users);
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

    else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
