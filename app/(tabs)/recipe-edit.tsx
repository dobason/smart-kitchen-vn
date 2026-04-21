import * as React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon, CameraIcon, CheckIcon, PlusIcon, XIcon } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { CircleButton } from '@/components/in-app-ui/circle-button';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { useLocale } from '@/hooks/use-locale';
import { useRecipeIngredientList } from '@/hooks/use-recipe-ingredients';
import { useStepList } from '@/hooks/use-step';
import { StepItem } from '@/types/step';
import { useRecipeDetail, useRecipeForm } from '@/hooks/use-recipe';
import ingredientApi from '@/services/ingredientServices';
import { IngredientApiItem } from '@/types/ingredient';
import { useUserRecipeEdits } from '@/hooks/use-user-recipe-edits';
import { RecipeIngredientDisplayItem } from '@/types/recipe-ingredient';
import type { RecipeDetailSource } from '@/types/recipe';

type RecipeEditParams = {
  recipeId?: string | string[];
  from?: string | string[];
  returnQuery?: string | string[];
};

/* ─── Sub-components ─────────────────────────────────────────────── */

function SectionHeader({
  title,
  actionLabel,
  onAction,
  required,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  required?: boolean;
}) {
  return (
    <View className="mb-2.5 mt-[18px] flex-row items-center justify-between">
      <View className="flex-row items-center">
        <VietnamText className="text-sm font-extrabold tracking-[0.5px] text-gray-900">
          {title}
        </VietnamText>
        {required && <VietnamText className="ml-1 text-sm font-bold text-red-500">*</VietnamText>}
      </View>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <VietnamText className="text-[13px] font-bold">{actionLabel}</VietnamText>
        </TouchableOpacity>
      )}
    </View>
  );
}

function InfoField({
  label,
  value,
  unit,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  unit?: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}) {
  return (
    <View className="flex-1">
      <VietnamText className="mb-1 text-[11px] font-medium text-gray-500">{label}</VietnamText>
      <View className="flex-row items-center gap-1 rounded-[10px] bg-gray-100 px-2.5 py-2">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          className="flex-1 p-0 text-sm text-gray-800"
          style={{ fontFamily: 'BeVietnamPro_400Regular' }}
        />
        {unit ? <VietnamText className="text-[11px] text-gray-400">{unit}</VietnamText> : null}
      </View>
    </View>
  );
}

type EditableRecipeIngredientRow = {
  rowId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: string;
  unit: string;
  note: string;
  isDraft: boolean;
};

type IngredientCatalogResponse =
  | IngredientApiItem[]
  | {
      data?: IngredientApiItem[];
      items?: IngredientApiItem[];
    };

