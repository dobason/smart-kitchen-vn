import * as React from 'react';

type IngredientsContextType = {
  exploreIngredientIds: string[];
  setExploreIngredientIds: React.Dispatch<React.SetStateAction<string[]>>;
  aiIngredientIds: string[];
  setAiIngredientIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export const IngredientsContext = React.createContext<IngredientsContextType | undefined>(
  undefined
);
