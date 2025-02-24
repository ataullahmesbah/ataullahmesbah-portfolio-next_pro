import NextAuth from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/dbMongoose';
import User from '@/models/User';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await connectDB();

                // Find the user by email
                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error('User not found');
                }

                // Compare the password
                const isMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isMatch) {
                    throw new Error('Invalid credentials');
                }

                // Return user object with role
                return {
                    id: user._id,
                    name: user.username,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Add role to the token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role; // Add role to the session
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // Custom login page
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };