import NextAuth, { DefaultSession, DefaultUser} from 'next-auth';
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module 'next-auth' {
  /**
    * The shape of the user object returned in the OAuth providers' `profile` callback,
    * or the second parameter of the `session` callback, when using a database.
    */
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  /**
    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    */
  interface Session {
    user: User
  }
}


declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    sub: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    },
    iat: number;
    exp: number;
    jti: string;
  }
}