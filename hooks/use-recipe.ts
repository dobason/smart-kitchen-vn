import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';
import { IngredientGroup, EditableIngredientItem } from '@/types/ingredient';
import { StepItem } from '@/types/step';
import { UpdateRecipeRequest } from '@/types/recipe';

export function useRecipeForm(recipeData: any) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [groups, setGroups] = useState<IngredientGroup[]>([]);

  useEffect(() => {
    if (recipeData) {
      setName(recipeData.name || '');
      setTime((recipeData.totalTime ?? recipeData.timeMinutes)?.toString() || '');
      setCalories(recipeData.calories?.toString() || '');
      setProtein(recipeData.protein?.toString() || '');
      setCarbs(recipeData.carbs?.toString() || '');
      setFats(recipeData.fats?.toString() || '');
      setGroups(recipeData.ingredientGroups || []);
    }
  }, [recipeData]);

  const updateIngredient = (
    gIdx: number,
    iIdx: number,
    field: Exclude<keyof EditableIngredientItem, 'id'>,
    value: string
  ) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi !== gIdx
          ? g
          : {
              ...g,
              items:
                g.items?.map((item, ii) => (ii !== iIdx ? item : { ...item, [field]: value })) ||
                [],
            }
      )
    );
  };

  const removeIngredient = (gIdx: number, iIdx: number) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi !== gIdx ? g : { ...g, items: g.items?.filter((_, ii) => ii !== iIdx) || [] }
      )
    );
  };

  const addIngredient = (gIdx: number) => {
    const newItem: EditableIngredientItem = {
      id: Date.now().toString(),
      qty: '',
      unit: '',
      name: '',
    };
    setGroups((prev) =>
      prev.map((g, gi) => (gi !== gIdx ? g : { ...g, items: [...(g.items || []), newItem] }))
    );
  };

  const buildPayload = () => ({
    name,
    totalTime: Number(time) || 0,
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fats: Number(fats) || 0,
    ingredientGroups: groups,
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
    groups,
    updateIngredient,
    removeIngredient,
    addIngredient,
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
