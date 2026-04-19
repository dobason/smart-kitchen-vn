import axiosClient from './axiosClient';
import { RecipeDetail, UpdateRecipeRequest } from '../types/recipe';

const recipeApi = {
  //Tìm công thức theo Id
  getById: (id: string): Promise<RecipeDetail> => {
    return axiosClient.get(`/recipes/${id}`);
  },

  //Lấy chi tiết công thức
  getDetail: (id: string): Promise<RecipeDetail> => {
    return recipeApi.getById(id);
  },

  //Cập nhật công thức bao gồm info, ingredients, steps
  update: (id: string, data: UpdateRecipeRequest): Promise<RecipeDetail> => {
    return axiosClient.put(`/recipes/${id}`, data);
  },

  //Xóa công thức
  deleteById: (id: string): Promise<void> => {
    return axiosClient.delete(`/recipes/${id}`);
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
