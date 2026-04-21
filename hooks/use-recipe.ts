import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';
import { UpdateRecipeRequest } from '@/types/recipe';

export function useRecipeForm(recipeData: any) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  useEffect(() => {
    if (recipeData) {
      setName(recipeData.name || '');
      setTime((recipeData.totalTime ?? recipeData.timeMinutes)?.toString() || '');
      setCalories(recipeData.calories?.toString() || '');
      setProtein(recipeData.protein?.toString() || '');
      setCarbs(recipeData.carbs?.toString() || '');
      setFats(recipeData.fats?.toString() || '');
    }
  }, [recipeData]);

  const buildPayload = () => ({
    name,
    totalTime: Number(time) || 0,
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fats: Number(fats) || 0,
  });

  return {
    name,
    setName,
    time,
    setTime,
    calories,
    setCalories,
    protein,
    setProtein,
    carbs,
    setCarbs,
    fats,
    setFats,
    buildPayload,
  };
}

export function useRecipeDetail(id: string) {
  return useRecipeById(id);
}

export function useRecipeById(id: string) {
  return useQuery({
    queryKey: queryKeys.recipe.detail(id),
    queryFn: () => recipeApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateRecipe(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRecipeRequest) => recipeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipe.detail(id) });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recipeApi.deleteById(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipe.all });
      queryClient.removeQueries({ queryKey: queryKeys.recipe.detail(deletedId) });
    },
  });
}
