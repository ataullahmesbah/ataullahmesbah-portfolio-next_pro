import { connectDB } from "@/lib/dbMongoose";
import User from "@/models/User";
import { verifyToken } from "@/utils/jwt";


export async function GET(req) {
    try {
        await connectDB();
        const authHeader = req.headers.get("authorization");
        if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        if (!decoded) return new Response(JSON.stringify({ error: "Invalid Token" }), { status: 401 });

        const user = await User.findById(decoded.id).select("-password");
        if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

        return new Response(JSON.stringify({ user }), { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
