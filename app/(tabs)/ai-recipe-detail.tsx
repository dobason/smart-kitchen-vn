/**
 * app/(tabs)/ai-recipe-detail.tsx
 *
 * Màn hình hiển thị kết quả công thức do AI sinh ra.
 * Clone cấu trúc từ recipe-detail.tsx, nhưng:
 *  - Dữ liệu ĐỘNG: name, ingredients, steps lấy từ AIRecipeContext
 *  - Dữ liệu HARDCODE: calories, protein, carbs, fats, time, cost, note, serves
 *  - Không gọi backend API (useRecipeById, useStepList, useRecipeIngredientList)
 *  - Không có chức năng Save/Delete/Edit (chỉ xem và bắt đầu nấu)
 */

import { CircleButton } from '@/components/in-app-ui/circle-button';
import { NutritionStat } from '@/components/in-app-ui/nutrition-stat';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { StepCard } from '@/components/in-app-ui/step-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useAIRecipeContext } from '@/context/ai-recipe-context';
import { useLocale } from '@/hooks/use-locale';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import type { AIRecipeIngredient } from '@/types/aiRecipe';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  PlayIcon,
  ShareIcon,
  Bookmark,
} from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Hardcoded mock values (cố định) ─────────────────────────
const HARDCODED = {
  calories: '550',
  protein: '12g',
  carbs: '28g',
  fats: '10g',
  timeMinutes: 25,
  cost: '₫240,000',
  note: 'Ngon hơn khi dùng nóng',
  defaultServes: 4,
  /** Ảnh placeholder khi không có ảnh từ AI */
  imageUrl:
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format',
} as const;

// ─── Sub-component: AI Ingredient Row ────────────────────────

interface AIIngredientRowProps {
  item: AIRecipeIngredient;
  index: number;
}

