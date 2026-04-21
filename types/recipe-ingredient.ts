export type RecipeIngredientApiItem = {
  recipeId: number | string;
  ingredientId: number | string;
  quantity?: number | string | null;
  unit?: string | null;
  note?: string | null;
  ingredient?: {
    id?: number | string;
    name?: string | null;
    emoji?: string | null;
  } | null;
  ingredientName?: string | null;
  name?: string | null;
  emoji?: string | null;
};

export type CreateRecipeIngredientRequest = {
  recipeId: number;
  ingredientId: number;
  quantity?: number;
  unit?: string;
  note?: string;
};

export type UpdateRecipeIngredientRequest = {
  recipeId: number;
  ingredientId: number;
  quantity?: number;
  unit?: string;
  note?: string;
};

export type RecipeIngredientDisplayItem = {
  recipeId: number;
  ingredientId: number;
  name: string;
  quantityLabel: string;
  quantityValue?: number;
  unit: string;
  note: string;
  emoji: string;
  bg: string;
};
