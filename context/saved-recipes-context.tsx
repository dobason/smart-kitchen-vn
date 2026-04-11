import type { SearchRecipeItem } from '@/types/recipe';
import * as React from 'react';

export type CookbookItem = {
  id: string;
  name: string;
  image: string;
  isDefault: boolean;
  translationKey?: string;
};

export type SavedRecipesContextValue = {
  uncategorizedCookbookId: string;
  cookbooks: CookbookItem[];
  savedRecipes: SearchRecipeItem[];
  savedRecipeIds: Set<string>;
  isSaved: (recipeId: string) => boolean;
  saveRecipe: (recipe: SearchRecipeItem) => void;
  removeSavedRecipe: (recipeId: string) => void;
  toggleSavedRecipe: (recipe: SearchRecipeItem) => void;
  getSavedRecipeById: (recipeId: string) => SearchRecipeItem | undefined;
  getCookbookById: (cookbookId: string) => CookbookItem | undefined;
  getCookbookCount: (cookbookId: string) => number;
  getRecipesByCookbook: (cookbookId: string) => SearchRecipeItem[];
  getRecipeCookbookIds: (recipeId: string) => string[];
  getRecipeCookbooks: (recipeId: string) => CookbookItem[];
  createCookbook: (name: string) => CookbookItem | null;
  renameCookbook: (cookbookId: string, newName: string) => void;
  deleteCookbook: (cookbookId: string) => void;
  assignRecipesToCookbook: (recipeIds: string[], targetCookbookId: string) => void;
};

export const SavedRecipesContext = React.createContext<SavedRecipesContextValue | undefined>(
  undefined
);
