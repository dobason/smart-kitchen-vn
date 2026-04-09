import type { SearchRecipeItem } from '@/types/recipe';
import * as React from 'react';

export type SavedRecipesContextValue = {
  savedRecipes: SearchRecipeItem[];
  savedRecipeIds: Set<string>;
  isSaved: (recipeId: string) => boolean;
  saveRecipe: (recipe: SearchRecipeItem) => void;
  removeSavedRecipe: (recipeId: string) => void;
  toggleSavedRecipe: (recipe: SearchRecipeItem) => void;
  getSavedRecipeById: (recipeId: string) => SearchRecipeItem | undefined;
};

export const SavedRecipesContext = React.createContext<SavedRecipesContextValue | undefined>(
  undefined
);
