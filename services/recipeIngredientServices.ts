import axiosClient from './axiosClient';
import {
  CreateRecipeIngredientRequest,
  RecipeIngredientApiItem,
  UpdateRecipeIngredientRequest,
} from '@/types/recipe-ingredient';

export type GetRecipeIngredientsParams = {
  recipeId?: string | number;
  ingredientId?: string | number;
};

const recipeIngredientApi = {
  // GET /v1/recipe-ingredients/?recipeId=:recipeId&ingredientId=:ingredientId
  getAll: (params: GetRecipeIngredientsParams): Promise<RecipeIngredientApiItem[]> => {
    return axiosClient.get('/v1/recipe-ingredients/', { params });
  },

  // GET /v1/recipe-ingredients/:recipeId/:ingredientId
  getById: (
    recipeId: string | number,
    ingredientId: string | number
  ): Promise<RecipeIngredientApiItem> => {
    return axiosClient.get(`/v1/recipe-ingredients/${recipeId}/${ingredientId}`);
  },

  // POST /v1/recipe-ingredients/
  create: (data: CreateRecipeIngredientRequest): Promise<RecipeIngredientApiItem> => {
    return axiosClient.post('/v1/recipe-ingredients/', data);
  },

  // PUT /v1/recipe-ingredients/:recipeId/:ingredientId
  update: (
    recipeId: string | number,
    ingredientId: string | number,
    data: UpdateRecipeIngredientRequest
  ): Promise<RecipeIngredientApiItem> => {
    return axiosClient.put(`/v1/recipe-ingredients/${recipeId}/${ingredientId}`, data);
  },

  // DELETE /v1/recipe-ingredients/:recipeId/:ingredientId
  remove: (recipeId: string | number, ingredientId: string | number): Promise<void> => {
    return axiosClient.delete(`/v1/recipe-ingredients/${recipeId}/${ingredientId}`);
  },
};

export default recipeIngredientApi;
