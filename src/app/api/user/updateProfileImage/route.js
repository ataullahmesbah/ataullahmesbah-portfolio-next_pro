import { NextResponse } from 'next/server';
import  { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';


export async function POST(req) {
  await connectDB();
  try {
    const { email, image } = await req.json();

    const user = await User.findOneAndUpdate(
      { email },
      { image },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
