import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import ingredientApi from '@/services/ingredientServices';
import recipeIngredientApi from '@/services/recipeIngredientServices';
import { IngredientApiItem } from '@/types/ingredient';
import {
  CreateRecipeIngredientRequest,
  RecipeIngredientApiItem,
  RecipeIngredientDisplayItem,
  UpdateRecipeIngredientRequest,
} from '@/types/recipe-ingredient';

type RecipeIngredientListResponse =
  | RecipeIngredientApiItem[]
  | {
      data?: RecipeIngredientApiItem[];
      items?: RecipeIngredientApiItem[];
    };

type IngredientListResponse =
  | IngredientApiItem[]
  | {
      data?: IngredientApiItem[];
      items?: IngredientApiItem[];
    };

type BuildRecipeIngredientPayloadParams = {
  quantity: string;
  unit: string;
  note: string;
};

const DEFAULT_INGREDIENT_EMOJI = '🥘';
const DEFAULT_INGREDIENT_BG = '#F3F4F6';

const emojiKeywordMap: Array<{ keyword: string; emoji: string }> = [
  { keyword: 'chicken', emoji: '🍗' },
  { keyword: 'ga', emoji: '🍗' },
  { keyword: 'beef', emoji: '🥩' },
  { keyword: 'bo', emoji: '🥩' },
  { keyword: 'pork', emoji: '🥩' },
  { keyword: 'heo', emoji: '🥩' },
  { keyword: 'fish', emoji: '🐟' },
  { keyword: 'ca', emoji: '🐟' },
  { keyword: 'shrimp', emoji: '🦐' },
  { keyword: 'tom', emoji: '🦐' },
  { keyword: 'egg', emoji: '🥚' },
  { keyword: 'trung', emoji: '🥚' },
  { keyword: 'rice', emoji: '🍚' },
  { keyword: 'gao', emoji: '🍚' },
  { keyword: 'noodle', emoji: '🍜' },
  { keyword: 'mi', emoji: '🍜' },
  { keyword: 'tomato', emoji: '🍅' },
  { keyword: 'ca chua', emoji: '🍅' },
  { keyword: 'onion', emoji: '🧅' },
  { keyword: 'hanh', emoji: '🧅' },
  { keyword: 'cheese', emoji: '🧀' },
  { keyword: 'pho mai', emoji: '🧀' },
  { keyword: 'milk', emoji: '🥛' },
  { keyword: 'sua', emoji: '🥛' },
  { keyword: 'mushroom', emoji: '🍄' },
  { keyword: 'nam', emoji: '🍄' },
  { keyword: 'tofu', emoji: '⬜' },
  { keyword: 'dau phu', emoji: '⬜' },
  { keyword: 'chili', emoji: '🌶️' },
  { keyword: 'ot', emoji: '🌶️' },
  { keyword: 'pepper', emoji: '🫑' },
  { keyword: 'potato', emoji: '🥔' },
  { keyword: 'khoai', emoji: '🥔' },
  { keyword: 'carrot', emoji: '🥕' },
  { keyword: 'ca rot', emoji: '🥕' },
];

function normalizeRecipeIngredientList(payload: RecipeIngredientListResponse): RecipeIngredientApiItem[] {
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

function normalizeIngredientList(payload: IngredientListResponse): IngredientApiItem[] {
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

function parseNumberish(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return undefined;
  }

  const normalized = trimmed.replace(',', '.');
  const fractionMatch = normalized.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);

  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseEmojiCandidate(value: unknown): string | undefined {
  const parsed = parseString(value);

  if (!parsed) {
    return undefined;
  }

  if (parsed.startsWith('http://') || parsed.startsWith('https://')) {
    return undefined;
  }

  return parsed;
}

function sanitizePositiveNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatNumberCompact(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, '');
}

function scaleQuantity(quantity: number | undefined, serves: number, baseServes: number): number | undefined {
  if (quantity === undefined) {
    return undefined;
  }

  const normalizedServes = sanitizePositiveNumber(serves, 1);
  const normalizedBaseServes = sanitizePositiveNumber(baseServes, 1);

  return (quantity * normalizedServes) / normalizedBaseServes;
}

function formatQuantityLabelFromNumber(quantity: number | undefined, unit: string): string {
  const unitText = unit.trim();

  if (quantity === undefined) {
    return unitText.length > 0 ? unitText : '--';
  }

  const quantityText = formatNumberCompact(quantity);
  const merged = `${quantityText} ${unitText}`.trim();

  return merged.length > 0 ? merged : '--';
}

function buildIngredientLookupMap(items: IngredientApiItem[]): Map<number, IngredientApiItem> {
  const map = new Map<number, IngredientApiItem>();

  items.forEach((item) => {
    const id = parseNumberish(item.id);

    if (id !== undefined) {
      map.set(id, item);
    }
  });

  return map;
}

function guessIngredientEmoji(name: string): string {
  const lowerName = name.toLowerCase();

  for (const item of emojiKeywordMap) {
    if (lowerName.includes(item.keyword)) {
      return item.emoji;
    }
  }

  return DEFAULT_INGREDIENT_EMOJI;
}

function resolveIngredientName(item: RecipeIngredientApiItem, ingredientFromCatalog?: IngredientApiItem): string {
  return (
    parseString(ingredientFromCatalog?.name) ??
    parseString(item.ingredient?.name) ??
    parseString(item.ingredientName) ??
    parseString(item.name) ??
    `Ingredient #${String(item.ingredientId)}`
  );
}

