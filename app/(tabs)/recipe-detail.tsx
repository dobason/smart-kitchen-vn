import { CircleButton } from '@/components/in-app-ui/circle-button';
import { IngredientRow } from '@/components/in-app-ui/ingredient-row';
import { NutritionStat } from '@/components/in-app-ui/nutrition-stat';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { StepCard } from '@/components/in-app-ui/step-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { SEARCH_RECIPES } from '@/constants/recipeData';
import { useLocale } from '@/hooks/use-locale';
import { useAIRecipeSession } from '@/hooks/use-ai-recipe-session';
import { useRecipeById } from '@/hooks/use-recipe';
import { useRecipeIngredientList } from '@/hooks/use-recipe-ingredients';
import { useStepList } from '@/hooks/use-step';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { useUserRecipeEdits } from '@/hooks/use-user-recipe-edits';
import { generateRecipeFromInstruction } from '@/services/aiRecipeServices';
import type { AIRecipeSession } from '@/context/ai-recipe-session-context';
import { getLatestAIRecipeSession } from '@/lib/ai-recipe-session';
import type { RecipeDetail, RecipeDetailSource, SearchRecipeItem } from '@/types/recipe';
import type { CookingIngredientItem } from '@/types/ingredient';
import type { StepItem } from '@/types/step';
import type { RecipeIngredientDisplayItem } from '@/types/recipe-ingredient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  Bookmark,
  FolderIcon,
  MaximizeIcon,
  MinusIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RecipeDetailParams = {
  recipeId?: string | string[];
  recipeName?: string | string[];
  recipeDescription?: string | string[];
  recipeCalories?: string | string[];
  recipeTimeMinutes?: string | string[];
  recipeImageUrl?: string | string[];
  from?: string | string[];
  returnQuery?: string | string[];
  aiRecipe?: string | string[];
};

function singleParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function toPositiveNumber(value: unknown): number | undefined {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function normalizeAiStepText(step: string): string {
  return step.replace(/^\s*\d+[\.)\-:]?\s*/, '').replace(/\*\*/g, '').trim();
}

function parseAiTimeMinutes(value?: string | null): number {
  const match = String(value ?? '').match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function buildAiDraftIngredients(recipeId: string, items: string[]): RecipeIngredientDisplayItem[] {
  const numericRecipeId = Number(recipeId);

  return items.map((item, index) => ({
    recipeId: Number.isFinite(numericRecipeId) ? numericRecipeId : index + 1,
    ingredientId: index + 1,
    name: item,
    quantityLabel: '',
    quantityValue: undefined,
    unit: '',
    note: '',
    emoji: '🥘',
    bg: '#F3F4F6',
  }));
}

function buildAiDraftSteps(recipeId: string, items: string[]): StepItem[] {
  const numericRecipeId = Number(recipeId);

  return items.map((item, index) => ({
    id: `ai-step-${index + 1}`,
    number: index + 1,
    text: normalizeAiStepText(item),
    tip: '',
    recipeId: Number.isFinite(numericRecipeId) ? numericRecipeId : undefined,
  }));
}

type AiEditPreview = {
  name: string;
  description: string;
  timeMinutes: number;
  ingredients: CookingIngredientItem[];
  steps: StepItem[];
};

function parseAiRecipeSession(value?: string | string[]): AIRecipeSession | null {
  const rawValue = singleParam(value);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(rawValue)) as AIRecipeSession;
  } catch {
    return null;
  }
}

