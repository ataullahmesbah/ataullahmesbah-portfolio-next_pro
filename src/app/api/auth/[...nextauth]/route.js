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
            async authorize(credentials) {
                await dbConnect(); // Connect to MongoDB
                const user = await User.findOne({ email: credentials.email });

                // Check if user exists, password matches, and user is active
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    if (user.status === 'active') {
                        return { id: user._id, name: user.username, email: user.email, role: user.role };
                    } else {
                        throw new Error('Your account is inactive. Please contact the admin.');
                    }
                }
                throw new Error('Invalid email or password');
            },
        }),
    ],



    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Add role to the token
                token.id = user.id; // Add user ID to the token
            }
            return token;
        },
        async session({ session, token }) {
            await dbConnect();

            // Fetch user image & intro from userProfiles collection

            const userProfile = await UserProfile.findOne({ userId: token.id });

            session.user.role = token.role; // Add role to the session
            session.user.id = token.id; // Add user ID to the session
            session.user.image = userProfile?.image || null; // Add image
            session.user.intro = userProfile?.intro || null; // Add intro

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };