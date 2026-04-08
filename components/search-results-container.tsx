import { SearchFilterChip } from '@/components/in-app-ui/search-filter-chip';
import { SearchQueryBar } from '@/components/in-app-ui/search-query-bar';
import { SearchRecipeCard } from '@/components/in-app-ui/search-recipe-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import {
  SEARCH_CALORIES_FILTER_OPTIONS,
  SEARCH_COOKWARE_FILTER_OPTIONS,
  SEARCH_TAG_OPTIONS,
  SEARCH_TIME_FILTER_OPTIONS,
} from '@/constants/searchFilterOptions';
import { SEARCH_RECIPES } from '@/constants/recipeData';
import { Icon } from '@/components/ui/icon';
import { useLocale } from '@/hooks/use-locale';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BrushCleaning, X } from 'lucide-react-native';
import * as React from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function normalizeSearchText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function splitSearchTerms(value: string) {
  return value
    .split(',')
    .map((part) => normalizeSearchText(part))
    .filter(Boolean);
}

type CookingTimeSheetProps = {
  visible: boolean;
  selectedMaxMinutes: number | null;
  onSelect: (maxMinutes: number | null) => void;
  onApply: () => void;
  onClose: () => void;
};

type CaloriesFilterSheetProps = {
  visible: boolean;
  selectedMaxCalories: number | null;
  onSelect: (maxCalories: number | null) => void;
  onApply: () => void;
  onClose: () => void;
};

type TagFilterSheetProps = {
  visible: boolean;
  selectedTags: string[];
  onApply: (tags: string[]) => void;
  onClose: () => void;
};

type CookwareFilterSheetProps = {
  visible: boolean;
  selectedCookware: string[];
  onApply: (cookware: string[]) => void;
  onClose: () => void;
};

