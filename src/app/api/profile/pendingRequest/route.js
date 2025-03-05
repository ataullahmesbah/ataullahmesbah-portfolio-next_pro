import UserProfile from "@/models/UserProfile";


export default async function handler(req, res) {
    const requests = await UserProfile.find({ "documents.verificationStatus": "Pending" }).populate("userId");
    res.status(200).json(requests);
}
