import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '../models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hard-coded admin credentials
        if (
          credentials?.username === 'admin' &&
          credentials?.password === 'ObeyAllah@786'
        ) {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@hsb.com',
            role: 'admin',
          };
        }

        // Check database for other users
        try {
          await dbConnect();
          const user = await User.findOne({ username: credentials?.username });

          if (!user) {
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            throw new Error('Your account has been disabled. Please contact the administrator.');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials?.password || '',
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'admin' | 'user';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'hsb-geo-tagging-secret-key-2025',
};