export default function RecipeDetailScreen() {
  const [serves, setServes] = React.useState(4);
  const [imageVisible, setImageVisible] = React.useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const [noteModalVisible, setNoteModalVisible] = React.useState(false);
  const [noteText, setNoteText] = React.useState('');
  const [aiEditModalVisible, setAiEditModalVisible] = React.useState(false);
  const [showAiSuccessModal, setShowAiSuccessModal] = React.useState(false);
  const [aiEditType, setAiEditType] = React.useState<'swap' | 'optimize'>('swap');
  const [aiEditPrompt, setAiEditPrompt] = React.useState('');
  const [aiEditLoading, setAiEditLoading] = React.useState(false);
  const [aiEditPreview, setAiEditPreview] = React.useState<AiEditPreview | null>(null);

  const router = useRouter();
  const { t, locale } = useLocale();
  const params = useLocalSearchParams<RecipeDetailParams>();
  const { session: storedAIRecipeSession, clearSession: clearAIRecipeSession } = useAIRecipeSession();
  const { upsertRecipeDraft } = useUserRecipeEdits();
  const moduleAIRecipeSession = getLatestAIRecipeSession();

  const {
    isSaved,
    saveRecipe,
    removeSavedRecipe,
    getSavedRecipeById,
    getRecipeCookbooks,
  } = useSavedRecipes();

  const recipeId = singleParam(params.recipeId);
  const recipeName = singleParam(params.recipeName);
  const recipeDescription = singleParam(params.recipeDescription);
  const recipeImageUrl = singleParam(params.recipeImageUrl);
  const recipeCalories = singleParam(params.recipeCalories);
  const recipeTimeMinutes = singleParam(params.recipeTimeMinutes);
  const fromParam = singleParam(params.from);
  const returnQuery = singleParam(params.returnQuery);
  const aiRecipeSessionFromParams = React.useMemo(
    () => parseAiRecipeSession(params.aiRecipe),
    [params.aiRecipe]
  );
  const aiRecipeSession = aiRecipeSessionFromParams ?? moduleAIRecipeSession ?? storedAIRecipeSession;
  const isAiImportRoute = fromParam === 'ai-import';
  const isAiImport = isAiImportRoute && aiRecipeSession !== null;
  const isAiImportReady = !isAiImportRoute || aiRecipeSession !== null;

  const source = React.useMemo<RecipeDetailSource>(() => {
    if (fromParam === 'search-results' || fromParam === 'recipe-tab' || fromParam === 'unknown') {
      return fromParam;
    }

    return 'unknown';
  }, [fromParam]);
  const hasSearchReturnContext = React.useMemo(
    () => source === 'search-results' || (returnQuery?.trim().length ?? 0) > 0,
    [returnQuery, source]
  );

  const { data: apiRecipeData } = useRecipeById(isAiImportRoute ? '' : recipeId ?? '');
  const baseServes = React.useMemo(() => {
    if (isAiImportRoute) {
      return 4;
    }

    const apiRecipe =
      (apiRecipeData as
        | {
            serves?: number | string | null;
            serving?: number | string | null;
            servings?: number | string | null;
          }
        | undefined) ?? undefined;

    return (
      toPositiveNumber(apiRecipe?.serves) ??
      toPositiveNumber(apiRecipe?.serving) ??
      toPositiveNumber(apiRecipe?.servings) ??
      4
    );
  }, [apiRecipeData, isAiImportRoute]);

  const recipeFromApi = React.useMemo<SearchRecipeItem | undefined>(() => {
    if (isAiImportRoute) {
      return undefined;
    }

    if (!apiRecipeData) {
      return undefined;
    }

    const apiRecipe = apiRecipeData as RecipeDetail & {
      totalTime?: number;
      description?: string | null;
      tags?: string[] | null;
      cookware?: string[] | null;
      imageRecipe?: string | null;
    };

    const calories = Number(apiRecipe.calories);
    const timeMinutes = Number(apiRecipe.timeMinutes ?? apiRecipe.totalTime);
    const imageUrl =
      typeof apiRecipe.imageUrl === 'string' && apiRecipe.imageUrl.trim().length > 0
        ? apiRecipe.imageUrl
        : typeof apiRecipe.imageRecipe === 'string' && apiRecipe.imageRecipe.trim().length > 0
          ? apiRecipe.imageRecipe
          : recipeImageUrl || SEARCH_RECIPES[0].imageUrl;

    return {
      id: apiRecipe.id,
      name: apiRecipe.name,
      description: apiRecipe.description || recipeDescription || '',
      calories: Number.isFinite(calories) ? calories : 0,
      timeMinutes: Number.isFinite(timeMinutes) ? timeMinutes : 0,
      imageUrl,
      tags: Array.isArray(apiRecipe.tags) ? apiRecipe.tags.map((tag) => String(tag)) : [],
      cookware: Array.isArray(apiRecipe.cookware)
        ? apiRecipe.cookware.map((item) => String(item))
        : [],
    };
  }, [apiRecipeData, isAiImportRoute, recipeDescription, recipeImageUrl]);

  const recipeFromAiSession = React.useMemo<SearchRecipeItem | undefined>(() => {
    if (!isAiImport || !aiRecipeSession) {
      return undefined;
    }

    const timeMatch = String(aiRecipeSession.recipe.time ?? '').match(/\d+/);
    const timeMinutes = timeMatch ? Number(timeMatch[0]) : 0;
    const recipeNameFromSession = aiRecipeSession.recipe.dish?.trim() || 'AI Recipe';

    return {
      id: `ai-${recipeNameFromSession.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'recipe'}`,
      name: recipeNameFromSession,
      description: `Generated from ${aiRecipeSession.sourceLabel}`,
      calories: 0,
      timeMinutes: Number.isFinite(timeMinutes) ? timeMinutes : 0,
      imageUrl: aiRecipeSession.imageUri,
      tags: [],
      cookware: [],
    };
  }, [aiRecipeSession, isAiImport]);

  const recipeFromParams = React.useMemo<SearchRecipeItem | undefined>(() => {
    if (!recipeId || !recipeName || !recipeDescription || !recipeImageUrl) {
      return undefined;
    }

    const calories = Number(recipeCalories);
    const timeMinutes = Number(recipeTimeMinutes);

    return {
      id: recipeId,
      name: recipeName,
      description: recipeDescription,
      calories: Number.isFinite(calories) ? calories : 0,
      timeMinutes: Number.isFinite(timeMinutes) ? timeMinutes : 0,
      imageUrl: recipeImageUrl,
      tags: [],
      cookware: [],
    };
  }, [recipeCalories, recipeDescription, recipeId, recipeImageUrl, recipeName, recipeTimeMinutes]);

  const recipeFromCatalog = React.useMemo(
    () => (recipeId ? SEARCH_RECIPES.find((item) => item.id === recipeId) : undefined),
    [recipeId]
  );

  const recipeFromSaved = React.useMemo(
    () => (recipeId ? getSavedRecipeById(recipeId) : undefined),
    [getSavedRecipeById, recipeId]
  );

  const aiRecipeDraft = React.useMemo(() => {
    if (!aiEditPreview) {
      return null;
    }

    return {
      name: aiEditPreview.name,
      description: aiEditPreview.description,
      timeMinutes: aiEditPreview.timeMinutes,
    };
  }, [aiEditPreview]);

  const recipe =
    recipeFromAiSession ?? recipeFromApi ?? recipeFromSaved ?? recipeFromCatalog ?? recipeFromParams ?? SEARCH_RECIPES[0];
  const displayRecipe = aiEditPreview
    ? {
        ...recipe,
        name: aiEditPreview.name,
        description: aiEditPreview.description,
        timeMinutes: aiEditPreview.timeMinutes,
      }
    : recipe;
  const { data: recipeSteps } = useStepList(isAiImportRoute ? '' : recipe.id);
  const { data: recipeIngredients, isLoading: isRecipeIngredientsLoading } =
    useRecipeIngredientList(isAiImportRoute ? '' : recipe.id, serves, baseServes);

  const displayIngredientRows = React.useMemo(
    () =>
      aiEditPreview
        ? aiEditPreview.ingredients.map((ingredient, index) => ({
            key: `ai-preview-${index}`,
            emoji: ingredient.emoji,
            name: ingredient.name,
            qty: ingredient.qty,
            bg: ingredient.bg,
          }))
        : isAiImport
          ? (aiRecipeSession?.recipe.ingredients ?? aiRecipeSession?.detectedIngredients ?? []).map(
              (ingredient, index) => ({
                key: `ai-import-${index}`,
                emoji: '🥘',
                name: ingredient,
                qty: '',
                bg: '#F3F4F6',
              })
            )
          : (recipeIngredients ?? []).map((ingredient) => ({
              key: `${ingredient.recipeId}-${ingredient.ingredientId}`,
              emoji: ingredient.emoji,
              name: ingredient.name,
              qty: ingredient.quantityLabel,
              bg: ingredient.bg,
            })),
    [aiEditPreview, aiRecipeSession, isAiImport, recipeIngredients]
  );

  React.useEffect(() => {
    setServes(isAiImport ? 4 : baseServes);
  }, [baseServes, isAiImport, recipe.id]);

  const displaySteps = React.useMemo<StepItem[]>(() => {
    if (aiEditPreview) {
      return aiEditPreview.steps;
    }

    if (isAiImport && aiRecipeSession) {
      return aiRecipeSession.recipe.steps.map((step, index) => ({
        id: `ai-step-${index + 1}`,
        number: index + 1,
        text: normalizeAiStepText(step),
        tip: '',
      }));
    }

    return recipeSteps ?? [];
  }, [aiEditPreview, aiRecipeSession, isAiImport, recipeSteps]);
  const displayTips = React.useMemo(() => {
    if (isAiImport || aiEditPreview) {
      return [];
    }

    const tips = displaySteps
      .map((step) => (typeof step.tip === 'string' ? step.tip.trim() : ''))
      .filter((tip): tip is string => tip.length > 0);

    return Array.from(new Set(tips));
  }, [aiEditPreview, displaySteps, isAiImport]);

  const displayRecipeName = aiEditPreview?.name ?? displayRecipe.name;
  const displayRecipeDescription = aiEditPreview?.description ?? displayRecipe.description;
  const displayRecipeTimeMinutes = aiEditPreview?.timeMinutes ?? displayRecipe.timeMinutes;

  const recipeIsSaved = isAiImport ? false : isSaved(recipe.id);
  const displayCookbooks = isAiImport ? [] : getRecipeCookbooks(recipe.id);
  const displayCookbookBadges = React.useMemo(() => {
    if (!recipeIsSaved) {
      return [];
    }

    if (displayCookbooks.length === 0) {
      return [{ id: 'fallback-uncategorized', name: String(t('cookbookDetail.uncategorized')) }];
    }

    return displayCookbooks.map((cookbook) => ({
      id: cookbook.id,
      name: cookbook.translationKey ? String(t(cookbook.translationKey)) : cookbook.name,
    }));
  }, [displayCookbooks, recipeIsSaved, t]);

  function handleBack() {
    if (isAiImport) {
      clearAIRecipeSession();
      router.replace('/(tabs)/recipe');
      return;
    }

    if (hasSearchReturnContext) {
      router.replace({
        pathname: '/search-results',
        ...(returnQuery ? { params: { q: returnQuery } } : {}),
      });
      return;
    }

    if (source === 'recipe-tab') {
      router.replace('/(tabs)/recipe');
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/recipe');
  }

  function handleSaveRecipe() {
    if (aiEditPreview) {
      saveRecipe({
        ...displayRecipe,
        name: aiEditPreview.name,
        description: aiEditPreview.description,
        timeMinutes: aiEditPreview.timeMinutes,
      });
      return;
    }

    if (isAiImport && recipeFromAiSession) {
      saveRecipe(recipeFromAiSession);
      return;
    }

    saveRecipe(recipe);
  }

  function handleDeleteSavedRecipe() {
    removeSavedRecipe(recipe.id);
    setDeleteConfirmVisible(false);
  }

  function openAiEditModal(type: 'swap' | 'optimize') {
    setAiEditType(type);
    setAiEditPrompt('');
    setShowAiSuccessModal(false);
    setAiEditModalVisible(true);
  }

  async function handleStartAiEdit() {
    const trimmedPrompt = aiEditPrompt.trim();
    if (!trimmedPrompt) {
      return;
    }

    const normalizedLanguage = String(locale || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
    const ingredientsForPrompt =
      recipeIngredients && recipeIngredients.length > 0
        ? recipeIngredients.map((item) => `${item.name} (${item.quantityLabel})`)
        : [recipe.name];

    const currentStepsText =
      displaySteps.length > 0
        ? displaySteps
            .map((step, index) => {
              const text = String(step.text || '').trim();
              return `${index + 1}. ${text}`;
            })
            .join('\n')
        : 'No current steps';

    const systemRequestPrefix =
      aiEditType === 'swap'
        ? 'Adjust ingredients based on user request while preserving full recipe format.'
        : 'Optimize and refine cooking steps based on user request while preserving full recipe format.';

    const specificNote = [
      systemRequestPrefix,
      `User request: ${trimmedPrompt}`,
      `Current recipe: ${recipe.name}`,
      'Current steps:',
      currentStepsText,
    ].join('\n');

    setAiEditLoading(true);
    try {
      const response = await generateRecipeFromInstruction({
        ingredients: ingredientsForPrompt,
        preference: {
          specific_note: specificNote,
        },
        language: normalizedLanguage,
      });

      const nextPreview: AiEditPreview = {
        name: response.dish?.trim() || displayRecipe.name,
        description: displayRecipe.description,
        timeMinutes: parseAiTimeMinutes(response.time) || displayRecipe.timeMinutes,
        ingredients: response.ingredients.map((ingredient) => ({
          emoji: '🥘',
          name: ingredient,
          qty: '',
          bg: '#F3F4F6',
        })),
        steps: buildAiDraftSteps(String(displayRecipe.id), response.steps),
      };

      setAiEditPreview(nextPreview);

      const recipeIdNumber = Number(recipe.id);
      upsertRecipeDraft({
        recipeId: String(recipe.id),
        recipe: {
          name: nextPreview.name,
          totalTime: nextPreview.timeMinutes,
          calories: Number.isFinite(recipe.calories) ? recipe.calories : 0,
          protein: Number((apiRecipeData as { protein?: number | string | null } | undefined)?.protein ?? 0),
          carbs: Number((apiRecipeData as { carbs?: number | string | null } | undefined)?.carbs ?? 0),
          fats: Number((apiRecipeData as { fats?: number | string | null } | undefined)?.fats ?? 0),
        },
        ingredients: buildAiDraftIngredients(String(recipe.id), response.ingredients),
        steps: buildAiDraftSteps(String(recipeIdNumber), response.steps),
      });

      setAiEditModalVisible(false);
      requestAnimationFrame(() => setShowAiSuccessModal(true));
    } catch {
      Alert.alert(
        t('recipe.errorTitle') || 'Lỗi',
        'Không thể thay đổi công thức. Vui lòng thử lại.'
      );
    } finally {
      setAiEditLoading(false);
    }
  }

  if (isAiImportRoute && !isAiImportReady) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background" edges={['top']}>
        <ActivityIndicator size="large" color="#CE232A" />
        <VietnamText className="mt-4 text-base font-semibold text-gray-700">
          {t('cookbookDetail.aiAnalyzing')}
        </VietnamText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View style={{ height: 260 }}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4 pt-2">
            <CircleButton
              variant="ghost"
              className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
              onPress={handleBack}>
              <Icon as={ArrowLeftIcon} size={20} className="text-white" />
            </CircleButton>

            {isAiImport ? <View className="h-10 w-10" /> : (
              <View className="flex-row gap-3">
                <CircleButton
                  variant="ghost"
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/recipe-edit',
                      params: {
                        recipeId: recipe.id,
                        from: source,
                        ...(returnQuery ? { returnQuery } : {}),
                      },
                    })
                  }>
                  <Icon as={PencilIcon} size={18} className="text-white" />
                </CircleButton>

                {recipeIsSaved ? (
                  <CircleButton
                    variant="ghost"
                    className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
                    onPress={() => setDeleteConfirmVisible(true)}>
                    <Icon as={XIcon} size={18} className="text-white" />
                  </CircleButton>
                ) : null}
              </View>
            )}
          </View>

          <View className="absolute bottom-4 right-4">
            <CircleButton
              variant="ghost"
              style={{ backgroundColor: 'rgba(30,30,30,0.7)' }}
              onPress={() => setImageVisible(true)}>
              <Icon as={MaximizeIcon} size={14} className="text-white" />
            </CircleButton>
          </View>
        </View>

        <View className="-mt-4 rounded-t-3xl bg-background px-4 pt-5">
          <VietnamText className="mb-2 text-2xl font-bold text-gray-900">{displayRecipeName}</VietnamText>
          <VietnamText className="mb-4 text-sm text-gray-500">{displayRecipeDescription}</VietnamText>

          <View className="mb-4 flex-row rounded-2xl border border-gray-200">
            <NutritionStat value={String(recipe.calories)} label={t('recipeDetail.calories')} emoji="🔥" />
            <NutritionStat value="12g" label={t('recipeDetail.protein')} emoji="💪" hasBorder />
            <NutritionStat value="28g" label={t('recipeDetail.carbs')} emoji="🌾" hasBorder />
            <NutritionStat value="10g" label={t('recipeDetail.fats')} emoji="🥑" hasBorder />
          </View>

          <View className="mb-4 gap-2">
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">{t('other.time')}:</VietnamText>
              <VietnamText className="text-sm text-gray-600">
                {displayRecipeTimeMinutes} {t('searchResults.minute')}
              </VietnamText>
            </View>
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">{t('other.cost')}:</VietnamText>
              <VietnamText className="text-sm text-gray-600">₫240000</VietnamText>
            </View>
            <TouchableOpacity 
              className="flex-1 flex-row items-center gap-2"
              onPress={() => setNoteModalVisible(true)}>
              <VietnamText className="text-sm font-semibold text-gray-800">{t('other.note')}:</VietnamText>
              {noteText && noteText.trim().length > 0 ? (
                <View className="flex-1 flex-row items-center gap-1.5">
                   <VietnamText className="flex-shrink text-sm text-gray-600" numberOfLines={1}>
                     {noteText.replace(/\n/g, ' ').trim()}
                   </VietnamText>
                   <Icon as={PencilIcon} size={13} color="#4B5563" />
                </View>
              ) : (
                <>
                  <VietnamText className="text-sm text-gray-600 underline">{t('other.addNote')}</VietnamText>
                  <Icon as={PlusIcon} size={14} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {recipeIsSaved ? (
            <View className="mb-5">
              <VietnamText className="mb-2 text-base font-bold text-gray-900">
                {t('cookbook.COOKBOOK')}
              </VietnamText>
              <View className="flex-row flex-wrap gap-2">
                {displayCookbookBadges.map((cookbookBadge) => (
                  <View
                    key={cookbookBadge.id}
                    className="flex-row items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
                    <Icon as={FolderIcon} size={14} className="text-gray-600" />
                    <VietnamText className="text-sm font-medium italic text-gray-700">
                      {cookbookBadge.name}
                    </VietnamText>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <VietnamText className="mb-3 text-base font-bold text-gray-900">
            {t('ingredients.INGREDIENTS')}
          </VietnamText>

          <View className="mb-4 flex-row items-center gap-3">
            <View className="flex-row items-center gap-4 rounded-xl border border-gray-300 px-4 py-2">
              <TouchableOpacity onPress={() => setServes((current) => Math.max(1, current - 1))}>
                <Icon as={MinusIcon} size={18} />
              </TouchableOpacity>
              <VietnamText className="text-base font-medium text-gray-800">
                {t('other.serves')}: <VietnamText className="font-bold">{serves}</VietnamText>
              </VietnamText>
              <TouchableOpacity onPress={() => setServes((current) => current + 1)}>
                <Icon as={PlusIcon} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <VietnamText className="mb-2 text-sm text-gray-500">{t('ingredients.mainIngredients')}</VietnamText>

          {isAiImport ? null : isRecipeIngredientsLoading ? (
            <View className="items-center py-6">
              <ActivityIndicator size="small" color="#00B075" />
            </View>
          ) : displayIngredientRows.length > 0 ? (
            displayIngredientRows.map((ingredient) => (
              <IngredientRow
                key={ingredient.key}
                emoji={ingredient.emoji}
                name={ingredient.name}
                qty={ingredient.qty}
                bg={ingredient.bg}
              />
            ))
          ) : (
            <VietnamText className="mb-1 text-sm text-gray-500">No ingredients found.</VietnamText>
          )}

          <View className="mt-5 rounded-full p-0.5" style={{ borderWidth: 1.5 }}>
            <RoundedButton variant="ghost" onPress={() => openAiEditModal('swap')}>
              <Icon as={SparklesIcon} size={18} />
              <VietnamText className="text-base font-semibold">
                {t('ingredients.swapIngredients')}
              </VietnamText>
            </RoundedButton>
          </View>

          <VietnamText className="mb-4 mt-6 text-base font-bold text-gray-900">
            {t('steps.STEPS')}
          </VietnamText>

          <View className="mb-4 rounded-2xl bg-amber-50 p-4">
            {displaySteps.map((step, index) => (
              <StepCard
                key={step.id ?? String(index)}
                {...step}
                number={step.number ?? index + 1}
                isLast={index === displaySteps.length - 1}
              />
            ))}
          </View>

          <View className="mb-5 rounded-full" style={{ borderWidth: 1.5 }}>
            <RoundedButton variant="ghost" onPress={() => openAiEditModal('optimize')}>
              <Icon as={SparklesIcon} size={18} />
              <VietnamText className="text-base font-semibold">{t('steps.optimizeSteps')}</VietnamText>
            </RoundedButton>
          </View>

          {displayTips.length > 0 ? (
            <View className="mb-5 rounded-2xl bg-amber-50 p-4">
              <View className="mb-2 flex-row items-center gap-2">
                <VietnamText className="text-xl">💡</VietnamText>
                <VietnamText className="text-base font-bold text-gray-900">{t('other.tips')}</VietnamText>
              </View>
              <View className="gap-2">
                {displayTips.map((tip, index) => (
                  <VietnamText
                    key={`${tip}-${index}`}
                    className="text-sm leading-relaxed text-gray-600">
                    • {tip}
                  </VietnamText>
                ))}
              </View>
            </View>
          ) : null}

          <View className="h-20" />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-gray-100 bg-background px-4 py-3">
        <CircleButton variant="outline" size="icon" className="h-14 w-14">
          <Icon as={ShareIcon} size={20} />
        </CircleButton>

        {isAiImport ? (
          <RoundedButton className="flex-1" size="lg" onPress={handleSaveRecipe}>
            <View className="h-8 w-8 items-center justify-center rounded-full">
              <Icon as={Bookmark} size={16} color="white" />
            </View>
            <VietnamText className="text-lg font-bold text-white">{t('recipe.saveRecipe')}</VietnamText>
          </RoundedButton>
        ) : recipeIsSaved ? (
          <RoundedButton
            className="flex-1"
            size="lg"
            onPress={() =>
              router.push({
                pathname: '/(tabs)/cooking-ingredients',
                params: {
                  recipeId: recipe.id,
                  serves: String(serves),
                  baseServes: String(baseServes),
                },
              })
            }>
            <View className="h-8 w-8 items-center justify-center rounded-full">
              <Icon as={PlayIcon} size={16} color="white" />
            </View>
            <VietnamText className="text-lg font-bold text-white">{t('recipe.startCooking')}</VietnamText>
          </RoundedButton>
        ) : (
          <RoundedButton className="flex-1" size="lg" onPress={handleSaveRecipe}>
            <View className="h-8 w-8 items-center justify-center rounded-full">
              <Icon as={Bookmark} size={16} color="white" />
            </View>
            <VietnamText className="text-lg font-bold text-white">{t('recipe.saveRecipe')}</VietnamText>
          </RoundedButton>
        )}
      </View>

      <Modal
        visible={showAiSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowAiSuccessModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/45 px-6">
          <View className="w-full rounded-[28px] bg-white p-6">
            <VietnamText className="text-center text-2xl font-bold text-gray-900">
              {t('recipe.successTitle')}
            </VietnamText>

            <VietnamText className="mt-4 text-center text-base leading-7 text-gray-600">
              {t('recipe.successAnalyzed', {
                source: aiRecipeSession?.sourceLabel ?? 'AI',
              })}
            </VietnamText>

            <Pressable
              onPress={() => setShowAiSuccessModal(false)}
              className="mt-6 items-center justify-center rounded-full bg-[#CE232A] py-3.5">
              <VietnamText className="text-base font-bold text-white">{t('aiRecipe.ok')}</VietnamText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={imageVisible} transparent animationType="fade" statusBarTranslucent>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
            <View className="flex-row justify-end px-4 pt-2">
              <CircleButton
                variant="ghost"
                className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                onPress={() => setImageVisible(false)}>
                <Icon as={ArrowLeftIcon} size={20} className="text-white" />
              </CircleButton>
            </View>
          </SafeAreaView>

          <Image source={{ uri: recipe.imageUrl }} style={{ flex: 1 }} resizeMode="contain" />
        </View>
      </Modal>

      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setDeleteConfirmVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/45 px-6">
          <View className="w-full rounded-[28px] bg-[#F4F4F6] p-6">
            <View className="mb-2 flex-row justify-end">
              <Pressable
                onPress={() => setDeleteConfirmVisible(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#E2E2E5]">
                <Icon as={XIcon} size={20} className="text-[#69696F]" />
              </Pressable>
            </View>

            <VietnamText className="text-center text-4xl font-black text-[#232326]">
              {t('recipe.confirmDeleteSavedTitle')}
            </VietnamText>

            <VietnamText className="mt-5 text-center text-2xl font-semibold leading-8 text-[#2F2F34]">
              {t('recipe.confirmDeleteSavedMessage')}
            </VietnamText>

            <View className="mt-8 flex-row gap-4">
              <Pressable
                onPress={() => setDeleteConfirmVisible(false)}
                className="flex-1 items-center justify-center rounded-full border border-[#16814E] bg-white py-4">
                <VietnamText className="text-[18px] font-bold text-[#16814E]">
                  {t('other.cancel').toUpperCase()}
                </VietnamText>
              </Pressable>

              <Pressable
                onPress={handleDeleteSavedRecipe}
                className="flex-1 items-center justify-center rounded-full bg-[#EB404F] py-4">
                <VietnamText className="text-[18px] font-bold text-white">
                  BỎ LƯU
                </VietnamText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={noteModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setNoteModalVisible(false)}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center items-center bg-black/45 px-6"
        >
          <View className="w-full items-center">
            {/* Top Icon */}
            <View
              className="rounded-full bg-white z-10" 
              style={{ 
                padding: 6, 
                marginBottom: -46,
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.1, 
                shadowRadius: 4, 
                elevation: 3 
              }}
            >
              <View className="h-[80px] w-[80px] items-center justify-center rounded-full bg-[#EBF5EF]">
                <VietnamText className="text-[40px]">📝</VietnamText>
              </View>
            </View>

            {/* Card Body */}
            <View className="w-full rounded-[28px] bg-white p-6 pt-[60px]">
              {/* Close Button */}
              <CircleButton
                onPress={() => setNoteModalVisible(false)}
                className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full">
                <Icon as={XIcon} size={16} className="text-[#69696F]" />
              </CircleButton>

              {/* Content */}
              <VietnamText className="mb-5 text-center text-[22px] font-bold text-[#1F2937]">
                {t('other.addNote')}
              </VietnamText>

              <View className="min-h-[140px] w-full rounded-[14px] border border-[#16814E] p-3.5 mb-6 bg-white">
                <TextInput
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-[15px] leading-[22px] text-[#374151]"
                  style={{ fontFamily: 'BeVietnamPro_400Regular' }}
                  value={noteText}
                  onChangeText={setNoteText}
                />
              </View>

              <RoundedButton 
                className="w-full rounded-full items-center justify-center"
                onPress={() => setNoteModalVisible(false)}
              >
                <VietnamText className="text-[16px] font-bold text-white tracking-wider">
                  {t('cookbookDetail.confirm')}
                </VietnamText>
              </RoundedButton>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={aiEditModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setAiEditModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 items-center justify-center bg-black/45 px-6">
          <View className="w-full max-h-[82%] rounded-[28px] bg-white p-5">
            <View className="mb-3 flex-row items-center justify-between">
              <VietnamText className="text-lg font-bold text-[#1F2937]">
                {aiEditType === 'swap' ? 'Swap ingredient' : 'Optimize steps'}
              </VietnamText>
              <Pressable
                onPress={() => setAiEditModalVisible(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F0F1F3]">
                <Icon as={XIcon} size={16} className="text-[#69696F]" />
              </Pressable>
            </View>

            <VietnamText className="mb-3 text-sm text-gray-600">
              Nhập thay đổi bạn muốn, sau đó bấm Start now để AI xử lý bằng instruction API.
            </VietnamText>

            <View className="mb-4 min-h-[120px] rounded-[14px] border border-[#16814E] bg-white p-3.5">
              <TextInput
                multiline
                textAlignVertical="top"
                placeholder="Ví dụ: đổi thịt bò thành đậu hũ, giảm vị cay, rút gọn còn 20 phút"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-[15px] leading-[22px] text-[#374151]"
                style={{ fontFamily: 'BeVietnamPro_400Regular' }}
                value={aiEditPrompt}
                onChangeText={setAiEditPrompt}
              />
            </View>

            <Pressable
              onPress={handleStartAiEdit}
              disabled={aiEditLoading || aiEditPrompt.trim().length === 0}
              className="mb-4 items-center justify-center rounded-full bg-[#CE232A] py-3.5 disabled:opacity-50">
              {aiEditLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <VietnamText className="text-[16px] font-bold text-white tracking-wider">
                  Start now
                </VietnamText>
              )}
            </Pressable>

          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
