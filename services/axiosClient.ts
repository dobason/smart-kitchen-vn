import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
  timeout: 10000,
});

export function setTokenGetter(getter: () => Promise<string | null>) {
  axiosClient.interceptors.request.use(async (config) => {
    const token = await getter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// GHI LOG VÀ BÓC TÁCH DỮ LIỆU KHI NHẬN
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data && response.data.data) {
      return response.data.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;
