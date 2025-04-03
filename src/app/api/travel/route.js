import dbConnect from "@/lib/dbMongoose";
import Travel from "@/models/Travel";


export async function GET() {
    await dbConnect();
    try {
        const travels = await Travel.find({});
        return new Response(JSON.stringify(travels), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch travel data' }), { status: 500 });
    }
}