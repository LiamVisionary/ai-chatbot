'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface UIContextProps {
  isToolbarVisible: boolean;
  setIsToolbarVisible: (value: boolean) => void;
  mode: 'edit' | 'diff';
  setMode: (mode: 'edit' | 'diff') => void;
}

const UIContext = createContext<UIContextProps | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [mode, setMode] = useState<'edit' | 'diff'>('edit');

  return (
    <UIContext.Provider value={{
      isToolbarVisible,
      setIsToolbarVisible,
      mode,
      setMode,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};