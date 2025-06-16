// app/api/chats/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Chat from '@/models/Chat';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';


export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const chats = await Chat.find({}).sort({ updatedAt: -1 });
    return new Response(JSON.stringify({ success: true, chats }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ GET /api/chats error:', error.message);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}