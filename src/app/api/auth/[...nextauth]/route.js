// api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                try {
                    await dbConnect();

                    if (!credentials.email || !credentials.password) {
                        throw new Error('Email and password are required');
                    }

                    const user = await User.findOne({ email: credentials.email.toLowerCase() });

                    if (!user) {
                        throw new Error('Invalid email or password');
                    }

                    // ✅ FIX: Check force logout but handle it differently
                    // If forceLogout is true, we'll clear it and allow login
                    // This ensures user can login after role change
                    if (user.forceLogout) {
                        // Clear forceLogout flag but don't throw error
                        // User needs to be able to login after role change
                        user.forceLogout = false;
                        await user.save();
                        // We're NOT throwing error here - allowing login
                    }

                    // Check if user is active
                    if (user.status !== 'active') {
                        throw new Error('Your account is inactive. Please contact the admin.');
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error('Invalid email or password');
                    }

                    // Update last login info
                    user.lastLogin = new Date();
                    user.lastLoginIP = req.headers?.['x-forwarded-for']?.split(',')[0] ||
                        req.headers?.['x-real-ip'] ||
                        'unknown';

                    // Ensure loginHistory exists
                    if (!user.loginHistory) {
                        user.loginHistory = [];
                    }

                    user.loginHistory.push({
                        timestamp: new Date(),
                        ip: user.lastLoginIP,
                        userAgent: req.headers?.['user-agent'] || 'unknown'
                    });

                    // Keep only last 10 login records
                    if (user.loginHistory.length > 10) {
                        user.loginHistory = user.loginHistory.slice(-10);
                    }

                    await user.save();

                    return {
                        id: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        role: user.role,
                        forceLogout: false // Always set to false on new login
                    };

                } catch (error) {
                    console.error('Authorization Error:', error);
                    throw new Error(error.message || 'Authentication failed');
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.forceLogout = false; // Reset on new login
            }

            // Check for force logout in real-time
            if (token.id) {
                try {
                    await dbConnect();
                    const userDoc = await User.findById(token.id);

                    if (userDoc?.forceLogout) {
                        token.forceLogout = true;
                        token.error = 'Force logout by admin';

                        // Clear the flag after detecting
                        userDoc.forceLogout = false;
                        await userDoc.save();
                    }
                } catch (error) {
                    console.error('JWT callback error:', error);
                }
            }

            return token;
        },

        async session({ session, token }) {
            // Copy token properties to session
            if (token.id) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.forceLogout = token.forceLogout || false;

                if (token.error) {
                    session.error = token.error;
                }

                // Fetch additional user profile data
                try {
                    await dbConnect();
                    const userProfile = await UserProfile.findOne({ userId: token.id });

                    if (userProfile) {
                        session.user.image = userProfile.image;
                        session.user.intro = userProfile.intro;
                        session.user.displayName = userProfile.displayName;
                    }
                } catch (error) {
                    console.error('Session profile fetch error:', error);
                }
            }

            return session;
        }
    },

    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/login',
    },

    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };