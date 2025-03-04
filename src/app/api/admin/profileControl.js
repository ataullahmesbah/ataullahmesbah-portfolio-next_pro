import dbConnect from "@/lib/dbMongoose";
import UserProfile from "@/models/UserProfile";


export default async function handler(req, res) {
    await dbConnect();

    const { method } = req;

    switch (method) {
        case 'GET':
            const users = await UserProfile.find();
            return res.status(200).json(users);

        case 'PUT':
            const { id, action } = req.body;

            if (action === 'accept') {
                await UserProfile.findByIdAndUpdate(id, { verified: 'verified' });
                return res.status(200).json({ message: 'User Verified!' });
            }

            if (action === 'reject') {
                await UserProfile.findByIdAndUpdate(id, { verified: 'not_verified' });
                return res.status(200).json({ message: 'User Rejected!' });
            }

            return res.status(400).json({ message: 'Invalid Action!' });

        case 'DELETE':
            const { deleteId } = req.query;
            await UserProfile.findByIdAndDelete(deleteId);
            return res.status(200).json({ message: 'User Deleted!' });

        default:
            return res.status(405).json({ message: 'Method Not Allowed!' });
    }
}
