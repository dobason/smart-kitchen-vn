/**
 * services/aiAxiosClient.ts
 *
 * Axios client độc lập dành riêng cho AI Server trên Render.
 *
 * Lý do tách riêng (không tái sử dụng axiosClient.ts của backend chính):
 *  - AI Server có baseURL khác hoàn toàn (Render, không phải backend nội bộ)
 *  - AI Server KHÔNG yêu cầu xác thực → không gắn Bearer Token
 *  - Timeout dài hơn (60s) để chờ cold start Render và xử lý LLM/Vision AI
 *
 * ⚠️  Không import file này từ axiosClient.ts và ngược lại.
 */

import axios, { type AxiosError } from 'axios';

// ─── Cấu hình Axios cho AI Server ────────────────────────────

const aiAxiosClient = axios.create({
  baseURL: __DEV__
    ? 'http://172.20.10.3:8000/api/v1'
    : 'https://smart-kitchen-ai.onrender.com/api/v1',

  /**
   * 60 000 ms = 60 giây.
   * Cần thiết vì:
   *  1. Cold start trên Render free tier có thể mất 30–50 giây.
   *  2. Vision AI + Gemini LLM xử lý ảnh thường mất 5–15 giây sau khi server warm.
   */
  timeout: 60_000,

  headers: {
    Accept: 'application/json',
    // Mặc định trả về tiếng Việt; từng request có thể ghi đè header này
    'Accept-Language': 'vi',
  },
});

// ─── Response Interceptor — log lỗi trong __DEV__ ─────────────

aiAxiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (__DEV__) {
      if (error.code === 'ECONNABORTED') {
        console.warn(
          '[aiAxiosClient] Request timed out sau 60 giây.\n' +
          'Render có thể đang cold start — hãy thử lại sau vài giây.'
        );
      } else {
        console.error(
          '[aiAxiosClient] Lỗi mạng:',
          error.message,
          '| Status:',
          error.response?.status ?? 'N/A'
        );
      }
    }
    return Promise.reject(error);
  }
);

export default aiAxiosClient;
