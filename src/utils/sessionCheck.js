// app/utils/sessionCheck.js
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';

export async function checkForceLogout(req) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token?.id) return { forceLogout: false };

        await dbConnect();
        const user = await User.findById(token.id);

        if (user?.forceLogout) {
            return {
                forceLogout: true,
                message: 'Your session has been terminated by admin. Please login again.'
            };
        }

        return { forceLogout: false };
    } catch (error) {
        console.error('Session check error:', error);
        return { forceLogout: false };
    }
}