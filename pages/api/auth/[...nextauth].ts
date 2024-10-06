import NextAuth, { AuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { compare } from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        console.log("authorize")
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

        const isMatch = await compare(credentials.password, user.password)

        if (!isMatch) {
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
      console.log("jwt")
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT}){
      console.log("session")
      if (token.user) {
        session.user = token.user
      }
      return session
    }
  }
};

export default NextAuth(
  authOptions
);