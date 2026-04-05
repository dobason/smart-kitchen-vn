import { AIAddIngredientButton } from '@/components/in-app-ui/ai-add-ingredient-button';
import { IngredientGridItem } from '@/components/in-app-ui/ingredient-grid-item';
import { AISectionTitle } from '@/components/in-app-ui/ai-section-title';
import { AISelectableChip } from '@/components/in-app-ui/ai-selectable-chip';
import { AITimeOptionChip } from '@/components/in-app-ui/ai-time-option-chip';
import { ShinyButton } from '@/components/in-app-ui/shiny-button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { getIngredientDisplayName, getIngredientsByIds } from '@/constants/ingredientData';
import { Icon } from '@/components/ui/icon';
import { useIngredients } from '@/hooks/use-ingredients';
import { useLocale } from '@/hooks/use-locale';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AIOption = {
  id: string;
  labelKey: string;
  emoji: string;
};

const COOKWARE_OPTIONS: AIOption[] = [
  { id: 'frying-pan', labelKey: 'aiRecipe.options.cookware.fryingPan', emoji: '🍳' },
  { id: 'skillet', labelKey: 'aiRecipe.options.cookware.skillet', emoji: '🍳' },
  { id: 'microwave', labelKey: 'aiRecipe.options.cookware.microwave', emoji: '📟' },
  { id: 'air-fryer', labelKey: 'aiRecipe.options.cookware.airFryer', emoji: '🍟' },
  { id: 'oven', labelKey: 'aiRecipe.options.cookware.oven', emoji: '♨️' },
  { id: 'blender', labelKey: 'aiRecipe.options.cookware.blender', emoji: '🥤' },
  { id: 'slow-cooker', labelKey: 'aiRecipe.options.cookware.slowCooker', emoji: '🍲' },
];

const DISH_TYPE_OPTIONS: AIOption[] = [
  { id: 'breakfast', labelKey: 'aiRecipe.options.dishType.breakfast', emoji: '🥐' },
  { id: 'lunch', labelKey: 'aiRecipe.options.dishType.lunch', emoji: '🥪' },
  { id: 'dinner', labelKey: 'aiRecipe.options.dishType.dinner', emoji: '🍜' },
  { id: 'snack', labelKey: 'aiRecipe.options.dishType.snack', emoji: '🍿' },
  { id: 'dessert', labelKey: 'aiRecipe.options.dishType.dessert', emoji: '🍰' },
  { id: 'drink', labelKey: 'aiRecipe.options.dishType.drink', emoji: '🍹' },
];

const DIET_OPTIONS: AIOption[] = [
  { id: 'vegan', labelKey: 'aiRecipe.options.diet.vegan', emoji: '🥕' },
  { id: 'vegetarian', labelKey: 'aiRecipe.options.diet.vegetarian', emoji: '🥗' },
  { id: 'keto', labelKey: 'aiRecipe.options.diet.ketoFriendly', emoji: '🥑' },
  { id: 'low-carb', labelKey: 'aiRecipe.options.diet.lowCarb', emoji: '🥬' },
  { id: 'low-calorie', labelKey: 'aiRecipe.options.diet.lowCalorie', emoji: '🥒' },
  { id: 'low-fat', labelKey: 'aiRecipe.options.diet.lowFat', emoji: '🚫' },
  { id: 'high-protein', labelKey: 'aiRecipe.options.diet.highProtein', emoji: '💪' },
  { id: 'high-fiber', labelKey: 'aiRecipe.options.diet.highFiber', emoji: '🌾' },
  { id: 'pet-food', labelKey: 'aiRecipe.options.diet.petFood', emoji: '🐾' },
];

