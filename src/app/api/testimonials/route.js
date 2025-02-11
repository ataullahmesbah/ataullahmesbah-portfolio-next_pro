import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ataullahmesbahDatabase"); // Your database name
    const testimonials = await db.collection("testimonials").find({}).toArray();

    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch testimonials", error }, { status: 500 });
  }
}
