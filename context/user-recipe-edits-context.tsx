import { RecipeIngredientDisplayItem } from '@/types/recipe-ingredient';
import { StepItem } from '@/types/step';
import * as React from 'react';

export type UserRecipeDraftRecipe = {
  name: string;
  totalTime: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type UserRecipeDraft = {
  recipeId: string;
  recipe: UserRecipeDraftRecipe;
  ingredients: RecipeIngredientDisplayItem[];
  steps: StepItem[];
  updatedAt: number;
};

export type UserRecipeEditsContextValue = {
  getRecipeDraft: (recipeId: string) => UserRecipeDraft | undefined;
  upsertRecipeDraft: (draft: Omit<UserRecipeDraft, 'updatedAt'>) => void;
  removeRecipeDraft: (recipeId: string) => void;
  getRecipeDraftMap: () => Record<string, UserRecipeDraft>;
};

export const UserRecipeEditsContext = React.createContext<UserRecipeEditsContextValue | undefined>(
  undefined
);