function AIIngredientRow({ item, index }: AIIngredientRowProps) {
  // Màu nền luân phiên để tạo visual rhythm giống IngredientRow gốc
  const BG_COLORS = ['#F0FDF4', '#FEF9C3', '#FFF7ED', '#F0F9FF', '#FDF4FF'];
  const EMOJIS = ['🥗', '🥩', '🌿', '🫙', '🧄', '🧅', '🥕', '🫚', '🧂', '🍋'];

  const bg = BG_COLORS[index % BG_COLORS.length];
  const emoji = EMOJIS[index % EMOJIS.length];

  const name = typeof item === 'string' ? item : item?.name || '';
  const amount = typeof item === 'string' ? '' : item?.amount || '';

  return (
    <View className="flex-row items-center border-b border-dashed border-gray-200 py-3">
      <View
        className="mr-3 h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: bg }}>
        <VietnamText className="text-2xl">{emoji}</VietnamText>
      </View>
      <VietnamText className="flex-1 text-base text-gray-800">{name}</VietnamText>
      {amount ? (
        <VietnamText className="text-base font-bold text-gray-700">{amount}</VietnamText>
      ) : null}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function AIRecipeDetailScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const { recipe, isPending, isError, errorMessage } = useAIRecipeContext();
  const { saveRecipe } = useSavedRecipes();

  const [serves, setServes] = React.useState<number>(HARDCODED.defaultServes);
  const [recipeIsSaved, setRecipeIsSaved] = React.useState(false);
  const [savedAiId, setSavedAiId] = React.useState<string | null>(null);

  const handleSaveRecipe = React.useCallback(async () => {
    if (!recipe) return;

    const newId = 'ai-' + Date.now().toString();

    // Tạo object món ăn theo chuẩn SearchRecipeItem
    const aiRecipeToSave = {
      id: newId,
      name: recipe.name || 'Công thức AI',
      description: 'Công thức được tạo bởi AI dựa trên nguyên liệu bạn cung cấp.',
      calories: Number(HARDCODED.calories),
      timeMinutes: HARDCODED.timeMinutes,
      imageUrl: HARDCODED.imageUrl,
      tags: [],
      cookware: [],
      aiIngredients: recipe.ingredients,
      aiSteps: recipe.steps,
    };

    // Gọi hook lưu vào sổ tay mặc định
    saveRecipe(aiRecipeToSave);

    setSavedAiId(newId);

    // Cập nhật UI sang trạng thái đã lưu
    setRecipeIsSaved(true);
  }, [recipe, saveRecipe]);

  // ─── Loading state ─────────────────────────────────────────
  if (isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#CE232A" />
        <VietnamText className="mt-4 text-base text-gray-500">
          AI đang tạo công thức, vui lòng chờ...
        </VietnamText>
        <VietnamText className="mt-1 text-sm text-gray-400">
          (Render cold start có thể mất 30–60 giây)
        </VietnamText>
      </SafeAreaView>
    );
  }

  // ─── Error state ───────────────────────────────────────────
  if (isError || !recipe) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
        <VietnamText className="mb-2 text-5xl">🚫</VietnamText>
        <VietnamText className="mb-2 text-center text-xl font-bold text-gray-900">
          Không thể tạo công thức
        </VietnamText>
        <VietnamText className="mb-8 text-center text-sm text-gray-500">
          {errorMessage ?? 'Vui lòng kiểm tra kết nối mạng và thử lại.'}
        </VietnamText>
        <RoundedButton onPress={() => router.replace('./ai-recipe')}>
          <VietnamText className="text-base font-bold text-white">Thử lại</VietnamText>
        </RoundedButton>
      </SafeAreaView>
    );
  }

  // ─── Map AI steps → StepItem shape cho StepCard ────────────
  const displaySteps = recipe.steps.map((text, index) => ({
    id: String(index),
    number: index + 1,
    text,
    tip: undefined,
    isLast: index === recipe.steps.length - 1,
  }));

  console.log('Dữ liệu AI trả về:', recipe);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* ── Hero Image ─────────────────────────────────────── */}
        <View style={{ height: 260 }}>
          {/* Dùng ảnh placeholder vì AI không sinh ảnh */}
          <View
            style={{ width: '100%', height: '100%', backgroundColor: '#FCE9EC' }}
            className="items-center justify-center">
            <VietnamText className="text-7xl">🍽</VietnamText>
            <VietnamText className="mt-2 px-6 text-center text-lg font-bold text-[#CE232A]">
              {recipe?.name || 'Đang tạo công thức...'}
            </VietnamText>
          </View>

          {/* Back button */}
          <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-4 pt-2">
            <CircleButton
              variant="ghost"
              className="h-10 w-10 items-center justify-center rounded-full bg-black/35"
              onPress={() => router.back()}>
              <Icon as={ArrowLeftIcon} size={20} className="text-white" />
            </CircleButton>

            {/* AI badge */}
            <View className="flex-row items-center gap-1.5 rounded-full bg-[#CE232A]/90 px-3 py-1.5">
              <Icon as={SparklesIcon} size={14} className="text-white" />
              <VietnamText className="text-xs font-bold text-white">AI Generated</VietnamText>
            </View>
          </View>
        </View>

        <View className="-mt-4 rounded-t-3xl bg-background px-4 pt-5">

          {/* ── Tên món & mô tả ──────────────────────────────── */}
          <VietnamText className="mb-2 text-2xl font-bold text-gray-900">
            {recipe?.name || 'Đang tạo công thức...'}
          </VietnamText>
          <VietnamText className="mb-4 text-sm text-gray-500">
            Công thức được tạo bởi AI dựa trên nguyên liệu bạn cung cấp.
          </VietnamText>

          {/* ── Nutrition cards (HARDCODED) ───────────────────── */}
          <View className="mb-4 flex-row rounded-2xl border border-gray-200">
            <NutritionStat value={HARDCODED.calories} label={t('recipeDetail.calories')} emoji="🔥" />
            <NutritionStat value={HARDCODED.protein} label={t('recipeDetail.protein')} emoji="💪" hasBorder />
            <NutritionStat value={HARDCODED.carbs} label={t('recipeDetail.carbs')} emoji="🌾" hasBorder />
            <NutritionStat value={HARDCODED.fats} label={t('recipeDetail.fats')} emoji="🥑" hasBorder />
          </View>

          {/* ── Meta info (HARDCODED) ─────────────────────────── */}
          <View className="mb-4 gap-2">
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">
                Thời gian:
              </VietnamText>
              <VietnamText className="text-sm text-gray-600">
                {HARDCODED.timeMinutes} {t('searchResults.minute')}
              </VietnamText>
            </View>

            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">
                Giá:
              </VietnamText>
              <VietnamText className="text-sm text-gray-600">{HARDCODED.cost}</VietnamText>
            </View>

            <View className="flex-row items-center gap-2">
              <VietnamText className="text-sm font-semibold text-gray-800">
                Ghi chú:
              </VietnamText>
              <VietnamText className="text-sm italic text-gray-500">{HARDCODED.note}</VietnamText>
            </View>
          </View>

          {/* ── Ingredients section (DYNAMIC từ AI) ──────────── */}
          <VietnamText className="mb-3 text-base font-bold text-gray-900">
            NGUYÊN LIỆU
          </VietnamText>

          {/* Serves counter (hardcoded, purely visual) */}
          <View className="mb-4 flex-row items-center gap-3">
            <View className="flex-row items-center gap-4 rounded-xl border border-gray-300 px-4 py-2">
              <TouchableOpacity onPress={() => setServes((c) => Math.max(1, c - 1))}>
                <Icon as={MinusIcon} size={18} />
              </TouchableOpacity>
              <VietnamText className="text-base font-medium text-gray-800">
                {t('other.serves')}:{' '}
                <VietnamText className="font-bold">{serves}</VietnamText>
              </VietnamText>
              <TouchableOpacity onPress={() => setServes((c) => c + 1)}>
                <Icon as={PlusIcon} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <VietnamText className="mb-2 text-sm text-gray-500">
            Nguyên liệu chính
          </VietnamText>

          {/* AI ingredients list */}
          {recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((item, index) => (
              <AIIngredientRow key={`${item.name}-${index}`} item={item} index={index} />
            ))
          ) : (
            <VietnamText className="mb-1 text-sm text-gray-500">
              Không có nguyên liệu.
            </VietnamText>
          )}

          {/* ── Steps section (DYNAMIC từ AI) ────────────────── */}
          <VietnamText className="mb-4 mt-6 text-base font-bold text-gray-900">
            CÁC BƯỚC NẤU
          </VietnamText>

          <View className="mb-4 rounded-2xl bg-amber-50 p-4">
            {displaySteps.length > 0 ? (
              displaySteps.map((step) => (
                <StepCard
                  key={step.id}
                  number={step.number}
                  text={step.text}
                  tip={step.tip}
                  isLast={step.isLast}
                />
              ))
            ) : (
              <VietnamText className="text-sm text-gray-500">
                Không có bước nấu.
              </VietnamText>
            )}
          </View>

          {/* ── Tips section (hardcoded) ──────────────────────── */}
          <View className="mb-5 rounded-2xl bg-amber-50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <VietnamText className="text-xl">💡</VietnamText>
              <VietnamText className="text-base font-bold text-gray-900">
                {t('other.tips')}
              </VietnamText>
            </View>
            <View className="gap-2">
              <VietnamText className="text-sm leading-relaxed text-gray-600">
                • {HARDCODED.note}
              </VietnamText>
              <VietnamText className="text-sm leading-relaxed text-gray-600">
                • Điều chỉnh gia vị theo khẩu vị cá nhân.
              </VietnamText>
              <VietnamText className="text-sm leading-relaxed text-gray-600">
                • Ưu tiên nguyên liệu tươi để hương vị tốt nhất.
              </VietnamText>
            </View>
          </View>

          <View className="h-24" />
        </View>
      </ScrollView>

      {/* ── Bottom action bar ─────────────────────────────────── */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-3 border-t border-gray-100 bg-background px-4 py-3">
        <CircleButton variant="outline" size="icon" className="h-14 w-14">
          <Icon as={ShareIcon} size={20} />
        </CircleButton>

        {recipeIsSaved ? (
          <RoundedButton
            className="flex-1"
            size="lg"
            onPress={() => {
              if (savedAiId) {
                router.push({
                  pathname: '/(tabs)/cooking-ingredients',
                  params: {
                    recipeId: savedAiId,
                    serves: String(serves),
                    baseServes: String(HARDCODED.defaultServes),
                  },
                });
              } else {
                router.replace('/(tabs)');
              }
            }}>
            <View className="h-8 w-8 items-center justify-center rounded-full">
              <Icon as={PlayIcon} size={16} color="white" />
            </View>
            <VietnamText className="text-lg font-bold text-white">Bắt đầu nấu</VietnamText>
          </RoundedButton>
        ) : (
          <RoundedButton className="flex-1" size="lg" onPress={handleSaveRecipe}>
            <View className="h-8 w-8 items-center justify-center rounded-full">
              <Icon as={Bookmark} size={16} color="white" />
            </View>
            <VietnamText className="text-lg font-bold text-white">Lưu công thức</VietnamText>
          </RoundedButton>
        )}
      </View>
    </SafeAreaView>
  );
}
