import dbConnect from "@/lib/dbMongoose";
import TrafficLog from "@/models/TrafficLog";


export async function GET() {
  await dbConnect(); // Ensure MongoDB connection
  const logs = await TrafficLog.find({}).sort({ timestamp: -1 }).limit(100);
  return NextResponse.json(logs);
}