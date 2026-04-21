import axiosClient from "./axiosClient";
import { CreateCookbookRequest, UpdateCookbookRequest, CookbookDetail } from "../types/cookbook";

const cookbookApi = {
  // Lấy danh sách sổ tay của 1 user (Trả về mảng CookbookDetail)
  getAll: (userId: string): Promise<CookbookDetail[]> => {
    return axiosClient.get(`/v1/cookbooks/?userId=${userId}`);
  },

  // Tạo sổ tay mới
  create: (data: CreateCookbookRequest): Promise<CookbookDetail> => {
    return axiosClient.post('/v1/cookbooks', data);
  },

  // Đổi tên sổ tay
  update: (id: string, data: UpdateCookbookRequest): Promise<CookbookDetail> => {
    return axiosClient.put(`/v1/cookbooks/${id}`, data);
  },

  // Xóa sổ tay
  delete: (id: string): Promise<void> => {
    return axiosClient.delete(`/v1/cookbooks/${id}`);
  },

  // Lấy danh sách công thức trong sổ tay
  getRecipes: (cookbookId: string): Promise<any[]> => {
    return axiosClient.get(`/v1/cookbook-recipes/?cookbookId=${cookbookId}`);
  },

  // Thêm công thức vào sổ tay
  addRecipe: (cookbookId: number, recipeId: number): Promise<void> => {
    return axiosClient.post('/v1/cookbook-recipes/', { cookbookId, recipeId });
  },

  removeRecipe: (cookbookId: number, recipeId: number): Promise<void> => {
    return axiosClient.delete(`/v1/cookbook-recipes/${cookbookId}/${recipeId}`);
  },
};

export default cookbookApi;