import axiosClient from "./axiosClient";
import { CreateIngredientRequest, IngredientItem } from "../types/ingredient";

const ingredientApi = {
  // Lấy danh sách hoặc Tìm kiếm nguyên liệu (Trả về mảng IngredientItem)
  getAll: (searchKeyword?: string): Promise<IngredientItem[]> => {
    const url = searchKeyword ? `/ingredients/?search=${searchKeyword}` : '/ingredients/';
    return axiosClient.get(url);
  },

  // Thêm nguyên liệu mới do người dùng tự gõ
  create: (data: CreateIngredientRequest): Promise<IngredientItem> => {
    return axiosClient.post('/ingredients/', data);
  }
};

export default ingredientApi;