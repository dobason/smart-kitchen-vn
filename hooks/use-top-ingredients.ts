import { useQuery } from '@tanstack/react-query';
import ingredientApi from '@/services/ingredientServices';
import { queryKeys } from '@/lib/queryKeys';
import { ApiIngredientItem } from '@/types/ingredient';

const TOP_N = 6;

/**
 * Fetches all ingredients from GET /v1/ingredients/ and returns only
 * the first 6 items as "suggested" ingredients.
 *
 * Return shape mirrors TanStack Query's useQuery for familiarity:
 *   { suggestions, isLoading, isError, error, refetch }
 */
export function useTopIngredients() {
  const query = useQuery<ApiIngredientItem[]>({
    queryKey: queryKeys.ingredient.all,
    queryFn: () => ingredientApi.getAll(),
    // Data is stable — cache for 10 minutes, no background refetch on focus
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // ✂️  Slice: keep only the first 6 items
  const suggestions: ApiIngredientItem[] = (query.data ?? []).slice(0, TOP_N);

  return {
    suggestions,           // The top 6 ingredients (or [] while loading)
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Returns the full list of ingredients from GET /v1/ingredients/.
 * Shares the same TanStack Query cache key as useTopIngredients(),
 * so both hooks are served from a single network request.
 *
 * Return shape:
 *   { ingredients, isLoading, isError, error, refetch }
 */
export function useAllIngredients() {
  const query = useQuery<ApiIngredientItem[]>({
    queryKey: queryKeys.ingredient.all,
    queryFn: () => ingredientApi.getAll(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ingredients: query.data ?? [],   // Full unsliced array (or [] while loading)
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// Triggering Metro bundler cache invalidation
