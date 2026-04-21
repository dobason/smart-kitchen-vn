import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-expo';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';
import * as React from 'react';
import { useUserRecipeEdits } from '@/hooks/use-user-recipe-edits';
import type { SearchRecipeItem } from '@/types/recipe';

const RECIPES_SYNC_INTERVAL_MS = 5000;

/**
 * Hook lấy danh sách công thức của user hiện tại.
 *
 * @param searchQuery - Từ khoá tìm kiếm / lọc (optional).
 *   Khi searchQuery thay đổi → queryKey thay đổi → TanStack Query tự refetch.
 */
export function useRecipes(searchQuery?: string) {
  const { user } = useUser();
  const { getRecipeDraftMap } = useUserRecipeEdits();
  const recipeDraftMap = getRecipeDraftMap();
  const userId = user?.id;
  const bypassAuthInDev =
    __DEV__ && process.env.EXPO_PUBLIC_BYPASS_AUTH_IN_DEV?.toLowerCase() === 'true';
  const canFetchRecipes = Boolean(userId) || bypassAuthInDev;

  const recipesQuery = useQuery<SearchRecipeItem[]>({
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

  const mergedData = React.useMemo(() => {
    const data = recipesQuery.data ?? [];

    return data.map((recipe) => {
      const recipeDraft = recipeDraftMap[recipe.id];

      if (!recipeDraft) {
        return recipe;
      }

      return {
        ...recipe,
        name: recipeDraft.recipe.name,
        calories: recipeDraft.recipe.calories,
        timeMinutes: recipeDraft.recipe.totalTime,
      };
    });
  }, [recipeDraftMap, recipesQuery.data]);

  return {
    ...recipesQuery,
    data: mergedData,
  };
}
