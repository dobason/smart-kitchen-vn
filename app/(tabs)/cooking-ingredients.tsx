import * as React from 'react';
import { ActivityIndicator, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { XIcon, ChevronRightIcon } from 'lucide-react-native';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { CircleButton } from '@/components/in-app-ui/circle-button';

import { IngredientRow } from '@/components/in-app-ui/ingredient-row';
import { useLocale } from '@/hooks/use-locale';
import { useRecipeIngredientList } from '@/hooks/use-recipe-ingredients';

type CookingIngredientsParams = {
  recipeId?: string | string[];
  serves?: string | string[];
  baseServes?: string | string[];
};

export default function CookingIngredientsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<CookingIngredientsParams>();
  const { t } = useLocale();
  const recipeId = Array.isArray(params.recipeId) ? params.recipeId[0] : params.recipeId;
  const servesParam = Array.isArray(params.serves) ? params.serves[0] : params.serves;
  const baseServesParam = Array.isArray(params.baseServes) ? params.baseServes[0] : params.baseServes;
  const recipeIdNumber = React.useMemo(() => {
    const parsed = Number(recipeId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [recipeId]);
  const serves = React.useMemo(() => {
    const parsed = Number(servesParam);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [servesParam]);
  const baseServes = React.useMemo(() => {
    const parsed = Number(baseServesParam);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [baseServesParam]);
  const { data: recipeIngredients, isLoading } = useRecipeIngredientList(
    recipeIdNumber,
    serves,
    baseServes
  );

  const goToRecipeDetail = React.useCallback(() => {
    if (recipeId) {
      router.push({
        pathname: '/(tabs)/recipe-detail',
        params: { recipeId },
      });
      return;
    }

    router.push('/(tabs)/recipe-detail');
  }, [recipeId, router]);

  const goToCookingStep = React.useCallback(() => {
    if (recipeId) {
      router.push({
        pathname: '/(tabs)/cooking-step',
        params: {
          recipeId,
          serves: String(serves),
          baseServes: String(baseServes),
        },
      });
      return;
    }

    router.push('/(tabs)/cooking-step');
  }, [baseServes, recipeId, router, serves]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-3">
        {/* Close button */}
        <CircleButton
          variant="ghost"
          className="absolute left-4 h-9 w-9 items-center justify-center bg-gray-100"
          onPress={goToRecipeDetail}>
          <Icon as={XIcon} size={18} className="text-gray-700" />
        </CircleButton>

        {/* Title */}
        <View className="flex-1 items-center justify-center">
          <VietnamText className="text-lg font-bold tracking-widest text-gray-900">
            {t('ingredients.INGREDIENTS')}
          </VietnamText>
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <VietnamText
          className="mb-4 text-sm font-semibold text-gray-500"
          style={{ fontFamily: 'BeVietnamPro_600SemiBold' }}>
          {t('ingredients.mainIngredients')}
        </VietnamText>

        {/* Ingredient list */}
        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="small" color="#00B075" />
          </View>
        ) : recipeIngredients && recipeIngredients.length > 0 ? (
          recipeIngredients.map((ingredient) => (
            <IngredientRow
              key={`${ingredient.recipeId}-${ingredient.ingredientId}`}
              emoji={ingredient.emoji}
              name={ingredient.name}
              qty={ingredient.quantityLabel}
              bg={ingredient.bg}
            />
          ))
        ) : (
          <VietnamText className="py-4 text-sm text-gray-500">No ingredients found.</VietnamText>
        )}
      </ScrollView>
      {/* ── Footer NEXT button ── */}
      <View className="absolute bottom-0 left-0 right-0 bg-background px-5 pb-6 pt-3">
        <RoundedButton size="lg" onPress={goToCookingStep}>
          <VietnamText className="text-base font-bold text-white">{t('other.next')}</VietnamText>
          <Icon as={ChevronRightIcon} size={20} color="white" />
        </RoundedButton>
      </View>
    </SafeAreaView>
  );
}
