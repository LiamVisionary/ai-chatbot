'use client';

import { createContext, ReactNode, useContext } from 'react';
import type { Session } from 'next-auth';

interface AuthContextProps {
  session: Session | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ 
  children, 
  session 
}: { 
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
