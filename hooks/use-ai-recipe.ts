/**
 * hooks/use-ai-recipe.ts
 *
 * Hai custom hook quản lý trạng thái async cho pipeline AI:
 *
 *  1. useDetectIngredients  — Gửi ảnh → nhận danh sách nguyên liệu
 *  2. useGenerateRecipe     — Gửi nguyên liệu → nhận công thức nấu ăn
 *
 * Sử dụng `useMutation` từ @tanstack/react-query để tự động quản lý:
 *  - `isPending`  → đang xử lý (hiển thị spinner / loading state)
 *  - `isSuccess`  → thành công (render kết quả)
 *  - `isError`    → thất bại (hiển thị thông báo lỗi)
 *  - `isIdle`     → chưa gọi (trạng thái ban đầu)
 *  - `reset()`    → đặt lại state về idle
 */

import { useMutation } from '@tanstack/react-query';
import aiRecipeApi, { type AILanguage } from '@/services/aiRecipeServices';
import type {
  DetectIngredientsResponse,
  GenerateRecipeRequest,
  AIRecipePreference,
  AIRecipe,
} from '@/types/aiRecipe';

// ─────────────────────────────────────────────────────────────
// Hook 1: Nhận diện nguyên liệu từ ảnh
// ─────────────────────────────────────────────────────────────

/** Tham số đầu vào cho `useDetectIngredients().mutate(...)` */
export interface DetectIngredientsVariables {
  /** URI ảnh trên thiết bị do ImagePicker trả về */
  imageUri: string;
  /**
   * Ngôn ngữ tên nguyên liệu trong phản hồi.
   * Mặc định `'vi'` nếu không truyền.
   */
  language?: AILanguage;
}

/**
 * `useDetectIngredients`
 *
 * Hook gửi ảnh lên AI Server và nhận danh sách nguyên liệu nhận diện được.
 *
 * Lưu ý: Render free tier có thể cold start 30–50 giây.
 * Nên hiển thị skeleton/indicator và thông báo "đang xử lý..." để UX tốt hơn.
 *
 * @param options.onSuccess - Callback nhận `DetectIngredientsResponse` khi thành công
 * @param options.onError   - Callback nhận `Error` khi thất bại
 *
 * @example
 * ```tsx
 * const { mutate: detect, isPending, data, isError, error } = useDetectIngredients({
 *   onSuccess: (result) => setIngredients(result.ingredients),
 * });
 *
 * // Gọi khi user chọn ảnh
 * detect({ imageUri: pickerResult.assets[0].uri, language: 'vi' });
 *
 * if (isPending) return <ActivityIndicator size="large" />;
 * if (isError)   return <Text>Lỗi: {error.message}</Text>;
 * if (data)      return <IngredientList items={data.ingredients} />;
 * ```
 */
export function useDetectIngredients(options?: {
  onSuccess?: (data: DetectIngredientsResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DetectIngredientsResponse, Error, DetectIngredientsVariables>({
    mutationFn: ({ imageUri, language = 'vi' }) =>
      aiRecipeApi.detectIngredients(imageUri, language),

    onSuccess: (data) => {
      if (__DEV__) {
        console.log(
          '[useDetectIngredients] ✅ Nhận diện thành công:',
          data.ingredients
        );
      }
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      if (__DEV__) {
        // Phân biệt timeout (cold start) với lỗi mạng khác để dễ debug
        const isTimeout = error.message.toLowerCase().includes('timeout') ||
                          error.message.toLowerCase().includes('econnaborted');
        if (isTimeout) {
          console.warn(
            '[useDetectIngredients] ⏱ Timeout — Render đang cold start, thử lại sau.'
          );
        } else {
          console.error('[useDetectIngredients] ❌ Lỗi:', error.message);
        }
      }
      options?.onError?.(error);
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Hook 2: Sinh công thức nấu ăn
// ─────────────────────────────────────────────────────────────

/** Tham số đầu vào cho `useGenerateRecipe().mutate(...)` */
export interface GenerateRecipeVariables {
  /** Danh sách nguyên liệu (bắt buộc, thường từ kết quả detectIngredients) */
  ingredients: string[];
  /** Tùy chọn nấu ăn cá nhân hóa (tuỳ chọn) */
  preference?: AIRecipePreference;
  /**
   * Ngôn ngữ công thức trả về.
   * Mặc định `'vi'` nếu không truyền.
   */
  language?: AILanguage;
}

/**
 * `useGenerateRecipe`
 *
 * Hook gửi danh sách nguyên liệu lên AI Server và nhận công thức nấu ăn hoàn chỉnh.
 *
 * @param options.onSuccess - Callback nhận `AIRecipe` khi thành công
 * @param options.onError   - Callback nhận `Error` khi thất bại
 *
 * @example
 * ```tsx
 * const { mutate: generate, isPending, data, isError } = useGenerateRecipe({
 *   onSuccess: (recipe) => navigation.navigate('RecipeResult', { recipe }),
 * });
 *
 * // Gọi khi user nhấn "Tạo công thức"
 * generate({
 *   ingredients: ['thịt gà', 'tỏi', 'hành tây'],
 *   preference: { time_constraints: '30 phút', dietary_restrictions: 'ít dầu mỡ' },
 *   language: 'vi',
 * });
 *
 * if (isPending) return <ActivityIndicator size="large" />;
 * if (isError)   return <Text>Không thể tạo công thức. Thử lại!</Text>;
 * if (data)      return <RecipeCard recipe={data} />;
 * ```
 */
export function useGenerateRecipe(options?: {
  onSuccess?: (recipe: AIRecipe) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<AIRecipe, Error, GenerateRecipeVariables>({
    mutationFn: ({ ingredients, preference, language = 'vi' }) => {
      const payload: GenerateRecipeRequest = { ingredients, preference };
      return aiRecipeApi.generateRecipe(payload, language);
    },

    onSuccess: (recipe) => {
      if (__DEV__) {
        console.log(
          '[useGenerateRecipe] ✅ Công thức thành công:',
          recipe.name ?? '(không có tên món)'
        );
      }
      options?.onSuccess?.(recipe);
    },

    onError: (error) => {
      if (__DEV__) {
        const isTimeout = error.message.toLowerCase().includes('timeout') ||
                          error.message.toLowerCase().includes('econnaborted');
        if (isTimeout) {
          console.warn(
            '[useGenerateRecipe] ⏱ Timeout — Render đang cold start, thử lại sau.'
          );
        } else {
          console.error('[useGenerateRecipe] ❌ Lỗi:', error.message);
        }
      }
      options?.onError?.(error);
    },
  });
}
