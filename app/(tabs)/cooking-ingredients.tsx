import * as React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { XIcon, BookOpenCheckIcon, MicIcon, ChevronRightIcon } from 'lucide-react-native';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { IngredientRow } from '@/components/in-app-ui/ingredient-row';
import { INGREDIENTS } from '@/constants/ingredientData';
import { useLocale } from '@/hooks/use-locale';

const BRAND = '#bd375dff';

export default function CookingIngredientsScreen() {
  const router = useRouter();
  const { t } = useLocale();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-3">
        {/* Close button */}
        <TouchableOpacity
          className="h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          onPress={() => router.push('/(tabs)/recipe-detail')}>
          <Icon as={XIcon} size={18} className="text-gray-700" />
        </TouchableOpacity>

        {/* Title */}
        <VietnamText
          className="text-lg font-bold tracking-widest text-gray-900"
          style={{ fontFamily: 'BeVietnamPro_700Bold' }}>
          {t('ingredients.INGREDIENTS')}
        </VietnamText>

        {/* Recipe icon */}
        <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          <Icon as={BookOpenCheckIcon} size={18} className="text-gray-700" />
        </TouchableOpacity>
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
        <Button
          onPress={() => router.push('/(tabs)/cooking-step')}
          className="flex-row items-center justify-center gap-2 rounded-full py-1"
          style={{ backgroundColor: BRAND } as any}>
          <VietnamText
            className="text-base font-bold tracking-widest text-white"
            style={{ fontFamily: 'BeVietnamPro_700Bold' }}>
            {t('other.next')}
          </VietnamText>
          <Icon as={ChevronRightIcon} size={20} color="white" />
        </Button>
      </View>
    </SafeAreaView>
  );
}