const CUISINE_OPTIONS: AIOption[] = [
  { id: 'american', labelKey: 'aiRecipe.options.cuisine.american', emoji: '🍔' },
  { id: 'mexican', labelKey: 'aiRecipe.options.cuisine.mexican', emoji: '🌮' },
  { id: 'chinese', labelKey: 'aiRecipe.options.cuisine.chinese', emoji: '🥟' },
  { id: 'italian', labelKey: 'aiRecipe.options.cuisine.italian', emoji: '🍕' },
  { id: 'japanese', labelKey: 'aiRecipe.options.cuisine.japanese', emoji: '🍱' },
  { id: 'korean', labelKey: 'aiRecipe.options.cuisine.korean', emoji: '🍲' },
  { id: 'spicy', labelKey: 'aiRecipe.options.cuisine.spicy', emoji: '🌶️' },
  { id: 'sweet', labelKey: 'aiRecipe.options.cuisine.sweet', emoji: '🍯' },
  { id: 'savory', labelKey: 'aiRecipe.options.cuisine.savory', emoji: '🧂' },
];

const ALLERGEN_FREE_OPTIONS: AIOption[] = [
  { id: 'nut-free', labelKey: 'aiRecipe.options.allergenFree.nutFree', emoji: '🥜' },
  { id: 'egg-free', labelKey: 'aiRecipe.options.allergenFree.eggFree', emoji: '🥚' },
  { id: 'soy-free', labelKey: 'aiRecipe.options.allergenFree.soyFree', emoji: '🫛' },
  {
    id: 'shellfish-free',
    labelKey: 'aiRecipe.options.allergenFree.shellfishFree',
    emoji: '🦐',
  },
];

const TIME_OPTIONS = [
  { id: '15', labelKey: 'aiRecipe.options.time.lt15', emoji: '⏱️' },
  { id: '30', labelKey: 'aiRecipe.options.time.lt30', emoji: '⏱️' },
  { id: '60', labelKey: 'aiRecipe.options.time.lt60', emoji: '⏱️' },
];

function toggleInList(value: string, current: string[]) {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }
  return [...current, value];
}

