/**
 * context/ai-recipe-context.tsx
 *
 * Context chia sẻ trạng thái của mutation useGenerateRecipe
 * giữa màn hình ai-recipe (gọi API) và recipe-generating (hiển thị animation + kết quả).
 *
 * Cách dùng:
 *  - Bọc cả hai màn hình bằng <AIRecipeProvider> (đã đặt trong _layout.tsx)
 *  - Trong ai-recipe.tsx: dùng useAIRecipeContext() để lấy generateRecipe.mutate
 *  - Trong recipe-generating: dùng useAIRecipeContext() để lấy isPending, data, error
 */

import * as React from 'react';
import { useGenerateRecipe } from '@/hooks/use-ai-recipe';
import type { AIRecipe } from '@/types/aiRecipe';

// ─────────────────────────────────────────────────────────────
// Shape của context
// ─────────────────────────────────────────────────────────────

type AIRecipeContextType = {
  /** Gọi hàm này để bắt đầu sinh công thức */
  generate: ReturnType<typeof useGenerateRecipe>['mutate'];
  /** true khi đang chờ server phản hồi */
  isPending: boolean;
  /** true khi server trả lỗi */
  isError: boolean;
  /** Thông báo lỗi (nếu có) */
  errorMessage: string | null;
  /** Công thức đã sinh được; null nếu chưa có */
  recipe: AIRecipe | null;
  /** Đặt lại trạng thái để sinh công thức mới */
  reset: () => void;
};

const AIRecipeContext = React.createContext<AIRecipeContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export function AIRecipeProvider({ children }: { children: React.ReactNode }) {
  const mutation = useGenerateRecipe();

  const value: AIRecipeContextType = {
    generate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.error?.message ?? null,
    recipe: mutation.data ?? null,
    reset: mutation.reset,
  };

  return <AIRecipeContext.Provider value={value}>{children}</AIRecipeContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useAIRecipeContext(): AIRecipeContextType {
  const ctx = React.useContext(AIRecipeContext);
  if (!ctx) {
    throw new Error('useAIRecipeContext must be used within AIRecipeProvider');
  }
  return ctx;
}
