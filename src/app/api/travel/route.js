import dbConnect from "@/lib/dbMongoose";
import Travel from "@/models/Travel";



export async function GET(request) {
    await dbConnect();
    try {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      
      let query = {};
      if (category) query.category = category;
      
      const travels = await Travel.find(query).sort({ date: -1 });
      return new Response(JSON.stringify(travels), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch travel data' }), { status: 500 });
    }
  }