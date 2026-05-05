// File: hooks/use-cookbook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cookbookApi from '@/services/cookbookServices';
import { queryKeys } from '@/lib/queryKeys';
import { CreateCookbookRequest, UpdateCookbookRequest } from '@/types/cookbook';

// 1. LẤY danh sách sổ tay (GET)
export function useCookbooks(userId: string) {
  return useQuery({
    queryKey: queryKeys.cookbook.detail(userId),
    queryFn: () => cookbookApi.getAll(userId),
    enabled: !!userId,
  });
}

// 2. LẤY danh sách công thức trong sổ tay (GET)
export function useCookbookRecipes(cookbookId: string) {
  return useQuery({
    queryKey: ['cookbook-recipes', cookbookId],
    queryFn: () => cookbookApi.getRecipes(cookbookId),
    enabled: !!cookbookId,
    select: (data: any[]) =>
      data.map((item) => {
        // API trả về { recipe: {...} } hoặc trực tiếp recipe
        const recipe = item.recipe ?? item;
        return {
          id: String(recipe.id),
          name: recipe.name ?? recipe.recipesName ?? recipe.dish ?? '',
          description: recipe.description ?? '',
          calories: recipe.calories ?? 0,
          timeMinutes: recipe.totalTime ?? 0,
          imageUrl: recipe.imageRecipe ?? '',
          tags: recipe.tags ?? [],
          cookware: recipe.cookware ?? [],
        };
      }),
  });
}

// 3. TẠO sổ tay mới (POST)
export function useCreateCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCookbookRequest) => cookbookApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbook.all });
    },
  });
}

// 4. SỬA tên sổ tay (PUT)
export function useUpdateCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCookbookRequest }) =>
      cookbookApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbook.all });
    },
  });
}

// 5. XÓA sổ tay (DELETE)
export function useDeleteCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cookbookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbook.all });
    },
  });
}

// 6. THÊM công thức vào sổ tay (POST /v1/cookbook-recipes/)
export function useAddRecipeToCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cookbookId, recipeId }: { cookbookId: number; recipeId: number }) =>
      cookbookApi.addRecipe(cookbookId, recipeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cookbook.all });
      queryClient.invalidateQueries({ queryKey: ['cookbook-recipes', String(variables.cookbookId)] });
    },
  });
}

export function useRemoveRecipeFromCookbook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cookbookId, recipeId }: { cookbookId: number; recipeId: number }) =>
      cookbookApi.removeRecipe(cookbookId, recipeId),
    onSuccess: (_, { cookbookId }) => {
      queryClient.invalidateQueries({ queryKey: ['cookbook-recipes', String(cookbookId)] });
    },
  });
}

