import { CircleButton } from '@/components/in-app-ui/circle-button';
import { IngredientRow } from '@/components/in-app-ui/ingredient-row';
import { NutritionStat } from '@/components/in-app-ui/nutrition-stat';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { StepCard } from '@/components/in-app-ui/step-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useAIRecipeSession } from '@/hooks/use-ai-recipe-session';
import { useLocale } from '@/hooks/use-locale';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { getLatestAIRecipeSession } from '@/lib/ai-recipe-session';
import type { SearchRecipeItem } from '@/types/recipe';
import type { CookingIngredientItem } from '@/types/ingredient';
import type { StepItem } from '@/types/step';
import { router } from 'expo-router';
import {
  ArrowLeftIcon,
  Bookmark,
  Clock3,
  ImageIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function normalizeAiStepText(step: string): string {
  return step.replace(/^\s*\d+[\.)\-:]?\s*/, '').replace(/\*\*/g, '').trim();
}

export default function AIRecipeResultScreen() {
  const { t } = useLocale();
  const { session: contextSession, clearSession } = useAIRecipeSession();
  const { saveRecipe } = useSavedRecipes();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [imageVisible, setImageVisible] = React.useState(false);

  const session = getLatestAIRecipeSession() ?? contextSession;

  React.useEffect(() => {
    if (!session) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setShowSuccessModal(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [session]);

  const recipe = React.useMemo<SearchRecipeItem | undefined>(() => {
    if (!session) {
      return undefined;
    }

    const recipeName = session.recipe.dish?.trim() || 'AI Recipe';
    const timeMatch = String(session.recipe.time ?? '').match(/\d+/);
    const timeMinutes = timeMatch ? Number(timeMatch[0]) : 0;

    return {
      id: `ai-${recipeName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'recipe'}`,
      name: recipeName,
      description: `Generated from ${session.sourceLabel}`,
      calories: 0,
      timeMinutes: Number.isFinite(timeMinutes) ? timeMinutes : 0,
      imageUrl: session.imageUri,
      tags: [],
      cookware: [],
    };
  }, [session]);

  const ingredients = React.useMemo<CookingIngredientItem[]>(() => {
    if (!session) {
      return [];
    }

    const sourceIngredients = session.recipe.ingredients.length > 0 ? session.recipe.ingredients : session.detectedIngredients;

    return sourceIngredients.map((ingredient) => ({
      emoji: '🥘',
      name: ingredient,
      qty: '',
      bg: '#F3F4F6',
    }));
  }, [session]);

  const steps = React.useMemo<StepItem[]>(() => {
    if (!session) {
      return [];
    }

    return session.recipe.steps.map((step, index) => ({
      id: `ai-step-${index + 1}`,
      number: index + 1,
      text: normalizeAiStepText(step),
      tip: '',
    }));
  }, [session]);

  function handleClose() {
    clearSession();
    router.replace('/(tabs)/recipe');
  }

  function handleSaveRecipe() {
    if (!recipe) {
      return;
    }

    saveRecipe(recipe);
  }

  if (!session || !recipe) {
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
            source={{ uri: session.imageUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4 pt-2">
            <CircleButton
              variant="ghost"
              className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
              onPress={handleClose}>
              <Icon as={ArrowLeftIcon} size={20} className="text-white" />
            </CircleButton>

            <View className="flex-row gap-3">
              <View className="rounded-full bg-black/35 px-3 py-2">
                <VietnamText className="text-xs font-semibold text-white">AI Detail</VietnamText>
              </View>
            </View>
          </View>

          <View className="absolute bottom-4 right-4">
            <CircleButton
              variant="ghost"
              style={{ backgroundColor: 'rgba(30,30,30,0.7)' }}
              onPress={() => setImageVisible(true)}>
              <Icon as={ImageIcon} size={14} className="text-white" />
            </CircleButton>
          </View>
        </View>

        <View className="-mt-4 rounded-t-3xl bg-background px-4 pt-5">
          <VietnamText className="mb-2 text-2xl font-bold text-gray-900">{recipe.name}</VietnamText>
          <VietnamText className="mb-4 text-sm text-gray-500">{recipe.description}</VietnamText>

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
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">Source:</VietnamText>
              <VietnamText className="text-sm text-gray-600">{session.sourceLabel}</VietnamText>
            </View>
          </View>

          <VietnamText className="mb-3 text-base font-bold text-gray-900">
            {t('ingredients.INGREDIENTS')}
          </VietnamText>

          <VietnamText className="mb-2 text-sm text-gray-500">{t('ingredients.mainIngredients')}</VietnamText>
          {ingredients.map((ingredient, index) => (
            <IngredientRow
              key={`${ingredient.name}-${index}`}
              emoji={ingredient.emoji}
              name={ingredient.name}
              qty={ingredient.qty}
              bg={ingredient.bg}
            />
          ))}

          <View className="mt-5 rounded-full p-0.5" style={{ borderWidth: 1.5 }}>
            <RoundedButton variant="ghost" onPress={handleSaveRecipe}>
              <Icon as={SparklesIcon} size={18} />
              <VietnamText className="text-base font-semibold">
                {t('recipe.saveRecipe')}
              </VietnamText>
            </RoundedButton>
          </View>

          <VietnamText className="mb-4 mt-6 text-base font-bold text-gray-900">
            {t('steps.STEPS')}
          </VietnamText>

          <View className="mb-4 rounded-2xl bg-amber-50 p-4">
            {steps.map((step, index) => (
              <StepCard
                key={step.id ?? String(index)}
                {...step}
                number={step.number ?? index + 1}
                isLast={index === steps.length - 1}
              />
            ))}
          </View>

          <View className="h-20" />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-gray-100 bg-background px-4 py-3">
        <CircleButton variant="outline" size="icon" className="h-14 w-14" onPress={handleClose}>
          <Icon as={XIcon} size={20} />
        </CircleButton>

        <RoundedButton className="flex-1" size="lg" onPress={handleSaveRecipe}>
          <View className="h-8 w-8 items-center justify-center rounded-full">
            <Icon as={Bookmark} size={16} color="white" />
          </View>
          <VietnamText className="text-lg font-bold text-white">{t('recipe.saveRecipe')}</VietnamText>
        </RoundedButton>
      </View>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowSuccessModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/45 px-6">
          <View className="w-full rounded-[28px] bg-white p-6">
            <VietnamText className="text-center text-2xl font-bold text-gray-900">
              {t('recipe.successTitle')}
            </VietnamText>

            <VietnamText className="mt-4 text-center text-base leading-7 text-gray-600">
              {t('recipe.successAnalyzed', {
                source: session.sourceLabel,
              })}
            </VietnamText>

            <Pressable
              onPress={() => setShowSuccessModal(false)}
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

          <Image source={{ uri: session.imageUri }} style={{ flex: 1 }} resizeMode="contain" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
