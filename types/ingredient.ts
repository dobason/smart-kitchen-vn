export type IngredientItem = {
  id?: string;
  emoji?: string;
  name: string;
  qty?: string;
  unit?: string;
  bg?: string;
};

export type IngredientGroup = {
  id: string;
  label: string;
  items: IngredientItem[];
};