function normalizeIngredientCatalog(payload: IngredientCatalogResponse): IngredientApiItem[] {
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

function normalizeIngredientName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function parseNumberish(value: string): number | undefined {
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

function formatNumberCompact(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, '');
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

function resolveIngredientIdFromRow(
  row: EditableRecipeIngredientRow,
  ingredientIdByName: Map<string, number>
): number | undefined {
  const directId = Number(row.ingredientId);

  if (Number.isFinite(directId)) {
    return directId;
  }

  const normalizedName = normalizeIngredientName(row.ingredientName);

  if (!normalizedName) {
    return undefined;
  }

  return ingredientIdByName.get(normalizedName);
}

function buildLocalRecipeIngredients(
  recipeId: number,
  rows: EditableRecipeIngredientRow[],
  ingredientIdByName: Map<string, number>,
  ingredientNameById: Map<number, string>
): RecipeIngredientDisplayItem[] | null {
  const mappedItems: RecipeIngredientDisplayItem[] = [];

  for (const row of rows) {
    const isCompletelyEmptyRow =
      row.ingredientId.trim().length === 0 &&
      row.ingredientName.trim().length === 0 &&
      row.quantity.trim().length === 0 &&
      row.unit.trim().length === 0 &&
      row.note.trim().length === 0;

    if (isCompletelyEmptyRow) {
      continue;
    }

    const ingredientId = resolveIngredientIdFromRow(row, ingredientIdByName);

    if (ingredientId === undefined) {
      return null;
    }

    const quantityValue = parseNumberish(row.quantity);
    const unit = row.unit.trim();
    const note = row.note.trim();
    const fallbackName = ingredientNameById.get(ingredientId) ?? `Ingredient #${ingredientId}`;
    const ingredientName = row.ingredientName.trim() || fallbackName;

    mappedItems.push({
      recipeId,
      ingredientId,
      name: ingredientName,
      quantityValue,
      quantityLabel: formatQuantityLabelFromNumber(quantityValue, unit),
      unit,
      note,
      emoji: '🥘',
      bg: '#F3F4F6',
    });
  }

  return mappedItems;
}

function normalizeStepsForDraft(recipeId: number, currentSteps: StepItem[]): StepItem[] {
  return currentSteps.map((step, index) => ({
    ...step,
    id: step.id ?? `local-step-${recipeId}-${Date.now()}-${index}`,
    number: index + 1,
    recipeId,
    text: step.text ?? '',
    tip: step.tip ?? '',
  }));
}

function IngredientItemRow({
  item,
  onSave,
  onRemove,
  onChangeIngredientName,
  onChangeQty,
  onChangeUnit,
  onChangeNote,
  saveDisabled,
}: {
  item: EditableRecipeIngredientRow;
  onSave: () => void;
  onRemove: () => void;
  onChangeIngredientName: (v: string) => void;
  onChangeQty: (v: string) => void;
  onChangeUnit: (v: string) => void;
  onChangeNote: (v: string) => void;
  saveDisabled?: boolean;
}) {
  return (
    <View className="mb-2 gap-1.5 rounded-xl border border-gray-200 px-2.5 py-2.5">
      <View className="flex-row items-center justify-between">
        <VietnamText className="text-[12px] font-medium text-gray-500">
          {item.ingredientName || 'Ingredient'}
        </VietnamText>
        {item.isDraft ? (
          <VietnamText className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            NEW
          </VietnamText>
        ) : null}
      </View>

      <TextInput
        value={item.ingredientName}
        onChangeText={onChangeIngredientName}
        editable={item.isDraft}
        placeholder="Ingredient"
        className={
          item.isDraft
            ? 'rounded-lg bg-gray-100 px-2.5 py-2 text-sm text-gray-800'
            : 'rounded-lg bg-gray-50 px-2.5 py-2 text-sm text-gray-500'
        }
        style={{ fontFamily: 'BeVietnamPro_400Regular' }}
      />

      <View className="flex-row items-center gap-1.5">
        <TextInput
          value={item.quantity}
          onChangeText={onChangeQty}
          placeholder="Qty"
          className="w-[64px] rounded-lg bg-gray-100 px-2 py-2 text-center text-sm text-gray-800"
          style={{ fontFamily: 'BeVietnamPro_400Regular' }}
          keyboardType="decimal-pad"
        />
        <TextInput
          value={item.unit}
          onChangeText={onChangeUnit}
          placeholder="Unit"
          className="w-[68px] rounded-lg bg-gray-100 px-2 py-2 text-center text-sm text-gray-800"
          style={{ fontFamily: 'BeVietnamPro_400Regular' }}
        />
        <TextInput
          value={item.note}
          onChangeText={onChangeNote}
          placeholder="Note"
          className="flex-1 rounded-lg bg-gray-100 px-2.5 py-2 text-sm text-gray-800"
          style={{ fontFamily: 'BeVietnamPro_400Regular' }}
        />
      </View>

      <View className="flex-row justify-end gap-2">
        <TouchableOpacity
          onPress={onSave}
          disabled={saveDisabled}
          className="bg-brand h-8 w-8 items-center justify-center rounded-full">
          {saveDisabled ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Icon as={CheckIcon} size={16} color="white" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onRemove}
          className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <Icon as={XIcon} size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepRow({
  step,
  index,
  onRemove,
  onChangeText,
  onChangeTip,
  onBlurText,
  onBlurTip,
}: {
  step: StepItem;
  index: number;
  onRemove: () => void;
  onChangeText: (v: string) => void;
  onChangeTip: (v: string) => void;
  onBlurText?: () => void;
  onBlurTip?: () => void;
}) {
  return (
    <View className="mb-3 flex-row">
      {/* Step Number Badge */}
      <View className="bg-brand mr-2.5 mt-2.5 h-7 w-7 items-center justify-center rounded-full">
        <VietnamText className="text-[13px] font-bold text-white">{index + 1}</VietnamText>
      </View>

      {/* Content */}
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-start gap-1.5 rounded-xl bg-gray-100 px-3 py-2.5">
          <TextInput
            value={step.text}
            onChangeText={onChangeText}
            onEndEditing={onBlurText}
            multiline
            className="min-h-[44px] flex-1 text-sm text-gray-800"
            style={{ fontFamily: 'BeVietnamPro_400Regular' }}
            placeholder="Nhập bước nấu..."
          />
          <TouchableOpacity onPress={onRemove} className="mt-0.5 p-0.5">
            <Icon as={XIcon} size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Tip card */}
        <View className="flex-row gap-1.5 rounded-xl bg-[#FEFDE8] px-3 py-2.5">
          <VietnamText className="text-base">📌</VietnamText>
          <TextInput
            value={step.tip ?? ''}
            onChangeText={onChangeTip}
            onEndEditing={onBlurTip}
            multiline
            className="min-h-[36px] flex-1 text-[13px] text-gray-600"
            style={{ fontFamily: 'BeVietnamPro_400Regular' }}
            placeholder="Mẹo nhỏ..."
          />
        </View>
      </View>
    </View>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────── */

export default function RecipeEditScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const { upsertRecipeDraft } = useUserRecipeEdits();
  const { recipeId, from, returnQuery } = useLocalSearchParams<RecipeEditParams>();
  const recipeIdParam = Array.isArray(recipeId) ? recipeId[0] : recipeId;
  const fromParam = Array.isArray(from) ? from[0] : from;
  const returnQueryParam = Array.isArray(returnQuery) ? returnQuery[0] : returnQuery;
  const source = React.useMemo<RecipeDetailSource>(() => {
    if (fromParam === 'search-results' || fromParam === 'recipe-tab' || fromParam === 'unknown') {
      return fromParam;
    }

    return 'unknown';
  }, [fromParam]);
  const recipeIdNumber = React.useMemo(() => {
    const value = Number(recipeIdParam);
    return Number.isFinite(value) ? value : undefined;
  }, [recipeIdParam]);
  const MAX_NAME = 50;

  const [cookbook] = React.useState('Dinner');
  const [steps, setSteps] = React.useState<StepItem[]>([]);
  const [ingredientRows, setIngredientRows] = React.useState<EditableRecipeIngredientRow[]>([]);
  const [isSavingLocal, setIsSavingLocal] = React.useState(false);
  const initializedStepsRecipeKeyRef = React.useRef<string | null>(null);
  const initializedIngredientsRecipeKeyRef = React.useRef<string | null>(null);

  const { data: ingredientCatalog = [] } = useQuery<IngredientApiItem[]>({
    queryKey: ['ingredients', 'all'],
    queryFn: async () => {
      const payload = await ingredientApi.getAll();
      return normalizeIngredientCatalog(payload as IngredientCatalogResponse);
    },
  });

  const ingredientIdByName = React.useMemo(() => {
    const map = new Map<string, number>();

    ingredientCatalog.forEach((item) => {
      const ingredientId = Number(item.id);
      const ingredientName = typeof item.name === 'string' ? item.name.trim() : '';

      if (!Number.isFinite(ingredientId) || ingredientName.length === 0) {
        return;
      }

      const key = normalizeIngredientName(ingredientName);

      if (!map.has(key)) {
        map.set(key, ingredientId);
      }
    });

    return map;
  }, [ingredientCatalog]);

  const ingredientNameById = React.useMemo(() => {
    const map = new Map<number, string>();

    ingredientCatalog.forEach((item) => {
      const ingredientId = Number(item.id);
      const ingredientName = typeof item.name === 'string' ? item.name.trim() : '';

      if (!Number.isFinite(ingredientId) || ingredientName.length === 0) {
        return;
      }

      map.set(ingredientId, ingredientName);
    });

    return map;
  }, [ingredientCatalog]);

  const { data: recipeData, isLoading } = useRecipeDetail(recipeIdParam as string);
  const { data: apiRecipeIngredients, isFetching: isIngredientLoading } =
    useRecipeIngredientList(recipeIdNumber);
  const { data: apiSteps, isFetching: isStepLoading } = useStepList(recipeIdNumber);

  const {
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
  } = useRecipeForm(recipeData);

  //Xử lý lưu
  const handleSave = () => {
    if (!recipeId) return;
    const payload = buildPayload();

    updateMutation.mutate(payload, {
      onSuccess: () => {
        Alert.alert(t('other.successSave'), t('other.successUpdate'), [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
    ]);
  };

  const handlePersistIngredient = (index: number) => {
    const row = ingredientRows[index];

    if (!row) {
      return;
    }

    const ingredientId = resolveIngredientIdFromRow(row, ingredientIdByName);

    if (ingredientId === undefined) {
      Alert.alert('That bai', 'Khong tim thay ingredient phu hop. Vui long kiem tra ten nguyen lieu.');
      return;
    }

    const fallbackName = ingredientNameById.get(ingredientId) ?? `Ingredient #${ingredientId}`;
    const ingredientName = row.ingredientName.trim() || fallbackName;

    setIngredientRows((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ingredientId: String(ingredientId),
              ingredientName,
              isDraft: false,
            }
          : item
      )
    );
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientRows((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleUpdateStepField = (idx: number, field: 'text' | 'tip', value: string) => {
    setSteps((prev) => prev.map((item, index) => (index === idx ? { ...item, [field]: value } : item)));
  };

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: `local-step-${Date.now()}-${prev.length + 1}`,
        number: prev.length + 1,
        text: '',
        tip: '',
      },
    ]);
  };

  const handleRemoveStep = (idx: number) => {
    setSteps((prev) => prev.filter((_, index) => index !== idx));
  };

  const goToRecipeDetail = React.useCallback(() => {
    if (recipeIdParam) {
      router.replace({
        pathname: '/(tabs)/recipe-detail',
        params: {
          recipeId: recipeIdParam,
          from: source,
          ...(returnQueryParam ? { returnQuery: returnQueryParam } : {}),
        },
      });
      return;
    }

    router.replace('/(tabs)/recipe-detail');
  }, [recipeIdParam, returnQueryParam, router, source]);

  const handleSave = () => {
    if (!recipeIdParam) {
      return;
    }

    if (!recipeIdNumber) {
      Alert.alert('That bai', 'Khong tim thay recipeId hop le.');
      return;
    }

    setIsSavingLocal(true);

    const normalizedIngredients = buildLocalRecipeIngredients(
      recipeIdNumber,
      ingredientRows,
      ingredientIdByName,
      ingredientNameById
    );

    if (!normalizedIngredients) {
      setIsSavingLocal(false);
      Alert.alert('That bai', 'Co nguyen lieu chua hop le. Vui long kiem tra lai ten nguyen lieu.');
      return;
    }

    const normalizedSteps = normalizeStepsForDraft(recipeIdNumber, steps);
    const recipePayload = buildPayload();

    upsertRecipeDraft({
      recipeId: String(recipeIdParam),
      recipe: recipePayload,
      ingredients: normalizedIngredients,
      steps: normalizedSteps,
    });

    setIngredientRows(
      normalizedIngredients.map((item, index) => ({
        rowId: `${item.recipeId}-${item.ingredientId}-${index}`,
        ingredientId: String(item.ingredientId),
        ingredientName: item.name,
        quantity: item.quantityValue !== undefined ? String(item.quantityValue) : '',
        unit: item.unit,
        note: item.note,
        isDraft: false,
      }))
    );
    setSteps(normalizedSteps);
    setIsSavingLocal(false);

    Alert.alert(t('other.successSave'), 'Da cap nhat cong thuc cho tai khoan cua ban.', [
      { text: 'OK', onPress: goToRecipeDetail },
    ]);
  };

  /* ─── Render UI ─── */
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ── Top Bar ── */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <CircleButton
          variant="ghost"
          className="h-10 w-10 items-center justify-center rounded-full p-1"
          onPress={goToRecipeDetail}>
          <Icon as={ArrowLeftIcon} size={22} color="#1f2937" />
        </CircleButton>

        <VietnamText className="text-base font-bold tracking-[1px] text-gray-900">
          {t('other.edit')}
        </VietnamText>

        {/* Nút Save có hiệu ứng loading */}
        <RoundedButton
          onPress={handleSave}
          className="rounded-full px-5 py-2"
          disabled={isSavingLocal}>
          {isSavingLocal ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <VietnamText className="text-sm font-semibold text-white">
              {t('other.save')}
            </VietnamText>
          )}
        </RoundedButton>
      </View>

      {/* Hiển thị Loading che màn hình nếu đang lấy dữ liệu */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="relative h-[220px] flex-[220px]">
            <Image
              source={{
                uri: 'https://images.squarespace-cdn.com/content/v1/66628bdc6b0b0d52d914a921/1752754499896-E9EAAEK78ESN8KAJV33G/unsplash-image-_33r6H_hiz4.jpg?format=1500w',
              }}
              className="h-full w-full"
              resizeMode="cover"
            />
            {/* Change Photo overlay */}
            <TouchableOpacity className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-2 bg-black/45 py-2.5">
              <Icon as={CameraIcon} size={18} color="white" />
              <VietnamText className="text-[15px] font-semibold text-white">
                {t('other.changePhoto')}
              </VietnamText>
            </TouchableOpacity>
          </View>

          <View className="px-4 pt-[18px]">
            {/* ── NAME ── */}
            <SectionHeader title={t('recipe.name')} required />
            <View className="mb-1 flex-row items-center rounded-xl bg-gray-100 px-3.5 py-2.5">
              <TextInput
                value={name}
                onChangeText={(v) => v.length <= MAX_NAME && setName(v)}
                className="flex-1 text-[15px] text-gray-800"
                style={{ fontFamily: 'BeVietnamPro_400Regular' }}
                maxLength={MAX_NAME}
              />
              <VietnamText className="text-xs font-semibold">
                {name.length}/{MAX_NAME}
              </VietnamText>
            </View>

            {/* ── INFORMATION ── */}
            <SectionHeader title={t('other.info')} required />
            <View className="flex-row gap-2">
              <InfoField
                label={t('other.time')}
                value={time}
                unit="min"
                onChangeText={setTime}
                keyboardType="numeric"
              />
            </View>
            <View className="mt-2 flex-row gap-2">
              <InfoField
                label="Calories"
                value={calories}
                unit="kal"
                onChangeText={setCalories}
                keyboardType="numeric"
              />
              <InfoField
                label="Protein"
                value={protein}
                unit="g"
                onChangeText={setProtein}
                keyboardType="numeric"
              />
              <InfoField
                label="Carbs"
                value={carbs}
                unit="g"
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
              <InfoField
                label="Fats"
                value={fats}
                unit="g"
                onChangeText={setFats}
                keyboardType="numeric"
              />
            </View>

            {/* ── INGREDIENTS ── */}
            <SectionHeader title={t('ingredients.INGREDIENTS')} />

            {isIngredientLoading && ingredientRows.length === 0 ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#00B075" />
              </View>
            ) : null}

            {ingredientRows.map((item, index) => (
              <IngredientItemRow
                key={item.rowId}
                item={item}
                onSave={() => handlePersistIngredient(index)}
                onRemove={() => handleRemoveIngredient(index)}
                onChangeIngredientName={(v) =>
                  handleIngredientFieldChange(index, 'ingredientName', v)
                }
                onChangeQty={(v) => handleIngredientFieldChange(index, 'quantity', v)}
                onChangeUnit={(v) => handleIngredientFieldChange(index, 'unit', v)}
                onChangeNote={(v) => handleIngredientFieldChange(index, 'note', v)}
              />
            ))}

            <RoundedButton
              onPress={handleAddIngredientRow}
              variant="ghost"
              className="mb-2 border-2 border-black text-black"
              size="lg">
              <Icon as={PlusIcon} size={16} />
              <VietnamText className="text-black">Add ingredient</VietnamText>
            </RoundedButton>

            {/* ── STEPS ── */}
            <SectionHeader
              title={t('steps.STEPS')}
              actionLabel={t('other.reOrder')}
              onAction={() => {}}
            />

            {steps?.map((step, idx) => (
              <StepRow
                key={step.id ?? String(idx)}
                step={step}
                index={idx}
                onRemove={() => handleRemoveStep(idx)}
                onChangeText={(v) => handleUpdateStepField(idx, 'text', v)}
                onChangeTip={(v) => handleUpdateStepField(idx, 'tip', v)}
              />
            ))}

            {/* Add step button */}
            <RoundedButton
              onPress={handleAddStep}
              variant="ghost"
              className="border-2 border-black text-black"
              disabled={isStepLoading}
              size={'lg'}>
              {isStepLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <>
                  <Icon as={PlusIcon} size={16} />
                  <VietnamText className="text-black">{t('steps.addStep')}</VietnamText>
                </>
              )}
            </RoundedButton>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
