export type IngredientItem = {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
};

export type CookingIngredientItem = {
  emoji: string;
  name: string;
  qty: string;
  bg: string;
};

export type EditableIngredientItem = {
  id: string;
  name: string;
  qty: string;
  unit: string;
};

export type IngredientGroup = {
  id: string;
  label: string;
  items: EditableIngredientItem[];
};
 
