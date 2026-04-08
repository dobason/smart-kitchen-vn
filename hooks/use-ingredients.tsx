import { IngredientsContext } from '@/context/ingredients-context';
import * as React from 'react';

export function useIngredients() {
  const context = React.useContext(IngredientsContext);
  if (!context) throw new Error('useIngredients must be used within an IngredientsProvider');
  return context;
}
