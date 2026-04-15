import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
  timeout: 10000,
});

// Để dễ soi lỗi trên Terminal
axiosClient.interceptors.request.use(async (config) => {
    return config;
});

// GHI LOG VÀ BÓC TÁCH DỮ LIỆU KHI NHẬN
axiosClient.interceptors.response.use((response) => {
    if(response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
});

export default axiosClient;