export default function AIRecipeScreen() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { aiIngredientIds, setAiIngredientIds } = useIngredients();

  const selectedIngredients = React.useMemo(
    () => getIngredientsByIds(aiIngredientIds),
    [aiIngredientIds]
  );

  const [selectedCookware, setSelectedCookware] = React.useState<string[]>([]);
  const [selectedDishTypes, setSelectedDishTypes] = React.useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = React.useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = React.useState<string[]>([]);
  const [selectedAllergenFree, setSelectedAllergenFree] = React.useState<string[]>([]);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [extraCommand, setExtraCommand] = React.useState('');

  const canGenerate =
    aiIngredientIds.length > 0 ||
    selectedCookware.length > 0 ||
    selectedDishTypes.length > 0 ||
    selectedDiet.length > 0 ||
    selectedCuisine.length > 0 ||
    selectedAllergenFree.length > 0 ||
    selectedTime !== null ||
    extraCommand.trim().length > 0;

  function handleAddIngredient() {
    router.push({
      pathname: './ingredients-picker',
      params: { target: 'ai' },
    });
  }

  function handleGenerateRecipe() {
    if (!canGenerate) {
      return;
    }

    Alert.alert(t('aiRecipe.generatingTitle'), t('aiRecipe.generatingDescription'));
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <Pressable onPress={() => router.back()} className="h-10 w-10 items-start justify-center">
          <Icon as={X} size={30} className="text-[#111827]" />
        </Pressable>

        <VietnamText className="text-[24px] font-bold text-[#08090A]">{t('aiRecipe.title')}</VietnamText>
        <View className="h-10 w-10" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-6">
        <AISectionTitle title={t('aiRecipe.ingredient')} className="mt-2" />
        <View className="mt-3 flex-row items-start gap-3">
          <AIAddIngredientButton
            label={t('aiRecipe.add')}
            onPress={handleAddIngredient}
            tone="red"
            size={62}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1"
            contentContainerClassName="items-start gap-3 pr-2 pt-1">
            {selectedIngredients.map((ingredient) => (
              <IngredientGridItem
                key={ingredient.id}
                ingredient={ingredient}
                size={62}
                label={getIngredientDisplayName(ingredient, locale)}
                onRemove={() =>
                  setAiIngredientIds((prev) => prev.filter((id) => id !== ingredient.id))
                }
              />
            ))}
          </ScrollView>
        </View>

        <AISectionTitle title={t('aiRecipe.selectCookware')} className="mt-7" />
        <View className="mt-3 flex-row flex-wrap gap-2.5">
          {COOKWARE_OPTIONS.map((item) => (
            <AISelectableChip
              key={item.id}
              label={String(t(item.labelKey))}
              emoji={item.emoji}
              selected={selectedCookware.includes(item.id)}
              onPress={() => setSelectedCookware((prev) => toggleInList(item.id, prev))}
            />
          ))}
        </View>

        <AISectionTitle title={t('aiRecipe.dishType')} className="mt-7" />
        <View className="mt-3 flex-row flex-wrap gap-2.5">
          {DISH_TYPE_OPTIONS.map((item) => (
            <AISelectableChip
              key={item.id}
              label={String(t(item.labelKey))}
              emoji={item.emoji}
              selected={selectedDishTypes.includes(item.id)}
              onPress={() => setSelectedDishTypes((prev) => toggleInList(item.id, prev))}
            />
          ))}
        </View>

        <AISectionTitle title={t('aiRecipe.diet')} className="mt-7" />
        <View className="mt-3 flex-row flex-wrap gap-2.5">
          {DIET_OPTIONS.map((item) => (
            <AISelectableChip
              key={item.id}
              label={String(t(item.labelKey))}
              emoji={item.emoji}
              selected={selectedDiet.includes(item.id)}
              onPress={() => setSelectedDiet((prev) => toggleInList(item.id, prev))}
            />
          ))}
        </View>

        <AISectionTitle title={t('aiRecipe.cuisine')} className="mt-7" />
        <View className="mt-3 flex-row flex-wrap gap-2.5">
          {CUISINE_OPTIONS.map((item) => (
            <AISelectableChip
              key={item.id}
              label={String(t(item.labelKey))}
              emoji={item.emoji}
              selected={selectedCuisine.includes(item.id)}
              onPress={() => setSelectedCuisine((prev) => toggleInList(item.id, prev))}
            />
          ))}
        </View>

        <AISectionTitle title={t('aiRecipe.time')} className="mt-7" />
        <View className="mt-3 flex-row justify-between">
          {TIME_OPTIONS.map((item) => (
            <AITimeOptionChip
              key={item.id}
              label={String(t(item.labelKey))}
              emoji={item.emoji}
              selected={selectedTime === item.id}
              onPress={() => setSelectedTime((prev) => (prev === item.id ? null : item.id))}
            />
          ))}
        </View>

        <AISectionTitle title={t('aiRecipe.allergenFree')} className="mt-7" />
        <View className="mt-3 flex-row flex-wrap gap-2.5">
          {ALLERGEN_FREE_OPTIONS.map((item) => (
            <AISelectableChip
              key={item.id}
              label={String(t(item.labelKey))}
              emoji={item.emoji}
              selected={selectedAllergenFree.includes(item.id)}
              onPress={() => setSelectedAllergenFree((prev) => toggleInList(item.id, prev))}
            />
          ))}
        </View>

        <AISectionTitle title={t('aiRecipe.extraCommand')} className="mt-7" />
        <View className="mb-5 mt-3 rounded-2xl border border-[#E6E8EC] bg-[#F5F7F8] px-4 py-3">
          <TextInput
            value={extraCommand}
            onChangeText={setExtraCommand}
            multiline
            textAlignVertical="top"
            placeholder={t('aiRecipe.extraPlaceholder')}
            placeholderTextColor="#9CA3AF"
            className="min-h-[44px] text-[17px] leading-6 text-[#111827]"
          />
        </View>
      </ScrollView>

      <View className="border-t border-[#E6E8EC] bg-white px-4 pb-4 pt-3">
        <ShinyButton
          disabled={!canGenerate}
          onPress={handleGenerateRecipe}
          className={
            canGenerate
              ? 'h-14 border-[#CE232A] bg-[#CE232A]'
              : 'h-14 border-[#E3A2A6] bg-[#E3A2A6]'
          }>
          <VietnamText className="w-full text-center text-[20px] font-semibold text-white">
            {t('aiRecipe.generate')}
          </VietnamText>
        </ShinyButton>
      </View>
    </SafeAreaView>
  );
}
