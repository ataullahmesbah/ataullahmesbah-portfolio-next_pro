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

                    // ✅ FIX: Check force logout but don't clear it during login attempt
                    if (user.forceLogout) {
                        // Don't clear forceLogout here, let the session callback handle it
                        throw new Error('Your session has been terminated by admin. Please login again.');
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

                    // Ensure loginHistory exists before pushing
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
                        role: user.role
                    };

                } catch (error) {
                   
                    throw new Error(error.message || 'Authentication failed');
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Add user info to token on sign in
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }

            // ✅ FIX: Check force logout but handle it properly
            if (token.id) {
                try {
                    await dbConnect();
                    const user = await User.findById(token.id);
                    if (user && user.forceLogout) {
                        // Only clear forceLogout if this is a new session (not during login)
                        if (trigger !== 'signIn') {
                            user.forceLogout = false;
                            await user.save();
                        }
                        token.error = 'Force logout by admin';
                    }
                } catch (error) {
            
                }
            }

            return token;
        },

        async session({ session, token }) {
            // Pass error to session if exists
            if (token.error) {
                session.error = token.error;
            }

            // Add user info to session
            if (token.id) {
                session.user.id = token.id;
                session.user.role = token.role;

                try {
                    await dbConnect();

                    // ✅ FIX: Check force logout but don't clear during session creation
                    const user = await User.findById(token.id);
                    if (user && user.forceLogout) {
                        session.error = 'Force logout by admin';
                        // Don't clear forceLogout here, let the middleware handle it
                    }

                    // Fetch user profile data
                    const userProfile = await UserProfile.findOne({ userId: token.id });
                    session.user.image = userProfile?.image || null;
                    session.user.intro = userProfile?.intro || null;
                    session.user.displayName = userProfile?.displayName || null;

                } catch (error) {
                    // console.error('Session callback error:', error);
                }
            }

            return session;
        },

        async redirect({ url, baseUrl }) {
            // Redirect to home page after login
            return baseUrl;
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