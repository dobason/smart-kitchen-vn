import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';

const RECIPES_SYNC_INTERVAL_MS = 5000;

/**
 * Hook lấy danh sách công thức của user hiện tại.
 *
 * @param searchQuery - Từ khoá tìm kiếm / lọc (optional).
 *   Khi searchQuery thay đổi → queryKey thay đổi → TanStack Query tự refetch.
 */
export function useRecipes(searchQuery?: string) {
  const { user } = useUser();
  const userId = user?.id;
  const bypassAuthInDev =
    __DEV__ && process.env.EXPO_PUBLIC_BYPASS_AUTH_IN_DEV?.toLowerCase() === 'true';
  const canFetchRecipes = Boolean(userId) || bypassAuthInDev;

  return useQuery({
    queryKey: queryKeys.recipe.list(userId ?? 'guest', searchQuery),
    queryFn: () =>
      recipeApi.getAll({
        sourceType: 'MANUAL',
        ...(userId ? { userId } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
      }),
    enabled: canFetchRecipes,
    refetchInterval: canFetchRecipes ? RECIPES_SYNC_INTERVAL_MS : false,
    refetchIntervalInBackground: true,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}
