import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as React from 'react';
import { useRouter } from 'expo-router';
import { Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  PrinterIcon,
  PencilIcon,
  Trash2Icon,
  MaximizeIcon,
  BookOpenIcon,
  CalendarIcon,
  ShoppingCartIcon,
  CookingPotIcon,
  LinkIcon,
  FolderIcon,
  PlusIcon,
  MinusIcon,
  RefreshCwIcon,
  SparklesIcon,
  AlertCircleIcon,
  ShareIcon,
  PlayIcon,
  ChevronRightIcon,
} from 'lucide-react-native';

import { IngredientRow } from '@/components/in-app-ui/ingredient-row';
import { StepCard } from '@/components/in-app-ui/step-card';
import { NutritionStat } from '@/components/in-app-ui/nutrition-stat';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { CircleButton } from '@/components/in-app-ui/circle-button';

import { INGREDIENTS } from '@/constants/ingredientData';
import { STEPS } from '@/constants/stepData';
import { useLocale } from '@/hooks/use-locale';

export default function RecipeDetailScreen() {
  const [serves, setServes] = React.useState(4);
  const router = useRouter();
  const { t } = useLocale();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* ── ScrollView ── */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ── Hero Image ── */}
        <View style={{ height: 260 }}>
          <Image
            source={{
              uri: 'https://images.squarespace-cdn.com/content/v1/66628bdc6b0b0d52d914a921/1752754499896-E9EAAEK78ESN8KAJV33G/unsplash-image-_33r6H_hiz4.jpg?format=1500w',
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* Overlay gradient header icons */}
          <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4 pt-2">
            <CircleButton
              className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
              onPress={() => router.back()}>
              <Icon as={ArrowLeftIcon} size={20} className="text-white" />
            </CircleButton>
            <View className="flex-row gap-3">
              {[PencilIcon, Trash2Icon].map((Ic, i) => (
                <CircleButton
                  key={i}
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/35">
                  <Icon as={Ic} size={18} className="text-white" />
                </CircleButton>
              ))}
            </View>
          </View>
          {/* View button */}
          <View className="absolute bottom-4 right-4">
            <CircleButton style={{ backgroundColor: 'rgba(30,30,30,0.7)' }}>
              <Icon as={MaximizeIcon} size={14} className="text-white" />
            </CircleButton>
          </View>
        </View>

        {/* ── Content Card ── */}
        <View className="-mt-4 rounded-t-3xl bg-background px-4 pt-5">
          {/* Title */}
          <VietnamText className="mb-4 text-2xl font-bold text-gray-900">Súp phở</VietnamText>

          {/* Action Grid */}
          <View className="mb-5 flex-row justify-around">
            <BottomActionBar icon={BookOpenIcon} label={t('recipe.addIntoCookbook')} />
            {/* Not Cooked – circle icon variant */}
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

          {/* Nutrition Card */}
          <View className="mb-4 flex-row rounded-2xl border border-gray-200">
            <NutritionStat value="250" label="Calories" emoji="🔥" />
            <NutritionStat value="12g" label="Protein" emoji="💪" hasBorder />
            <NutritionStat value="28g" label="Carbs" emoji="🌾" hasBorder />
            <NutritionStat value="10g" label="Fats" emoji="🥑" hasBorder />
          </View>

          {/* Meta Info */}
          <View className="mb-4 gap-2">
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">
                {t('other.time')}:
              </VietnamText>
              <VietnamText className="text-sm text-gray-600">
                30 {t('searchResults.minute')}
              </VietnamText>
            </View>
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">
                {t('other.cost')}:
              </VietnamText>
              <VietnamText className="text-sm text-gray-600">₫240000</VietnamText>
            </View>
            <View className="flex-1 flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">
                {t('other.note')}:
              </VietnamText>
              <VietnamText className="text-sm text-gray-600 underline">
                {t('other.addNote')}
              </VietnamText>
              <Icon as={PlusIcon} size={14} />
            </View>
          </View>

          {/* COOKBOOK section */}
          <View className="mb-5">
            <VietnamText className="mb-2 text-base font-bold text-gray-900">
              {t('cookbook.COOKBOOK')}
            </VietnamText>
            <View className="flex-row">
              <View className="flex-row items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
                <Icon as={FolderIcon} size={14} className="text-gray-600" />
                <VietnamText className="text-sm font-medium italic text-gray-700">
                  Dinner
                </VietnamText>
              </View>
            </View>
          </View>

          {/* ── INGREDIENTS ── */}
          <VietnamText className="mb-3 text-base font-bold text-gray-900">
            {t('ingredients.INGREDIENTS')}
          </VietnamText>

          {/* Servings Stepper + Convert */}
          <View className="mb-4 flex-row items-center gap-3">
            <View className="flex-row items-center gap-4 rounded-xl border border-gray-300 px-4 py-2">
              <TouchableOpacity onPress={() => setServes((s) => Math.max(1, s - 1))}>
                <Icon as={MinusIcon} size={18} />
              </TouchableOpacity>
              <VietnamText className="text-base font-medium text-gray-800">
                {t('other.serves')}: <VietnamText className="font-bold">{serves}</VietnamText>
              </VietnamText>
              <TouchableOpacity onPress={() => setServes((s) => s + 1)}>
                <Icon as={PlusIcon} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <VietnamText className="mb-2 text-sm text-gray-500">Nguyên liệu chính</VietnamText>

          {/* Ingredient List */}
          {INGREDIENTS.map((ing, i) => (
            <IngredientRow key={i} {...ing} />
          ))}

          {/* Swap Ingredients button – gradient border effect */}
          <View
            className="mt-5 rounded-full p-0.5"
            style={{
              borderWidth: 1.5,
              // gradient-like by using a two-tone border via shadow
            }}>
            <RoundedButton variant="ghost">
              <Icon as={SparklesIcon} size={18} />
              <VietnamText className="text-base font-semibold">
                {t('ingredients.swapIngredients')}
              </VietnamText>
            </RoundedButton>
          </View>

          {/* ── STEPS ── */}
          <VietnamText className="mb-4 mt-6 text-base font-bold text-gray-900">
            {t('steps.STEPS')}
          </VietnamText>

          <View className="mb-4 rounded-2xl bg-amber-50 p-4">
            {STEPS.map((step, i) => (
              <StepCard key={i} {...step} isLast={i === STEPS.length - 1} />
            ))}
          </View>

          {/* Optimize Steps button */}
          <View
            className="mb-5 rounded-full"
            style={{
              borderWidth: 1.5,
            }}>
            <RoundedButton variant="ghost">
              <Icon as={SparklesIcon} size={18} />
              <VietnamText className="text-base font-semibold">
                {t('steps.optimizeSteps')}
              </VietnamText>
            </RoundedButton>
          </View>

          {/* Tips section */}
          <View className="mb-5 rounded-2xl bg-amber-50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <VietnamText className="text-xl">💡</VietnamText>
              <VietnamText className="text-base font-bold text-gray-900">
                {t('other.tips')}
              </VietnamText>
            </View>
            <VietnamText className="text-sm leading-relaxed text-gray-600">
              Bạn có thể thêm các loại topping khác như xúc xích, thịt xông khói hoặc nấm để tăng
              hương vị. Nếu không có lò nướng, bạn có thể sử dụng chảo chống dính để nướng bánh trên
              bếp.
            </VietnamText>
          </View>

          {/* Bottom spacer for action bar */}
          <View className="h-20" />
        </View>
      </ScrollView>
      {/* ── Bottom Action Bar ── */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-gray-100 bg-background px-4 py-3">
        {/* Share button */}
        <CircleButton variant="outline" size="icon" className="h-14 w-14">
          <Icon as={ShareIcon} size={20} />
        </CircleButton>

        {/* Start Cooking button */}
        <RoundedButton
          className="flex-1"
          size="lg"
          onPress={() => router.push('/(tabs)/cooking-ingredients')}>
          <View className="h-8 w-8 items-center justify-center rounded-full">
            <Icon as={PlayIcon} size={16} color="white" />
          </View>
          <VietnamText className="text-lg font-bold text-white">
            {t('recipe.startCooking')}
          </VietnamText>
        </RoundedButton>
      </View>
    </SafeAreaView>
  );
}
