import dbConnect from "@/lib/dbMongoose";
import Travel from "@/models/Travel";


export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Single travel by slug
      const travel = await Travel.findOne({ slug });
      if (!travel) {
        return new Response(
          JSON.stringify({ error: 'Travel not found' }),
          { status: 404 }
        );
      }
      return new Response(JSON.stringify(travel), { status: 200 });
    } else {
      // All travels
      const travels = await Travel.find({}).sort({ date: -1 });
      return new Response(JSON.stringify(travels), { status: 200 });
    }
  } catch (error) {

    return new Response(
      JSON.stringify({ error: 'Failed to fetch travel data' }),
      { status: 500 }
    );
  }
}