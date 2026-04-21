import { IngredientConfirmPanel } from '@/components/in-app-ui/ingredient-confirm-panel';
import { IngredientGridItem } from '@/components/in-app-ui/ingredient-grid-item';
import { IngredientSearchInput } from '@/components/in-app-ui/ingredient-search-input';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useIngredients } from '@/hooks/use-ingredients';
import { useLocale } from '@/hooks/use-locale';
import { useAllIngredients } from '@/hooks/use-top-ingredients';
import { IngredientItem } from '@/types/ingredient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function toggleInList(value: string, current: string[]) {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }
  return [...current, value];
}

export default function IngredientsPickerScreen() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const params = useLocalSearchParams<{ target?: string }>();
  const isAITarget = params.target === 'ai';

  const { exploreIngredientIds, setExploreIngredientIds, aiIngredientIds, setAiIngredientIds } =
    useIngredients();

  const baseIngredientIds = isAITarget ? aiIngredientIds : exploreIngredientIds;
  const setBaseIngredientIds = isAITarget ? setAiIngredientIds : setExploreIngredientIds;

  const [query, setQuery] = React.useState('');
  const [draftSelectedIds, setDraftSelectedIds] = React.useState<string[]>(baseIngredientIds);

  React.useEffect(() => {
    setDraftSelectedIds(baseIngredientIds);
  }, [baseIngredientIds]);

  const { ingredients: rawIngredients = [], isLoading: allLoading } = useAllIngredients();

  const allIngredients = React.useMemo<IngredientItem[]>(() => {
    return rawIngredients.map((item) => ({
      id: String(item.id),
      name: item.name ?? '',
      emoji: item.emoji ?? item.icon ?? '🥘',
      bgColor: item.bgColor ?? '#F3F4F6',
    }));
  }, [rawIngredients]);

  const filteredIngredients = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return allIngredients;

    return allIngredients.filter((item) => {
      return item.name.toLowerCase().includes(normalizedQuery);
    });
  }, [query, allIngredients]);

  const selectedIngredients = React.useMemo(
    () => allIngredients.filter((item) => draftSelectedIds.includes(item.id)),
    [draftSelectedIds, allIngredients]
  );

  function handleClose() {
    if (isAITarget) {
      router.replace('/ai-recipe');
      return;
    }

    router.replace('/(tabs)');
  }

  function handleConfirm() {
    setBaseIngredientIds(draftSelectedIds);
    handleClose();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pb-2 pt-2">
        <Pressable onPress={handleClose} className="h-11 w-11 items-start justify-center pt-1">
          <Icon as={X} size={34} className="text-[#111827]" />
        </Pressable>

        <VietnamText className="flex-1 text-center text-[24px] font-bold text-[#08090A]">
          {t('ingredientsPicker.title')}
        </VietnamText>
        <View className="h-11 w-11" />
      </View>

      <View className="px-4 pt-1">
        <IngredientSearchInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('ingredientsPicker.searchPlaceholder')}
          className="h-[56px] rounded-[28px] border-[#E5E7EB] bg-[#F3F4F6]"
        />
      </View>

      <View className="h-3" />

      <ScrollView
        className="flex-1"
        contentContainerClassName={
          selectedIngredients.length > 0 ? 'px-4 pb-[290px]' : 'px-4 pb-7'
        }>
        {/* ── FULL API LIBRARY ─────────────────────────────────── */}
        <VietnamText className="mt-7 text-[20px] font-bold text-[#08090A]">
          {t('ingredientsPicker.youMightHave')}
        </VietnamText>

        <View className="mt-5 flex-row flex-wrap">
          {allLoading ? (
            <View className="h-20 w-full items-center justify-center">
              <ActivityIndicator size="small" color="#CE232A" />
            </View>
          ) : (
            filteredIngredients.map((ingredient) => (
              <View key={ingredient.id} className="mb-7 w-1/4 items-center">
                <IngredientGridItem
                  ingredient={{
                    id: ingredient.id,
                    name: ingredient.name,
                    emoji: ingredient.emoji,
                    bgColor: ingredient.bgColor,
                  }}
                  size={72}
                  label={ingredient.name}
                  selected={draftSelectedIds.includes(ingredient.id)}
                  onPress={() => setDraftSelectedIds((prev) => toggleInList(ingredient.id, prev))}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {selectedIngredients.length > 0 ? (
        <View className="absolute bottom-0 left-0 right-0">
          <IngredientConfirmPanel
            selectedIngredients={selectedIngredients}
            title={t('ingredientsPicker.selected', { count: selectedIngredients.length })}
            confirmLabel={t('ingredientsPicker.confirm')}
            onRemove={(ingredientId) =>
              setDraftSelectedIds((prev) => prev.filter((id) => id !== ingredientId))
            }
            onConfirm={handleConfirm}
            accentColor="#CE232A"
            getIngredientLabel={(ingredient) => ingredient.name}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
