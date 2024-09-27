import { useSession, signIn, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    await signIn('credentials', { email, password });
  };

  const logout = async () => {
    await signOut();
  };

  return {
    session,
    status,
    login,
    logout
  };
};