import axiosClient from './axiosClient';
import { IngredientApiItem } from '@/types/ingredient';

const ingredientApi = {
  // GET /v1/ingredients/
  getAll: (): Promise<IngredientApiItem[]> => {
    return axiosClient.get('/v1/ingredients/');
  },

  // GET /v1/ingredients/:id
  getById: (id: string | number): Promise<IngredientApiItem> => {
    return axiosClient.get(`/v1/ingredients/${id}`);
  },
};

export default ingredientApi;
