import type { RecipeInstructionResponse } from '@/services/aiRecipeServices';
import * as React from 'react';

export type AIRecipeSession = {
  imageUri: string;
  sourceLabel: string;
  detectedIngredients: string[];
  recipe: RecipeInstructionResponse;
};

export type AIRecipeSessionContextValue = {
  session: AIRecipeSession | null;
  setSession: (session: AIRecipeSession | null) => void;
  clearSession: () => void;
};

export const AIRecipeSessionContext = React.createContext<AIRecipeSessionContextValue | undefined>(
  undefined
);
