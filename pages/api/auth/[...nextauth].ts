import NextAuth, { CustomJWT, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { JWT } from 'next-auth/jwt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (user && user.password === credentials.password) {
          console.log("login successful", user)
          return user;
        }
        console.log("login failed", user)
        return null;
      }
    })
  ],
  session: { 
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: User }){
      if (!user) {
        return token
      }

      token.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      return token
    },
    async session({ session, token }: { session: Session, token: CustomJWT}){
      return {
        ...session,
        user: token.user
      }
    }
  }
};

export default NextAuth(
  authOptions
);