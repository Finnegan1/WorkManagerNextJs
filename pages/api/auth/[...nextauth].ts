import NextAuth, { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { User } from 'next-auth';
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
        if (!credentials) {
          throw new Error("Credentials are required");
        }
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user) {
          throw new Error("Login failed");
        }
        if (user.password !== credentials.password) {
          throw new Error("Login failed");
        }

        const authUser: User = {
          id: user.id,
          name: user.name || "",
          email: user.email,
          role: user.role
        }
        return authUser
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
    async jwt({token, user}: {token: JWT, user: User}){
      console.log(token)
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT}){
      console.log(session)
      if (token.user) {
        session.user = token.user
      }
      console.log(session)
      return session
    }
  }
};

export default NextAuth(
  authOptions
);