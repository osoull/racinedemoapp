import React, { createContext, useContext } from 'react';
import { usePlatformSettings, PlatformSettings } from '@/hooks/usePlatformSettings';

interface PlatformSettingsContextType {
  settings: PlatformSettings | undefined;
  isLoading: boolean;
  error: Error | null;
}

const PlatformSettingsContext = createContext<PlatformSettingsContextType | undefined>(undefined);

export const PlatformSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: settings, isLoading, error } = usePlatformSettings();

  return (
    <PlatformSettingsContext.Provider value={{ settings, isLoading, error: error as Error | null }}>
      {children}
    </PlatformSettingsContext.Provider>
  );
};

export const usePlatformSettingsContext = () => {
  const context = useContext(PlatformSettingsContext);
  if (context === undefined) {
    throw new Error('usePlatformSettingsContext must be used within a PlatformSettingsProvider');
  }
  return context;
};