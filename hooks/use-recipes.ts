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
