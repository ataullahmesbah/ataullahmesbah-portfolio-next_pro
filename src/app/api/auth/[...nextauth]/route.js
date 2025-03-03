import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';

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
                token.role = user.role;
                token.image = user.image; // Add the image field
                token.id = user.id; //user id pass
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            session.user.image = token.image; // Add the image field to the session
            session.user.id = token.id;
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