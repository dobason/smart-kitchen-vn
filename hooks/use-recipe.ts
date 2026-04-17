import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';

export function useRecipeDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.recipe.detail(id),
    queryFn: () => recipeApi.getDetail(id),
    enabled: !!id,
  });
}

export function useUpdateRecipe(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => recipeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipe.detail(id) });
    },
  });
}
