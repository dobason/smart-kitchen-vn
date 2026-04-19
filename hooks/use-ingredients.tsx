import { IngredientsContext } from '@/context/ingredients-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ingredientApi from '@/services/ingredientServices';
import { queryKeys } from '@/lib/queryKeys';
import { CreateIngredientRequest } from '@/types/ingredient';
import * as React from 'react';

export function useIngredients() {
  const context = React.useContext(IngredientsContext);
  if (!context) throw new Error('useIngredients must be used within an IngredientsProvider');
  return context;
}

export function useGetIngredients(keyword?: string) {
  return useQuery({
    queryKey: queryKeys.ingredient.detail(keyword),
    queryFn: () => ingredientApi.getAll(keyword),
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIngredientRequest) => ingredientApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredient.all });
    },
  });
}