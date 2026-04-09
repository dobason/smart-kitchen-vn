import { CircleButton } from '@/components/in-app-ui/circle-button';
import { IngredientRow } from '@/components/in-app-ui/ingredient-row';
import { NutritionStat } from '@/components/in-app-ui/nutrition-stat';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { StepCard } from '@/components/in-app-ui/step-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { Icon } from '@/components/ui/icon';
import { INGREDIENTS } from '@/constants/ingredientData';
import { SEARCH_RECIPES } from '@/constants/recipeData';
import { STEPS } from '@/constants/stepData';
import { useLocale } from '@/hooks/use-locale';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import type { SearchRecipeItem } from '@/types/recipe';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  Bookmark,
  CookingPotIcon,
  FolderIcon,
  MaximizeIcon,
  MinusIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  SparklesIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import { Image, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RecipeDetailParams = {
  recipeId?: string | string[];
  recipeName?: string | string[];
  recipeDescription?: string | string[];
  recipeCalories?: string | string[];
  recipeTimeMinutes?: string | string[];
  recipeImageUrl?: string | string[];
};

function singleParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default function RecipeDetailScreen() {
  const [serves, setServes] = React.useState(4);
  const [imageVisible, setImageVisible] = React.useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);

  const router = useRouter();
  const { t } = useLocale();
  const params = useLocalSearchParams<RecipeDetailParams>();

  const { isSaved, saveRecipe, removeSavedRecipe, getSavedRecipeById } = useSavedRecipes();

  const recipeId = singleParam(params.recipeId);
  const recipeName = singleParam(params.recipeName);
  const recipeDescription = singleParam(params.recipeDescription);
  const recipeImageUrl = singleParam(params.recipeImageUrl);
  const recipeCalories = singleParam(params.recipeCalories);
  const recipeTimeMinutes = singleParam(params.recipeTimeMinutes);

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

  const recipe = recipeFromSaved ?? recipeFromCatalog ?? recipeFromParams ?? SEARCH_RECIPES[0];

  const recipeIsSaved = isSaved(recipe.id);

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/recipe');
  }

  function handleSaveRecipe() {
    saveRecipe(recipe);
  }

  function handleDeleteSavedRecipe() {
    removeSavedRecipe(recipe.id);
    setDeleteConfirmVisible(false);
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

            <View className="flex-row gap-3">
              <CircleButton
                variant="ghost"
                className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/recipe-edit',
                    params: { recipeId: recipe.id },
                  })
                }>
                <Icon as={PencilIcon} size={18} className="text-white" />
              </CircleButton>

              {recipeIsSaved ? (
                <CircleButton
                  variant="ghost"
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
                  onPress={() => setDeleteConfirmVisible(true)}>
                  <Icon as={Trash2Icon} size={18} className="text-white" />
                </CircleButton>
              ) : (
                <CircleButton
                  variant="ghost"
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
                  onPress={handleSaveRecipe}>
                  <Icon as={Bookmark} size={18} className="text-white" />
                </CircleButton>
              )}
            </View>
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
          <VietnamText className="mb-2 text-2xl font-bold text-gray-900">{recipe.name}</VietnamText>
          <VietnamText className="mb-4 text-sm text-gray-500">{recipe.description}</VietnamText>

          <View className="mb-5 flex-row justify-around">
            <BottomActionBar icon={BookOpenIcon} label={t('recipe.addIntoCookbook')} />
            <View className="flex-1 items-center gap-1">
              <View className="relative">
                <Icon as={CookingPotIcon} size={26} className="text-gray-700" />
                <View className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white" />
              </View>
              <VietnamText className="text-center text-xs text-gray-600">
                {t('recipe.notCooked')}
              </VietnamText>
            </View>
          </View>

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
                {recipe.timeMinutes} {t('searchResults.minute')}
              </VietnamText>
            </View>
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">{t('other.cost')}:</VietnamText>
              <VietnamText className="text-sm text-gray-600">₫240000</VietnamText>
            </View>
            <View className="flex-1 flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">{t('other.note')}:</VietnamText>
              <VietnamText className="text-sm text-gray-600 underline">{t('other.addNote')}</VietnamText>
              <Icon as={PlusIcon} size={14} />
            </View>
          </View>

          <View className="mb-5">
            <VietnamText className="mb-2 text-base font-bold text-gray-900">
              {t('cookbook.COOKBOOK')}
            </VietnamText>
            <View className="flex-row">
              <View className="flex-row items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
                <Icon as={FolderIcon} size={14} className="text-gray-600" />
                <VietnamText className="text-sm font-medium italic text-gray-700">
                  {t('cookbookDetail.dinner')}
                </VietnamText>
              </View>
            </View>
          </View>

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

          {INGREDIENTS.map((ingredient, index) => (
            <IngredientRow key={index} {...ingredient} />
          ))}

          <View className="mt-5 rounded-full p-0.5" style={{ borderWidth: 1.5 }}>
            <RoundedButton variant="ghost">
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
            {STEPS.map((step, index) => (
              <StepCard key={index} {...step} isLast={index === STEPS.length - 1} />
            ))}
          </View>

          <View className="mb-5 rounded-full" style={{ borderWidth: 1.5 }}>
            <RoundedButton variant="ghost">
              <Icon as={SparklesIcon} size={18} />
              <VietnamText className="text-base font-semibold">{t('steps.optimizeSteps')}</VietnamText>
            </RoundedButton>
          </View>

          <View className="mb-5 rounded-2xl bg-amber-50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <VietnamText className="text-xl">💡</VietnamText>
              <VietnamText className="text-base font-bold text-gray-900">{t('other.tips')}</VietnamText>
            </View>
            <VietnamText className="text-sm leading-relaxed text-gray-600">
              {t('recipe.detailTipsMessage')}
            </VietnamText>
          </View>

          <View className="h-20" />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-gray-100 bg-background px-4 py-3">
        <CircleButton variant="outline" size="icon" className="h-14 w-14">
          <Icon as={ShareIcon} size={20} />
        </CircleButton>

        {recipeIsSaved ? (
          <RoundedButton
            className="flex-1"
            size="lg"
            onPress={() => router.push('/(tabs)/cooking-ingredients')}>
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
                  {t('other.delete').toUpperCase()}
                </VietnamText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
