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

        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
}


export async function PUT(req) {
    try {
        await dbConnect();
        const { userId, role, status } = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updates = {};
        let forceLogoutNeeded = false;

        // Check if role is changing
        if (role && role !== user.role) {
            updates.role = role;
            forceLogoutNeeded = true;
        }

        // Check if status is changing
        if (status && status !== user.status) {
            updates.status = status;
            if (status === 'inactive') {
                forceLogoutNeeded = true;
            }
        }

        // Apply updates
        if (Object.keys(updates).length > 0) {
            Object.assign(user, updates);

            // Only set forceLogout if actually needed
            if (forceLogoutNeeded) {
                user.forceLogout = true;
            }

            await user.save();

            return NextResponse.json({
                message: 'User updated successfully',
                forceLogout: user.forceLogout,
                roleChanged: role && role !== user.role
            });
        }

        return NextResponse.json({
            message: 'No changes made'
        });

    } catch (error) {
        console.error('Update User Error:', error);
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

        return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
    }
}