import axiosClient from './axiosClient';
import { ApiIngredientItem } from '@/types/ingredient';

/**
 * API service for the /v1/ingredients/ endpoint.
 * Uses the shared axiosClient (which already handles baseURL, auth, and
 * unwrapping the `data` envelope from the response interceptor).
 */
const ingredientApi = {
  /**
   * Fetch all ingredients from the server.
   * The response interceptor in axiosClient automatically extracts
   * `response.data.data`, so this resolves directly to the array.
   */
  getAll: (): Promise<ApiIngredientItem[]> => {
    return axiosClient.get('/v1/ingredients/');
  },
};

export default ingredientApi;
