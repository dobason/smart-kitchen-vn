import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';

/**
 * Hook lấy danh sách công thức của user hiện tại.
 *
 * @param searchQuery - Từ khoá tìm kiếm / lọc (optional).
 *   Khi searchQuery thay đổi → queryKey thay đổi → TanStack Query tự refetch.
 */
export function useRecipes(searchQuery?: string) {
  const { user } = useUser();
  const userId = user?.id ?? '';

  return useQuery({
    queryKey: queryKeys.recipe.list(userId, searchQuery),
    queryFn: () =>
      recipeApi.getAll({
        userId,
        sourceType: 'MANUAL',
        ...(searchQuery ? { search: searchQuery } : {}),
      }),
    enabled: !!userId, // chỉ fetch khi đã đăng nhập
  });
}

/**
 * Hook lấy toàn bộ danh sách công thức (bao gồm cả AI sinh ra và thêm thủ công).
 *
 * @param searchQuery - Từ khoá tìm kiếm / lọc (optional).
 */
export function useAllRecipe(searchQuery?: string) {
  const { user } = useUser();
  const userId = user?.id ?? '';

  return useQuery({
    queryKey: ['recipes', 'allList', userId, searchQuery ?? ''] as const,
    queryFn: () =>
      recipeApi.getAll({
        userId,
        // Không truyền sourceType để lấy tất cả
        ...(searchQuery ? { search: searchQuery } : {}),
      }),
    enabled: !!userId,
  });
}
