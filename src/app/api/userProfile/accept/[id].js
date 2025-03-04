import dbConnect from "@/lib/dbMongoose";
import UserProfile from "@/models/UserProfile";


export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === "PATCH") {
        await UserProfile.findOneAndUpdate({ userId: id }, { verified: "verified" });
        return res.status(200).json({ message: "User Verified!" });
    }
}
