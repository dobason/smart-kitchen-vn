import { IngredientGroup } from './ingredient';
import { StepItem } from './step';

export type SearchRecipeItem = {
  id: string;
  name: string;
  description: string;
  calories: number;
  timeMinutes: number;
  imageUrl: string;
  tags: string[];
  cookware: string[];
};

export type RecipeDetail = {
  id: string;
  name: string;
  imageUrl: string;
  timeMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredientGroups: IngredientGroup[]; // Dùng cho phần Ingredients có Header
  steps: StepItem[];
};

// Payload dùng để gửi lên Server khi bấm nút Save
export type UpdateRecipeRequest = Partial<Omit<RecipeDetail, 'id'>>;