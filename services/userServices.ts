import axiosClient from './axiosClient';

export interface CreateUserInput {
  userId?: string;
  email: string;
  username: string;
  avartarUrl?: string;
}

export const userServices = {
  createUser: async (data: CreateUserInput) => {
    return axiosClient.post('/v1/users/', data);
  },
  upsertUser: async (data: CreateUserInput) => {
    return axiosClient.post('/v1/users/upsert', data);
  },
  syncClerkUser: async (clerkUserId: string) => {
    return axiosClient.post('/v1/users/sync-clerk', { clerkUserId });
  },
};
