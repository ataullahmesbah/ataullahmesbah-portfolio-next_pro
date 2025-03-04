import dbConnect from "@/lib/dbMongoose";
import UserProfile from "@/models/UserProfile";


export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "POST") {
        try {
            const { userId, document } = req.body;

            await UserProfile.findOneAndUpdate(
                { userId },
                { document, verified: "pending" }
            );

            return res.status(200).json({ message: "Verification Request Sent!" });
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
}
