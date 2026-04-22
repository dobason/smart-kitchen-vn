import type { RecipeInstructionResponse } from '@/services/aiRecipeServices';

export type AIRecipeSession = {
  imageUri: string;
  sourceLabel: string;
  detectedIngredients: string[];
  recipe: RecipeInstructionResponse;
};

let latestAIRecipeSession: AIRecipeSession | null = null;

export function setLatestAIRecipeSession(session: AIRecipeSession) {
  latestAIRecipeSession = session;
}

export function getLatestAIRecipeSession() {
  return latestAIRecipeSession;
}

export function clearLatestAIRecipeSession() {
  latestAIRecipeSession = null;
}

export function consumeLatestAIRecipeSession() {
  const session = latestAIRecipeSession;
  latestAIRecipeSession = null;
  return session;
}
