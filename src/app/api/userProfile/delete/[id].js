import dbConnect from "@/lib/dbMongoose";
import UserProfile from "@/models/UserProfile";

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === "DELETE") {
        await UserProfile.findOneAndDelete({ userId: id });
        return res.status(200).json({ message: "User Deleted!" });
    }
}
