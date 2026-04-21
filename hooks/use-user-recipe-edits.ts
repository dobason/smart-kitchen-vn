import { UserRecipeEditsContext } from '@/context/user-recipe-edits-context';
import * as React from 'react';

export function useUserRecipeEdits() {
  const context = React.useContext(UserRecipeEditsContext);

  if (!context) {
    throw new Error('useUserRecipeEdits must be used within a UserRecipeEditsProvider');
  }

  return context;
}