function resolveIngredientEmoji(
  item: RecipeIngredientApiItem,
  ingredientFromCatalog: IngredientApiItem | undefined,
  name: string
): string {
  return (
    parseEmojiCandidate(item.ingredient?.emoji) ??
    parseEmojiCandidate(item.emoji) ??
    parseEmojiCandidate(ingredientFromCatalog?.emoji) ??
    parseEmojiCandidate(ingredientFromCatalog?.icon) ??
    guessIngredientEmoji(name)
  );
}

type MapRecipeIngredientOptions = {
  ingredientById?: Map<number, IngredientApiItem>;
};

export function mapApiRecipeIngredientToDisplayItem(
  item: RecipeIngredientApiItem,
  options?: MapRecipeIngredientOptions
): RecipeIngredientDisplayItem | null {
  const recipeId = parseNumberish(item.recipeId);
  const ingredientId = parseNumberish(item.ingredientId ?? item.ingredient?.id);

  if (recipeId === undefined || ingredientId === undefined) {
    return null;
  }

  const quantity = parseNumberish(item.quantity);
  const unit = parseString(item.unit) ?? '';
  const note = parseString(item.note) ?? '';
  const ingredientFromCatalog = options?.ingredientById?.get(ingredientId);
  const name = resolveIngredientName(item, ingredientFromCatalog);
  const emoji = resolveIngredientEmoji(item, ingredientFromCatalog, name);

  return {
    recipeId,
    ingredientId,
    name,
    quantityLabel: formatQuantityLabelFromNumber(quantity, unit),
    quantityValue: quantity,
    unit,
    note,
    emoji,
    bg: DEFAULT_INGREDIENT_BG,
  };
}

function scaleDisplayItem(
  item: RecipeIngredientDisplayItem,
  serves: number,
  baseServes: number
): RecipeIngredientDisplayItem {
  const scaledQuantity = scaleQuantity(item.quantityValue, serves, baseServes);

  return {
    ...item,
    quantityValue: scaledQuantity,
    quantityLabel: formatQuantityLabelFromNumber(scaledQuantity, item.unit),
  };
}

export function buildRecipeIngredientPayload(
  recipeId: number,
  ingredientId: number,
  values: BuildRecipeIngredientPayloadParams
): UpdateRecipeIngredientRequest {
  const quantity = parseNumberish(values.quantity);
  const unit = values.unit.trim();
  const note = values.note.trim();

  return {
    recipeId,
    ingredientId,
    ...(quantity !== undefined ? { quantity } : {}),
    ...(unit.length > 0 ? { unit } : {}),
    ...(note.length > 0 ? { note } : {}),
  };
}

export function useRecipeIngredientList(
  recipeId?: string | number,
  serves: number = 1,
  baseServes: number = 1
) {
  const parsedRecipeId = Number(recipeId);
  const hasValidRecipeId = Number.isFinite(parsedRecipeId);
  const normalizedServes = sanitizePositiveNumber(serves, 1);
  const normalizedBaseServes = sanitizePositiveNumber(baseServes, 1);

  const recipeIngredientQuery = useQuery<RecipeIngredientDisplayItem[]>({
    queryKey: queryKeys.recipeIngredient.byRecipe(hasValidRecipeId ? parsedRecipeId : ''),
    queryFn: async () => {
      if (!hasValidRecipeId) {
        return [] as RecipeIngredientDisplayItem[];
      }

      const [recipeIngredientPayload, ingredientPayload] = await Promise.all([
        recipeIngredientApi.getAll({ recipeId: parsedRecipeId }),
        ingredientApi.getAll(),
      ]);

      const ingredientById = buildIngredientLookupMap(
        normalizeIngredientList(ingredientPayload as unknown as IngredientListResponse)
      );

      return normalizeRecipeIngredientList(
        recipeIngredientPayload as unknown as RecipeIngredientListResponse
      )
        .map((item) => mapApiRecipeIngredientToDisplayItem(item, { ingredientById }))
        .filter((item): item is RecipeIngredientDisplayItem => item !== null)
        .sort((a, b) => a.ingredientId - b.ingredientId);
    },
    enabled: hasValidRecipeId,
  });

  const scaledData = React.useMemo(() => {
    const data = recipeIngredientQuery.data ?? [];

    if (normalizedServes === normalizedBaseServes) {
      return data;
    }

    return data.map((item) => scaleDisplayItem(item, normalizedServes, normalizedBaseServes));
  }, [normalizedBaseServes, normalizedServes, recipeIngredientQuery.data]);

  return {
    ...recipeIngredientQuery,
    data: scaledData,
  };
}

export function useCreateRecipeIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeIngredientRequest) => recipeIngredientApi.create(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipeIngredient.byRecipe(variables.recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipe.detail(String(variables.recipeId)),
      });
    },
  });
}

type UpdateRecipeIngredientVariables = {
  recipeId: number;
  ingredientId: number;
  data: UpdateRecipeIngredientRequest;
};

export function useUpdateRecipeIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, ingredientId, data }: UpdateRecipeIngredientVariables) =>
      recipeIngredientApi.update(recipeId, ingredientId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipeIngredient.byRecipe(variables.recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipeIngredient.detail(variables.recipeId, variables.ingredientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipe.detail(String(variables.recipeId)),
      });
    },
  });
}

type DeleteRecipeIngredientVariables = {
  recipeId: number;
  ingredientId: number;
};

export function useDeleteRecipeIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, ingredientId }: DeleteRecipeIngredientVariables) =>
      recipeIngredientApi.remove(recipeId, ingredientId),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipeIngredient.byRecipe(variables.recipeId),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.recipeIngredient.detail(variables.recipeId, variables.ingredientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipe.detail(String(variables.recipeId)),
      });
    },
  });
}
