import { IngredientsContext } from '@/context/ingredients-context';
import * as React from 'react';

export const IngredientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exploreIngredientIds, setExploreIngredientIds] = React.useState<string[]>([]);
  const [aiIngredientIds, setAiIngredientIds] = React.useState<string[]>([]);

  const value = React.useMemo(
    () => ({
      exploreIngredientIds,
      setExploreIngredientIds,
      aiIngredientIds,
      setAiIngredientIds,
    }),
    [exploreIngredientIds, aiIngredientIds]
  );

  return <IngredientsContext.Provider value={value}>{children}</IngredientsContext.Provider>;
};
