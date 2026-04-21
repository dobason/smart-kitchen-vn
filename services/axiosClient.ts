import axios from 'axios';
import queryString from 'query-string';

const shouldUseTunnelApi = process.env.EXPO_PUBLIC_USE_TUNNEL_API?.toLowerCase() === 'true';
const tunnelApiUrl = process.env.EXPO_PUBLIC_API_TUNNEL_URL?.trim();
const localApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const devApiAccessToken = process.env.EXPO_PUBLIC_DEV_ACCESS_TOKEN?.trim();
const bypassAuthInDev = __DEV__ && process.env.EXPO_PUBLIC_BYPASS_AUTH_IN_DEV?.toLowerCase() === 'true';

const resolvedApiUrl = shouldUseTunnelApi && tunnelApiUrl ? tunnelApiUrl : localApiUrl;

let requestInterceptorId: number | null = null;

const axiosClient = axios.create({
  baseURL: resolvedApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
  timeout: 10000,
});

export function setTokenGetter(getter: () => Promise<string | null>) {
  if (requestInterceptorId !== null) {
    axiosClient.interceptors.request.eject(requestInterceptorId);
  }

  requestInterceptorId = axiosClient.interceptors.request.use(async (config) => {
    const token = await getter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (bypassAuthInDev && devApiAccessToken) {
      config.headers.Authorization = `Bearer ${devApiAccessToken}`;
    }
    return config;
  });
}

// GHI LOG VÀ BÓC TÁCH DỮ LIỆU KHI NHẬN
axiosClient.interceptors.response.use(
  (response) => {
    if (response?.data?.data !== undefined) {
      return response.data.data;
    }
    if (response?.data !== undefined) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;