function TagFilterSheet({ visible, selectedTags, onApply, onClose }: TagFilterSheetProps) {
  const { t } = useLocale();
  const [pendingTags, setPendingTags] = React.useState<string[]>(selectedTags);

  React.useEffect(() => {
    if (visible) setPendingTags(selectedTags);
  }, [visible, selectedTags]);

  function toggleTag(tag: string) {
    setPendingTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function handleApply() {
    onApply(pendingTags);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <View className="absolute bottom-0 left-0 right-0 max-h-[80%] rounded-t-3xl bg-[#F5F5F6] pb-10 pt-4 shadow-2xl">
        <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-[#D1D1D6]" />

        <View className="mb-5 flex-row items-center justify-between px-5">
          <VietnamText className="text-2xl font-bold text-[#1C1C1E]">
            {t('searchResults.tagSheetTitle')}
          </VietnamText>
          <TouchableOpacity
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
            <Icon as={X} size={18} className="text-[#1C1C1E]" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <View className="flex-row flex-wrap gap-3">
            {SEARCH_TAG_OPTIONS.map((tagOption) => {
              const isSelected = pendingTags.includes(tagOption.value);
              return (
                <TouchableOpacity
                  key={tagOption.value}
                  onPress={() => toggleTag(tagOption.value)}
                  activeOpacity={0.7}
                  className={`rounded-full px-4 py-2.5 ${
                    isSelected ? 'border border-[#CE232A] bg-[#CE232A]' : 'border border-[#E5E5EA] bg-white'
                  }`}>
                  <VietnamText
                    className={`text-[15px] font-medium ${
                      isSelected ? 'text-white' : 'text-[#1C1C1E]'
                    }`}>
                    {t(tagOption.labelKey)}
                  </VietnamText>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="bg-[#F5F5F6] px-5 pt-4">
          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.85}
            className="items-center justify-center rounded-full bg-[#CE232A] py-4 shadow-sm">
            <VietnamText className="text-lg font-bold text-white">
              {t('searchResults.apply')}
            </VietnamText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function CookingTimeSheet({
  visible,
  selectedMaxMinutes,
  onSelect,
  onApply,
  onClose,
}: CookingTimeSheetProps) {
  const { t } = useLocale();
  const [pending, setPending] = React.useState<number | null>(selectedMaxMinutes);

  React.useEffect(() => {
    if (visible) setPending(selectedMaxMinutes);
  }, [visible, selectedMaxMinutes]);

  function handleApply() {
    onSelect(pending);
    onApply();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl">
        <View className="mb-4 h-1 w-10 self-center rounded-full bg-[#E0E0E0]" />

        <View className="mb-5 flex-row items-center justify-between">
          <VietnamText className="text-2xl font-bold text-[#1C1C1E]">
            {t('searchResults.timeSheetTitle')}
          </VietnamText>
          <TouchableOpacity
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F2]">
            <Icon as={X} size={16} className="text-[#1C1C1E]" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 gap-y-3">
          {SEARCH_TIME_FILTER_OPTIONS.map((opt) => {
            const isSelected = pending === opt.maxMinutes;
            return (
              <TouchableOpacity
                key={opt.maxMinutes}
                onPress={() => setPending(isSelected ? null : opt.maxMinutes)}
                activeOpacity={0.7}
                className={`flex-row items-center justify-between rounded-2xl px-4 py-4 ${
                  isSelected ? 'bg-[#FFF4F4]' : 'bg-[#F7F7F7]'
                }`}>
                <VietnamText className="text-base font-semibold text-[#1C1C1E]">
                  {t(opt.labelKey)}
                </VietnamText>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-[#CE232A]' : 'border-[#D1D1D6]'
                  }`}>
                  {isSelected && <View className="h-3 w-3 rounded-full bg-[#CE232A]" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleApply}
          activeOpacity={0.85}
          className="items-center rounded-2xl bg-[#CE232A] py-4">
          <VietnamText className="text-base font-bold text-white">{t('searchResults.apply')}</VietnamText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function CaloriesFilterSheet({
  visible,
  selectedMaxCalories,
  onSelect,
  onApply,
  onClose,
}: CaloriesFilterSheetProps) {
  const { t } = useLocale();
  const [pending, setPending] = React.useState<number | null>(selectedMaxCalories);

  React.useEffect(() => {
    if (visible) setPending(selectedMaxCalories);
  }, [visible, selectedMaxCalories]);

  function handleApply() {
    onSelect(pending);
    onApply();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl">
        <View className="mb-4 h-1 w-10 self-center rounded-full bg-[#E0E0E0]" />

        <View className="mb-5 flex-row items-center justify-between">
          <VietnamText className="text-2xl font-bold text-[#1C1C1E]">
            {t('searchResults.caloriesSheetTitle')}
          </VietnamText>
          <TouchableOpacity
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F2]">
            <Icon as={X} size={16} className="text-[#1C1C1E]" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 gap-y-3">
          {SEARCH_CALORIES_FILTER_OPTIONS.map((opt) => {
            const isSelected = pending === opt.maxCalories;
            return (
              <TouchableOpacity
                key={opt.maxCalories}
                onPress={() => setPending(isSelected ? null : opt.maxCalories)}
                activeOpacity={0.7}
                className={`flex-row items-center justify-between rounded-2xl px-4 py-4 ${
                  isSelected ? 'bg-[#FFF4F4]' : 'bg-[#F7F7F7]'
                }`}>
                <VietnamText className="text-base font-semibold text-[#1C1C1E]">
                  {t(opt.labelKey)}
                </VietnamText>
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-[#CE232A]' : 'border-[#D1D1D6]'
                  }`}>
                  {isSelected && <View className="h-3 w-3 rounded-full bg-[#CE232A]" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleApply}
          activeOpacity={0.85}
          className="items-center rounded-2xl bg-[#CE232A] py-4">
          <VietnamText className="text-base font-bold text-white">{t('searchResults.apply')}</VietnamText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function CookwareFilterSheet({
  visible,
  selectedCookware,
  onApply,
  onClose,
}: CookwareFilterSheetProps) {
  const { t } = useLocale();
  const [pendingCookware, setPendingCookware] = React.useState<string[]>(selectedCookware);

  React.useEffect(() => {
    if (visible) setPendingCookware(selectedCookware);
  }, [visible, selectedCookware]);

  function toggleCookware(id: string) {
    setPendingCookware((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleApply() {
    onApply(pendingCookware);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[#F5F5F6] px-5 pb-10 pt-4 shadow-2xl">
        <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-[#D1D1D6]" />

        <View className="mb-5 flex-row items-center justify-between">
          <VietnamText className="text-2xl font-bold text-[#1C1C1E]">
            {t('searchResults.cookwareSheetTitle')}
          </VietnamText>
          <TouchableOpacity
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
            <Icon as={X} size={18} className="text-[#1C1C1E]" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 flex-row flex-wrap justify-between gap-y-3">
          {SEARCH_COOKWARE_FILTER_OPTIONS.map((opt) => {
            const isSelected = pendingCookware.includes(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.75}
                onPress={() => toggleCookware(opt.id)}
                className={`flex-row items-center rounded-full border px-4 py-2.5 ${
                  isSelected ? 'border-[#CE232A] bg-[#FFF4F4]' : 'border-[#E5E5EA] bg-white'
                }`}
                style={{ width: '48%' }}>
                <VietnamText className="mr-2 text-[20px]">{opt.emoji}</VietnamText>
                <VietnamText
                  className={`text-[15px] font-semibold ${
                    isSelected ? 'text-[#CE232A]' : 'text-[#1C1C1E]'
                  }`}
                  numberOfLines={1}>
                  {t(opt.labelKey)}
                </VietnamText>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleApply}
          activeOpacity={0.85}
          className="items-center rounded-full bg-[#CE232A] py-4">
          <VietnamText className="text-lg font-bold text-white">{t('searchResults.apply')}</VietnamText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export function SearchResultsContainer() {
  const router = useRouter();
  const { t } = useLocale();
  const params = useLocalSearchParams<{ q?: string | string[] }>();

  const initialQuery = React.useMemo(() => {
    if (Array.isArray(params.q)) return params.q[0] ?? '';
    return params.q ?? '';
  }, [params.q]);

  const [query, setQuery] = React.useState(
    initialQuery || String(t('searchResults.defaultKeyword'))
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    initialQuery ? [initialQuery] : []
  );
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());
  const [selectedMaxMinutes, setSelectedMaxMinutes] = React.useState<number | null>(null);
  const [selectedMaxCalories, setSelectedMaxCalories] = React.useState<number | null>(null);
  const [selectedCookware, setSelectedCookware] = React.useState<string[]>([]);

  const [timeSheetVisible, setTimeSheetVisible] = React.useState(false);
  const [tagSheetVisible, setTagSheetVisible] = React.useState(false);
  const [caloriesSheetVisible, setCaloriesSheetVisible] = React.useState(false);
  const [cookwareSheetVisible, setCookwareSheetVisible] = React.useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const filteredRecipes = React.useMemo(() => {
    const keywordTerms = splitSearchTerms(query);
    const normalizedTags = selectedTags.map((tag) => normalizeSearchText(tag)).filter(Boolean);
    const normalizedCookware = selectedCookware
      .map((cookwareId) => normalizeSearchText(cookwareId))
      .filter(Boolean);

    const activeTags = keywordTerms.length > 0 ? [] : normalizedTags;

    return SEARCH_RECIPES.filter((item) => {
      const normalizedName = normalizeSearchText(item.name);
      const normalizedDescription = normalizeSearchText(item.description);
      const searchableContent = `${normalizedName} ${normalizedDescription}`;

      const normalizedItemTags = item.tags.map((tag) => normalizeSearchText(tag));
      const normalizedItemCookware = (item.cookware ?? []).map((cookwareId) =>
        normalizeSearchText(cookwareId)
      );

      const matchQuery =
        keywordTerms.length === 0 ||
        keywordTerms.some(
          (term) =>
            searchableContent.includes(term) ||
            normalizedItemTags.some((itemTag) => itemTag.includes(term))
        );

      const matchTag =
        activeTags.length === 0 ||
        activeTags.some(
          (tag) =>
            normalizedItemTags.some((itemTag) => itemTag.includes(tag)) ||
            searchableContent.includes(tag)
        );

      const matchTime =
        selectedMaxMinutes === null ||
        (typeof item.timeMinutes === 'number' && item.timeMinutes <= selectedMaxMinutes);

      const matchCalories =
        selectedMaxCalories === null ||
        (typeof item.calories === 'number' && item.calories <= selectedMaxCalories);

      const matchCookware =
        normalizedCookware.length === 0 ||
        normalizedCookware.some((cookwareId) => normalizedItemCookware.includes(cookwareId));

      return matchQuery && matchTag && matchTime && matchCalories && matchCookware;
    });
  }, [query, selectedTags, selectedCookware, selectedMaxMinutes, selectedMaxCalories]);

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }

  function handleClearAllFilters() {
    setSelectedTags([]);
    setQuery('');
    setSelectedMaxMinutes(null);
    setSelectedMaxCalories(null);
    setSelectedCookware([]);
  }

  const caloriesFilterLabel = selectedMaxCalories
    ? `${String(t('searchResults.caloriesFilter'))} (≤${selectedMaxCalories} ${String(
        t('searchResults.cal')
      )})`
    : String(t('searchResults.caloriesFilter'));

  const tagFilterLabel = `${String(t('searchResults.tagFilter'))}${
    selectedTags.length > 0 ? ` (${selectedTags.length})` : ''
  }`;

  const cookwareFilterLabel = `${String(t('searchResults.cookwareFilter'))}${
    selectedCookware.length > 0 ? ` (${selectedCookware.length})` : ''
  }`;

  const timeFilterLabel = selectedMaxMinutes
    ? `${String(t('searchResults.timeFilter'))} (≤${selectedMaxMinutes} ${String(
        t('searchResults.minute')
      )})`
    : String(t('searchResults.timeFilter'));

  const hasActiveFilters =
    selectedTags.length > 0 ||
    selectedMaxMinutes !== null ||
    selectedMaxCalories !== null ||
    selectedCookware.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F6]">
      <View className="flex-1 px-3 pt-1">
        <SearchQueryBar
          query={query}
          onQueryChange={setQuery}
          placeholder={String(t('searchResults.searchPlaceholder'))}
          onClose={handleClose}
        />

        <View className="mt-2 flex-row items-center">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingRight: 8 }}>
            <View className="flex-row items-center">
              <Pressable onPress={() => setCaloriesSheetVisible(true)} className="mr-2">
                <View pointerEvents="none">
                  <SearchFilterChip
                    label={caloriesFilterLabel}
                    left={<VietnamText className="text-base">🔥</VietnamText>}
                  />
                </View>
              </Pressable>

              <Pressable onPress={() => setTagSheetVisible(true)} className="mr-2">
                <View pointerEvents="none">
                  <SearchFilterChip
                    label={tagFilterLabel}
                    left={<VietnamText className="text-base">🏷️</VietnamText>}
                  />
                </View>
              </Pressable>

              <Pressable onPress={() => setCookwareSheetVisible(true)} className="mr-2">
                <View pointerEvents="none">
                  <SearchFilterChip
                    label={cookwareFilterLabel}
                    left={<VietnamText className="text-base">🍳</VietnamText>}
                  />
                </View>
              </Pressable>

              <Pressable onPress={() => setTimeSheetVisible(true)} className="mr-2">
                <View pointerEvents="none">
                  <SearchFilterChip
                    label={timeFilterLabel}
                    left={<VietnamText className="text-base">⌛</VietnamText>}
                  />
                </View>
              </Pressable>
            </View>
          </ScrollView>

          <Pressable
            onPress={handleClearAllFilters}
            disabled={!hasActiveFilters}
            className="ml-2 h-9 w-9 items-center justify-center">
            <Icon
              as={BrushCleaning}
              size={16}
              className={!hasActiveFilters ? 'text-[#BFC0C4]' : 'text-[#CE232A]'}
            />
          </Pressable>
        </View>

        <VietnamText className="mb-3 mt-3 text-base text-[#66666D]">
          {t('searchResults.results', { count: filteredRecipes.length })}
        </VietnamText>

        {filteredRecipes.length === 0 ? (
          <View className="mt-16 items-center px-6">
            <VietnamText className="text-6xl">🪄</VietnamText>
            <VietnamText className="mt-2 text-3xl font-semibold text-[#5C5C63]">
              {t('searchResults.noMatches')}
            </VietnamText>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 28 }}>
            <View className="flex-row flex-wrap justify-between">
              {filteredRecipes.map((item) => (
                <SearchRecipeCard
                  key={item.id}
                  item={item}
                  isSaved={savedIds.has(item.id)}
                  onToggleSave={toggleSave}
                  calUnit={String(t('searchResults.cal'))}
                  minuteUnit={String(t('searchResults.minute'))}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <TagFilterSheet
        visible={tagSheetVisible}
        selectedTags={selectedTags}
        onApply={(newTags) => {
          setSelectedTags(newTags);
          setTagSheetVisible(false);
        }}
        onClose={() => setTagSheetVisible(false)}
      />

      <CookingTimeSheet
        visible={timeSheetVisible}
        selectedMaxMinutes={selectedMaxMinutes}
        onSelect={setSelectedMaxMinutes}
        onApply={() => setTimeSheetVisible(false)}
        onClose={() => setTimeSheetVisible(false)}
      />

      <CookwareFilterSheet
        visible={cookwareSheetVisible}
        selectedCookware={selectedCookware}
        onApply={(newCookware) => {
          setSelectedCookware(newCookware);
          setCookwareSheetVisible(false);
        }}
        onClose={() => setCookwareSheetVisible(false)}
      />

      <CaloriesFilterSheet
        visible={caloriesSheetVisible}
        selectedMaxCalories={selectedMaxCalories}
        onSelect={setSelectedMaxCalories}
        onApply={() => setCaloriesSheetVisible(false)}
        onClose={() => setCaloriesSheetVisible(false)}
      />
    </SafeAreaView>
  );
}
