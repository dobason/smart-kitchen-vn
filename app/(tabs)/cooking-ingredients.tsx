import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { XIcon, ChevronRightIcon } from 'lucide-react-native';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { CircleButton } from '@/components/in-app-ui/circle-button';

import { IngredientRow } from '@/components/in-app-ui/ingredient-row';
import { INGREDIENTS } from '@/constants/ingredientData';
import { useLocale } from '@/hooks/use-locale';

export default function CookingIngredientsScreen() {
  const router = useRouter();
  const { t } = useLocale();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-3">
        {/* Close button */}
        <CircleButton
          variant="ghost"
          className="absolute left-4 h-9 w-9 items-center justify-center bg-gray-100"
          onPress={() => router.push('/(tabs)/recipe-detail')}>
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
        {INGREDIENTS.map((ing, i) => (
          <IngredientRow key={i} {...ing} />
        ))}
      </ScrollView>
      {/* ── Footer NEXT button ── */}
      <View className="absolute bottom-0 left-0 right-0 bg-background px-5 pb-6 pt-3">
        <RoundedButton size="lg" onPress={() => router.push('/(tabs)/cooking-step')}>
          <VietnamText className="text-base font-bold text-white">{t('other.next')}</VietnamText>
          <Icon as={ChevronRightIcon} size={20} color="white" />
        </RoundedButton>
      </View>
    </SafeAreaView>
  );
}
