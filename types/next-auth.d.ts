import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface SessionUserData {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  }

  interface Session {
    user: SessionUserData;
  }

  interface CustomJWT extends JWT {
    user?: SessionUserData
  }
}