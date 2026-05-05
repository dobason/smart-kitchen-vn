import { AIAddIngredientButton } from '@/components/in-app-ui/ai-add-ingredient-button';
import { IngredientGridItem } from '@/components/in-app-ui/ingredient-grid-item';
import { AISectionTitle } from '@/components/in-app-ui/ai-section-title';
import { AISelectableChip } from '@/components/in-app-ui/ai-selectable-chip';
import { AITimeOptionChip } from '@/components/in-app-ui/ai-time-option-chip';
import { ShinyButton } from '@/components/in-app-ui/shiny-button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { ALLERGEN_FREE_OPTIONS } from '@/constants/aiRecipeOptions';
import { getIngredientDisplayName, getIngredientsByIds } from '@/constants/ingredientData';
import { Icon } from '@/components/ui/icon';
import { useIngredients } from '@/hooks/use-ingredients';
import { useLocale } from '@/hooks/use-locale';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAllIngredients } from '@/hooks/use-top-ingredients';
import { IngredientApiItem, IngredientItem } from '@/types/ingredient';
import { useAIRecipeContext } from '@/context/ai-recipe-context';
import { useTags } from '@/hooks/use-tags';

function toggleInList(value: string, current: string[]) {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }
  return [...current, value];
}

function toIngredientItem(item: IngredientApiItem): IngredientItem {
  return {
    id: String(item.id),
    name: item.name ?? '',
    emoji: item.emoji ?? item.icon ?? '🥘',
    bgColor: item.bgColor ?? '#F3F4F6',
  };
}

