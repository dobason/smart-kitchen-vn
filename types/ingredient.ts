/**
 * Shape of a single ingredient returned by GET /v1/ingredients/
 * Adjust the fields to match your actual API response.
 */
export type ApiIngredientItem = {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  [key: string]: unknown; // allows extra fields the API may include
};

export type IngredientItem = {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
};

export type IngredientApiItem = {
  id: number | string;
  name?: string | null;
  emoji?: string | null;
  icon?: string | null;
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
 
