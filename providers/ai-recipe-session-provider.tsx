import {
  AIRecipeSessionContext,
  type AIRecipeSession,
  type AIRecipeSessionContextValue,
} from '@/context/ai-recipe-session-context';
import {
  clearLatestAIRecipeSession,
  setLatestAIRecipeSession,
} from '@/lib/ai-recipe-session';
import * as React from 'react';

export const AIRecipeSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = React.useState<AIRecipeSession | null>(null);

  const updateSession = React.useCallback((nextSession: AIRecipeSession | null) => {
    setSession(nextSession);

    if (nextSession) {
      setLatestAIRecipeSession(nextSession);
      return;
    }

    clearLatestAIRecipeSession();
  }, []);

  const clearSession = React.useCallback(() => {
    updateSession(null);
  }, [updateSession]);

  const value = React.useMemo<AIRecipeSessionContextValue>(
    () => ({
      session,
      setSession: updateSession,
      clearSession,
    }),
    [clearSession, session, updateSession]
  );

  return <AIRecipeSessionContext.Provider value={value}>{children}</AIRecipeSessionContext.Provider>;
};
