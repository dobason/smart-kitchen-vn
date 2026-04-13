import { SEARCH_RECIPES } from '@/constants/recipeData';
import {
  SavedRecipesContext,
  type SavedRecipesContextValue,
} from '@/context/saved-recipes-context';
import type { SearchRecipeItem } from '@/types/recipe';
import * as React from 'react';

export const SavedRecipesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = React.useState<SearchRecipeItem[]>(() => {
    const defaultRecipe = SEARCH_RECIPES[0];
    return defaultRecipe ? [defaultRecipe] : [];
  });

  const saveRecipe = React.useCallback((recipe: SearchRecipeItem) => {
    setSavedRecipes((prev) => {
      if (prev.some((item) => item.id === recipe.id)) {
        return prev;
      }
      return [recipe, ...prev];
    });
  }, []);

  const removeSavedRecipe = React.useCallback((recipeId: string) => {
    setSavedRecipes((prev) => prev.filter((item) => item.id !== recipeId));
  }, []);

  const toggleSavedRecipe = React.useCallback((recipe: SearchRecipeItem) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((item) => item.id === recipe.id);
      if (exists) {
        return prev.filter((item) => item.id !== recipe.id);
      }
      return [recipe, ...prev];
    });
  }, []);

  const savedRecipeIds = React.useMemo(
    () => new Set(savedRecipes.map((item) => item.id)),
    [savedRecipes]
  );

  const isSaved = React.useCallback(
    (recipeId: string) => savedRecipeIds.has(recipeId),
    [savedRecipeIds]
  );

  const getSavedRecipeById = React.useCallback(
    (recipeId: string) => savedRecipes.find((item) => item.id === recipeId),
    [savedRecipes]
  );

  const value = React.useMemo<SavedRecipesContextValue>(
    () => ({
      savedRecipes,
      savedRecipeIds,
      isSaved,
      saveRecipe,
      removeSavedRecipe,
      toggleSavedRecipe,
      getSavedRecipeById,
    }),
    [
      savedRecipes,
      savedRecipeIds,
      isSaved,
      saveRecipe,
      removeSavedRecipe,
      toggleSavedRecipe,
      getSavedRecipeById,
    ]
  );

  return <SavedRecipesContext.Provider value={value}>{children}</SavedRecipesContext.Provider>;
};
