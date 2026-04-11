import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useLocale } from '@/hooks/use-locale';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Search, X } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AddRecipesParams = {
  cookbookId?: string | string[];
};

function singleParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function normalizeRecipeSearchText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export default function AddRecipesToCookbookScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const params = useLocalSearchParams<AddRecipesParams>();
  const {
    uncategorizedCookbookId,
    getRecipesByCookbook,
    assignRecipesToCookbook,
    getRecipeCookbookIds,
    getCookbookById,
  } = useSavedRecipes();

  const targetCookbookId = singleParam(params.cookbookId) ?? uncategorizedCookbookId;
  const targetCookbook = getCookbookById(targetCookbookId);
  const uncategorizedRecipes = getRecipesByCookbook(uncategorizedCookbookId);

  const selectedFromTargetIds = React.useMemo(
    () =>
      uncategorizedRecipes
        .filter((recipe) => getRecipeCookbookIds(recipe.id).includes(targetCookbookId))
        .map((recipe) => recipe.id),
    [getRecipeCookbookIds, targetCookbookId, uncategorizedRecipes]
  );
  const selectedFromTargetKey = React.useMemo(
    () => selectedFromTargetIds.join('|'),
    [selectedFromTargetIds]
  );

  const [query, setQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>(selectedFromTargetIds);

  React.useEffect(() => {
    setSelectedIds(selectedFromTargetIds);
  }, [targetCookbookId, selectedFromTargetKey]);

  const filteredRecipes = React.useMemo(() => {
    const normalizedQuery = normalizeRecipeSearchText(query);

    if (!normalizedQuery) {
      return uncategorizedRecipes;
    }

    return uncategorizedRecipes.filter((recipe) => {
      const normalizedName = normalizeRecipeSearchText(recipe.name);
      const normalizedDescription = normalizeRecipeSearchText(recipe.description);
      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery)
      );
    });
  }, [query, uncategorizedRecipes]);

  const isAllSelected =
    filteredRecipes.length > 0 && filteredRecipes.every((recipe) => selectedIds.includes(recipe.id));

  function toggleSelection(recipeId: string) {
    setSelectedIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  }

  function handleSelectAll() {
    if (isAllSelected) {
      const filteredIds = new Set(filteredRecipes.map((recipe) => recipe.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredRecipes.forEach((recipe) => next.add(recipe.id));
      return Array.from(next);
    });
  }

  function handleClose() {
    router.replace({
      pathname: '/(tabs)/cookbook-detail',
      params: {
        id: targetCookbookId,
        name: targetCookbook?.name ?? '',
      },
    } as any);
  }

  function handleAdd() {
    if (selectedIds.length === 0) {
      return;
    }

    assignRecipesToCookbook(selectedIds, targetCookbookId);
    handleClose();
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFF4F5]">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="mx-3 mt-2 flex-1 rounded-[28px] border border-[#F2D0D3] bg-white px-4 pt-4 shadow-sm">
        <View className="mb-4 flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center rounded-full border border-[#F6CBD0] bg-[#FFF2F3] px-4 py-2.5">
            <Icon as={Search} size={24} className="text-[#8B8B93]" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={String(t('searchResults.searchPlaceholder'))}
              className="ml-2 flex-1 text-base font-medium text-[#1C1C1E]"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Pressable
            onPress={handleClose}
            className="h-9 w-9 items-center justify-center rounded-full bg-[#FFE8EA]">
            <Icon as={X} size={18} className="text-[#CE232A]" />
          </Pressable>
        </View>

        <VietnamText className="mb-3 text-[30px] font-black text-[#1C1C1E]">
          {t('cookbookDetail.total')} {filteredRecipes.length}
        </VietnamText>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          <View className="flex-row flex-wrap justify-between">
            {filteredRecipes.map((recipe) => {
              const isSelected = selectedIds.includes(recipe.id);

              return (
                <Pressable
                  key={recipe.id}
                  onPress={() => toggleSelection(recipe.id)}
                  style={{ width: '48.5%', marginBottom: 16 }}
                  className="relative">
                  <View pointerEvents="none">
                    <RecipeCard item={recipe} isSaved={true} onToggleSave={() => {}} showSaveButton={false} />
                  </View>

                  <View
                    className={`absolute right-3 top-3 h-7 w-7 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? 'border-[#CE232A] bg-[#CE232A]'
                        : 'border-[#D1D5DB] bg-white/90'
                    }`}>
                    {isSelected ? <Icon as={Check} size={14} className="text-white" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-[#F2D0D3] bg-white px-6 pb-10 pt-4">
        <Pressable onPress={handleSelectAll} className="flex-row items-center gap-3">
          <View
            className={`h-7 w-7 items-center justify-center rounded-full border-2 ${
              isAllSelected ? 'border-[#CE232A] bg-[#CE232A]' : 'border-[#9CA3AF] bg-white'
            }`}>
            {isAllSelected ? <Icon as={Check} size={14} className="text-white" /> : null}
          </View>
          <VietnamText className="text-base font-semibold text-[#1C1C1E]">
            {t('cookbookDetail.selectAll')}
          </VietnamText>
        </Pressable>

        <Pressable
          onPress={handleAdd}
          disabled={selectedIds.length === 0}
          className={`min-w-[180px] items-center rounded-full px-10 py-3.5 ${
            selectedIds.length > 0 ? 'bg-[#CE232A]' : 'bg-[#E3A4A8]'
          }`}>
          <VietnamText className="text-lg font-bold text-white">{t('aiRecipe.add')}</VietnamText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
