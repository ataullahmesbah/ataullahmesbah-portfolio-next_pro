// app/api/admin/users/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';


// Fetch all users
export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}, { password: 0, otp: 0, passwordResetToken: 0 }); // Exclude sensitive fields
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
        const { userId, role, status } = await req.json();

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Update role if provided
        if (role) {
            user.role = role;
            user.forceLogout = true; // Force logout when role changes
        }

        // Update status if provided
        if (status) {
            user.status = status;
            if (status === 'inactive') {
                user.forceLogout = true; // Force logout when deactivated
            }
        }

        await user.save();

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
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

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
    }
}