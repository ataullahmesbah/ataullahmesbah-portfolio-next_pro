import { connectToDatabase } from "@/lib/dbConnect";

export async function GET(req, { params }) {
  const { collection } = params;

  if (!collection) {
    return new Response(JSON.stringify({ error: "Collection name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { db } = await connectToDatabase();
    const data = await db.collection(collection).find({}).toArray();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
