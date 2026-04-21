import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';
import { UpdateRecipeRequest } from '@/types/recipe';
import { useUserRecipeEdits } from '@/hooks/use-user-recipe-edits';

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

function applyRecipeDraftToData(
  recipeData: any,
  draft?: {
    recipe: {
      name: string;
      totalTime: number;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
  }
) {
  if (!recipeData || !draft) {
    return recipeData;
  }

  return {
    ...recipeData,
    name: draft.recipe.name,
    totalTime: draft.recipe.totalTime,
    timeMinutes: draft.recipe.totalTime,
    calories: draft.recipe.calories,
    protein: draft.recipe.protein,
    carbs: draft.recipe.carbs,
    fats: draft.recipe.fats,
  };
}

export function useRecipeById(id: string) {
  const { getRecipeDraft } = useUserRecipeEdits();
  const recipeDraft = getRecipeDraft(id);
  const recipeQuery = useQuery({
    queryKey: queryKeys.recipe.detail(id),
    queryFn: () => recipeApi.getById(id),
    enabled: !!id,
  });

  const mergedData = useMemo(
    () => applyRecipeDraftToData(recipeQuery.data, recipeDraft),
    [recipeDraft, recipeQuery.data]
  );

  return {
    ...recipeQuery,
    data: mergedData,
  };
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
