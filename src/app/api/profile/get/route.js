import dbConnect from "@/lib/dbMongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserProfile from "@/models/UserProfile";


export async function GET(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const profile = await UserProfile.findOne({ userId: session.user.id });

    if (!profile) {
        return Response.json({ message: 'Profile Not Found' }, { status: 404 });
    }

    return Response.json(profile);
}
