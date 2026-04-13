import { SavedRecipesContext } from '@/context/saved-recipes-context';
import * as React from 'react';

export function useSavedRecipes() {
  const context = React.useContext(SavedRecipesContext);
  if (!context) {
    throw new Error('useSavedRecipes must be used within a SavedRecipesProvider');
  }
  return context;
}
