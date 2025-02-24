import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

// Fetch all users
export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}, { password: 0 }); // Exclude passwords
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
}

// Update user role or status
export async function PUT(req) {
    try {
        await dbConnect();
        const { userId, role } = await req.json();

        // Update the user's role
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.role = role;
        await user.save();

        // Invalidate the user's session
        const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        console.log('Session:', session); // Debugging
        console.log('User ID:', userId); // Debugging

        if (session && session.sub === userId) {
            console.log('Invalidating session for user:', userId); // Debugging
            const sessionInvalidationResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Session invalidation response:', sessionInvalidationResponse); // Debugging
        }

        return NextResponse.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ message: 'Failed to update role' }, { status: 500 });
    }
}

// Delete a user
export async function DELETE(req) {
    try {
        await dbConnect();
        const { userId } = await req.json();

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Invalidate the user's session if they are currently logged in
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (token && token.sub === userId) {
            // If the user being deleted is the currently logged-in user, invalidate their session
            await fetch('/api/auth/session', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
    }
}