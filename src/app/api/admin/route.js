import { verifyToken } from "@/middleware/auth";


export async function GET(req) {
    try {
        const user = verifyToken(req);
        if (user.role !== "admin") {
            return new Response(JSON.stringify({ message: "Access denied, admins only" }), { status: 403 });
        }
        return new Response(JSON.stringify({ message: "Welcome, Admin!" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 401 });
    }
}