export default function AIRecipeScreen() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { aiIngredientIds, setAiIngredientIds } = useIngredients();

  // Context chứa mutation useGenerateRecipe — dùng chung với recipe-generating screen
  const { generate, isPending, reset } = useAIRecipeContext();

  const { ingredients: allIngredients } = useAllIngredients();

  const selectedIngredients = React.useMemo<IngredientItem[]>(() => {
    return aiIngredientIds
      .map((id) => {
        const fromApi = allIngredients.find((item) => String(item.id) === String(id));
        if (fromApi) {
          return toIngredientItem(fromApi);
        }

        return getIngredientsByIds([id])[0];
      })
      .filter((ingredient): ingredient is IngredientItem => Boolean(ingredient));
  }, [aiIngredientIds, allIngredients]);

  const { tags, isLoading: isTagsLoading } = useTags();

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
    if (!canGenerate || isPending) return;

    // Đặt lại kết quả cũ trước khi sinh công thức mới
    reset();

    // Lấy tên hiển thị của các nguyên liệu đã chọn
    const ingredientNames = selectedIngredients.map((i) =>
      getIngredientDisplayName(i, locale)
    );

    // Lấy tên các tag đã chọn để gửi lên AI Server dưới dạng text
    const getTagNames = (ids: string[]) =>
      ids
        .map((id) => tags.find((tag) => String(tag.id) === id)?.name ?? '')
        .filter(Boolean)
        .join(', ');

    // Xây dựng preference từ các lựa chọn trên màn hình
    const preference = {
      ...(selectedDiet.length > 0 && { dietary_restrictions: getTagNames(selectedDiet) }),
      ...(selectedCuisine.length > 0 && { cuisine_preferences: getTagNames(selectedCuisine) }),
      ...(selectedAllergenFree.length > 0 && {
        flavor_profiles: selectedAllergenFree.join(', '),
      }),
      ...(selectedTime && { time_constraints: `${selectedTime} minutes` }),
      ...((extraCommand.trim() || selectedCookware.length > 0 || selectedDishTypes.length > 0) && {
        specific_note: [
          selectedCookware.length > 0 && `Cookware: ${getTagNames(selectedCookware)}`,
          selectedDishTypes.length > 0 && `Dish type: ${getTagNames(selectedDishTypes)}`,
          extraCommand.trim() && extraCommand.trim(),
        ]
          .filter(Boolean)
          .join('. '),
      }),
    };

    // Gọi API — kết quả sẽ có trong context.recipe sau khi thành công
    generate(
      {
        ingredients: ingredientNames,
        preference: Object.keys(preference).length > 0 ? preference : undefined,
        language: locale === 'vi' ? 'vi' : 'en',
      },
      {
        onSuccess: () => {
          // Sau khi API trả về thành công, navigate sang màn hình kết quả
          router.replace('./recipe-generating');
        },
        onError: () => {
          // Vẫn navigate để màn hình generating hiển thị lỗi
          router.replace('./recipe-generating');
        },
      }
    );

    // Navigate ngay để hiển thị animation trong khi chờ API
    router.push('./recipe-generating');
  }

  function handleClose() {
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <Pressable onPress={handleClose} className="h-10 w-10 items-start justify-center">
          <Icon as={X} size={30} className="text-[#111827]" />
        </Pressable>

        <VietnamText className="text-[24px] font-bold text-[#08090A]">
          {t('aiRecipe.title')}
        </VietnamText>
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
                  setAiIngredientIds((prev) =>
                    prev.filter((id) => String(id) !== String(ingredient.id))
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {isTagsLoading ? (
          <View className="mt-10 flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#CE232A" />
          </View>
        ) : (
          <>
            <AISectionTitle title={t('aiRecipe.selectCookware')} className="mt-7" />
            <View className="mt-3 flex-row flex-wrap gap-2.5">
              {tags
                .filter((t) => t.category === 'Cookware')
                .map((item) => (
                  <AISelectableChip
                    key={item.id}
                    label={item.name}
                    emoji={item.emoji}
                    selected={selectedCookware.includes(String(item.id))}
                    onPress={() =>
                      setSelectedCookware((prev) => toggleInList(String(item.id), prev))
                    }
                  />
                ))}
            </View>

            <AISectionTitle title={t('aiRecipe.dishType')} className="mt-7" />
            <View className="mt-3 flex-row flex-wrap gap-2.5">
              {tags
                .filter((t) => t.category === 'Dish Type')
                .map((item) => (
                  <AISelectableChip
                    key={item.id}
                    label={item.name}
                    emoji={item.emoji}
                    selected={selectedDishTypes.includes(String(item.id))}
                    onPress={() =>
                      setSelectedDishTypes((prev) => toggleInList(String(item.id), prev))
                    }
                  />
                ))}
            </View>

            <AISectionTitle title={t('aiRecipe.diet')} className="mt-7" />
            <View className="mt-3 flex-row flex-wrap gap-2.5">
              {tags
                .filter((t) => t.category === 'Diet')
                .map((item) => (
                  <AISelectableChip
                    key={item.id}
                    label={item.name}
                    emoji={item.emoji}
                    selected={selectedDiet.includes(String(item.id))}
                    onPress={() => setSelectedDiet((prev) => toggleInList(String(item.id), prev))}
                  />
                ))}
            </View>

            <AISectionTitle title={t('aiRecipe.cuisine')} className="mt-7" />
            <View className="mt-3 flex-row flex-wrap gap-2.5">
              {tags
                .filter((t) => t.category === 'Cuisine')
                .map((item) => (
                  <AISelectableChip
                    key={item.id}
                    label={item.name}
                    emoji={item.emoji}
                    selected={selectedCuisine.includes(String(item.id))}
                    onPress={() =>
                      setSelectedCuisine((prev) => toggleInList(String(item.id), prev))
                    }
                  />
                ))}
            </View>

            <AISectionTitle title={t('aiRecipe.time')} className="mt-7" />
            <View className="mt-3 flex-row flex-wrap gap-2.5">
              {tags
                .filter((t) => t.category === 'Time')
                .map((item) => (
                  <AISelectableChip
                    key={item.id}
                    label={item.name}
                    emoji={item.emoji}
                    selected={selectedTime === String(item.id)}
                    onPress={() =>
                      setSelectedTime((prev) => (prev === String(item.id) ? null : String(item.id)))
                    }
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
          </>
        )}
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
