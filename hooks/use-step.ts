import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import stepApi from '@/services/stepServices';
import { CreateStepRequest, StepApiItem, StepItem, UpdateStepRequest } from '@/types/step';
import * as React from 'react';
import { useUserRecipeEdits } from '@/hooks/use-user-recipe-edits';

type StepListResponse =
  | StepApiItem[]
  | {
      data?: StepApiItem[];
      items?: StepApiItem[];
    };

function normalizeStepList(payload: StepListResponse): StepApiItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

export function mapApiStepToStepItem(step: StepApiItem, fallbackStepNumber: number): StepItem {
  return {
    id: step.id !== undefined ? String(step.id) : undefined,
    number: step.stepNumber ?? fallbackStepNumber,
    text: step.instruction ?? '',
    tip: step.tip ?? '',
    time: step.time,
    recipeId: step.recipeId,
  };
}

export function buildStepPayload(
  recipeId: number,
  step: Pick<StepItem, 'text' | 'tip' | 'time'>,
  stepNumber: number
): UpdateStepRequest {
  return {
    recipeId,
    stepNumber,
    instruction: step.text,
    tip: step.tip ?? '',
    time: step.time,
  };
}

export function useStepList(recipeId?: string | number) {
  const parsedRecipeId = Number(recipeId);
  const hasValidRecipeId = Number.isFinite(parsedRecipeId);
  const normalizedRecipeId = recipeId !== undefined ? String(recipeId) : '';
  const { getRecipeDraft } = useUserRecipeEdits();
  const recipeDraft = getRecipeDraft(normalizedRecipeId);

  const stepQuery = useQuery({
    queryKey: queryKeys.step.byRecipe(hasValidRecipeId ? parsedRecipeId : ''),
    queryFn: async () => {
      if (!hasValidRecipeId) {
        return [] as StepItem[];
      }

      const payload = (await stepApi.getAllInRecipe(parsedRecipeId)) as unknown as StepListResponse;
      const steps = normalizeStepList(payload)
        .map((step, index) => mapApiStepToStepItem(step, index + 1))
        .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

      return steps;
    },
    enabled: hasValidRecipeId,
  });

  const mergedData = React.useMemo(() => {
    if (recipeDraft?.steps) {
      return recipeDraft.steps.map((step, index) => ({
        ...step,
        number: step.number ?? index + 1,
      }));
    }

    return stepQuery.data ?? [];
  }, [recipeDraft, stepQuery.data]);

  return {
    ...stepQuery,
    data: mergedData,
  };
}

export function useCreateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStepRequest) => stepApi.create(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.step.byRecipe(variables.recipeId) });
    },
  });
}

type UpdateStepVariables = {
  id: string | number;
  data: UpdateStepRequest;
};

export function useUpdateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateStepVariables) => stepApi.update(id, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.step.byRecipe(variables.data.recipeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.step.detail(variables.id) });
    },
  });
}

type DeleteStepVariables = {
  id: string | number;
  recipeId: string | number;
};

export function useDeleteStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteStepVariables) => stepApi.remove(id),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.step.byRecipe(variables.recipeId) });
      queryClient.removeQueries({ queryKey: queryKeys.step.detail(variables.id) });
    },
  });
}
