import axiosClient from './axiosClient';
import { CreateStepRequest, StepApiItem, UpdateStepRequest } from '@/types/step';

const stepApi = {
  // GET /v1/steps/?recipeId=:recipeId
  getAllInRecipe: (recipeId: string | number): Promise<StepApiItem[]> => {
    return axiosClient.get('/v1/steps/', { params: { recipeId } });
  },

  // GET /v1/steps/:id
  getById: (id: string | number): Promise<StepApiItem> => {
    return axiosClient.get(`/v1/steps/${id}`);
  },

  // POST /v1/steps/
  create: (data: CreateStepRequest): Promise<StepApiItem> => {
    return axiosClient.post('/v1/steps/', data);
  },

  // PUT /v1/steps/:id
  update: (id: string | number, data: UpdateStepRequest): Promise<StepApiItem> => {
    return axiosClient.put(`/v1/steps/${id}`, data);
  },

  // DELETE /v1/steps/:id
  remove: (id: string | number): Promise<void> => {
    return axiosClient.delete(`/v1/steps/${id}`);
  },
};

export default stepApi;
