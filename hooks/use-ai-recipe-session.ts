import { AIRecipeSessionContext } from '@/context/ai-recipe-session-context';
import * as React from 'react';

export function useAIRecipeSession() {
  const context = React.useContext(AIRecipeSessionContext);

  if (!context) {
    throw new Error('useAIRecipeSession must be used within an AIRecipeSessionProvider');
  }

  return context;
}
