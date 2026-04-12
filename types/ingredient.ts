export type IngredientItem = {
  id: string;
  name: string;
  emoji?: string;
  bgColor?: string;
  qty?: string;
  unit?: string;
};

export type IngredientGroup = {
  id: string;
  label: string;
  items: IngredientItem[];
};

export type CookingIngredientItem = {
  emoji: string;
  name: string;
  qty: string;
  bg: string;
};
 
