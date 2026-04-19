import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import recipeApi from '@/services/recipeServices';
import { queryKeys } from '@/lib/queryKeys';
import { IngredientGroup, EditableIngredientItem } from '@/types/ingredient';
import { StepItem } from '@/types/step';

export function useRecipeForm(recipeData: any) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [groups, setGroups] = useState<IngredientGroup[]>([]);
  const [steps, setSteps] = useState<StepItem[]>([]);

  useEffect(() => {
    if (recipeData) {
      setName(recipeData.name || '');
      setTime(recipeData.totalTime?.toString() || '');
      setCalories(recipeData.calories?.toString() || '');
      setProtein(recipeData.protein?.toString() || '');
      setCarbs(recipeData.carbs?.toString() || '');
      setFats(recipeData.fats?.toString() || '');
      setGroups(recipeData.ingredientGroups || []);
      setSteps(recipeData.steps || []);
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

  const removeStep = (idx: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, field: keyof StepItem, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i !== idx ? s : { ...s, [field]: value })));
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { id: Date.now().toString(), text: '', tip: '' }]);
  };

  const buildPayload = () => ({
    name,
    totalTime: Number(time) || 0,
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fats: Number(fats) || 0,
    ingredientGroups: groups,
    steps,
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
    steps,
    updateIngredient,
    removeIngredient,
    addIngredient,
    updateStep,
    removeStep,
    addStep,
    buildPayload,
  };
}

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
