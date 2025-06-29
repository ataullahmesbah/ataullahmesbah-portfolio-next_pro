import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import Chat from '@/models/Chat';
import dbConnect from '@/lib/dbMongoose';


export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      console.error('❌ Unauthorized access to /api/chats GET', { session });
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const chats = await Chat.find({}).sort({ updatedAt: -1 });
    console.log('📋 Chats fetched:', chats.length, { chatIds: chats.map(c => c.userId) });
    return NextResponse.json({ success: true, chats });
  } catch (error) {
    console.error('❌ GET /api/chats error:', error.message, error.stack);
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    console.log('🟡 Connecting to MongoDB for POST /api/chats');
    const { userId, content, sender } = await req.json();
    console.log('📥 POST /api/chats received:', { userId, content, sender });

    if (!userId || !content || !['user', 'admin'].includes(sender)) {
      console.error('❌ Invalid input:', { userId, content, sender });
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    const newMessage = {
      sender,
      content,
      timestamp: new Date(),
      _id: new mongoose.Types.ObjectId(),
    };

    console.log('🟡 Saving message to database:', newMessage);

    const chat = await Chat.findOneAndUpdate(
      { userId },
      { $push: { messages: newMessage }, $set: { updatedAt: new Date(), status: sender === 'admin' ? 'active' : 'pending' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`📩 New message saved for userId: ${userId}, sender: ${sender}, chatId: ${chat._id}`);
    return NextResponse.json({ success: true, chat });
  } catch (error) {
    console.error('❌ POST /api/chats error:', error.message, error.stack);
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}