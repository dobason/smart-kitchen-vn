import axiosClient from './axiosClient';
import { Tag } from '@/types/tag';

const tagServices = {
  // Fetch all tags from the server.
  getAll: (): Promise<Tag[]> => {
    return axiosClient.get('/v1/tags/');
  },
};

export default tagServices;
