import axiosClient from './axiosClient';
import { RecipeDetail, SearchRecipeItem, UpdateRecipeRequest } from '../types/recipe';
import { CookingIngredientItem, StepItem } from '@/types';

export type GetRecipesParams = {
  userId: string;
  sourceType?: 'MANUAL';
  search?: string;
};

const recipeApi = {
  // Lấy danh sách công thức
  getAll: (params: GetRecipesParams): Promise<SearchRecipeItem[]> => {
    return axiosClient.get('/v1/recipes/', { params });
  },

  //Lấy chi tiết công thức
  getDetail: (id: string): Promise<RecipeDetail> => {
    return axiosClient.get(`/recipes/${id}`);
  },

  //Cập nhật công thức bao gồm info, ingredients, steps
  update: (id: string, data: UpdateRecipeRequest): Promise<RecipeDetail> => {
    return axiosClient.put(`/recipes/${id}`, data);
  },

  //Upload ảnh

  // uploadImage: async (id: string, file: any): Promise<{ imageUrl: string }> => {
  //     const formData = new FormData();
  //     formData.append('image', {
  //         uri: file.uri,
  //         name: `recipe_${id}.jpg`,
  //         type: 'image/jpeg',
  //     } as any);

  //     return axiosClient.post(`/recipes/${id}/upload-image`, formData, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  // },
};

export default recipeApi;
