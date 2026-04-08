import { CookingIngredientItem } from './ingredient';
import { StepItem } from './step';

export type SearchRecipeItem = {
  id: string;
  name: string;
  description: string;
  calories: number;
  timeMinutes: number;
  imageUrl: string;
  tags: string[];
  cookware?: string[];
};

export type RecipeDetail = SearchRecipeItem & {
  recipe_id: number;
  recipes_name: string;
  description: string;
  calories: number;
  total_time: number;
  image_url: string;
  ingredients: CookingIngredientItem[];
  steps: StepItem[];
};
