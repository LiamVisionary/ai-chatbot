'use client';

import { ReactNode } from 'react';
import { ChatProvider } from './chat-context';
import { ArtifactProvider } from './artifact-context';
import { UIProvider } from './ui-context';
import { AuthProvider } from './auth-context';
import type { Session } from 'next-auth';

interface AppProvidersProps {
  children: ReactNode;
  chatInitialValues: Parameters<typeof ChatProvider>[0]['initialValues'];
  session: Session | null;
}

export function AppProviders({ children, chatInitialValues, session }: AppProvidersProps) {
  return (
    <UIProvider>
      <AuthProvider session={session}>
        <ArtifactProvider>
          <ChatProvider initialValues={chatInitialValues}>
            {children}
          </ChatProvider>
        </ArtifactProvider>
      </AuthProvider>
    </UIProvider>
  );
}