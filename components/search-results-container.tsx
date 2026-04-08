import { SearchFilterChip } from '@/components/in-app-ui/search-filter-chip';
import { SearchQueryBar } from '@/components/in-app-ui/search-query-bar';
import { SearchRecipeCard, type SearchRecipeItem } from '@/components/in-app-ui/search-recipe-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useLocale } from '@/hooks/use-locale';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BrushCleaning, X } from 'lucide-react-native';
import * as React from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SEARCH_RECIPES } from '@/constants/recipeData';

type TimeFilterOption = {
  label: string;
  maxMinutes: number;
};

const AVAILABLE_TAGS = [
  'Low Calorie',
  'High Protein',
  'Low Fat',
  'Lunch',
  'Dinner',
  'Snack',
  'Breakfast',
  'Soup',
  'High Fiber',
  'Family Friendly',
  'Side Dish',
  'Kid Friendly',
  'Lazy Cook',
  'One Pot',
  'Gluten Free',
  'Keto Friendly',
  'Vegan',
  'Vegetarian',
  'Egg Free',
  'Shellfish Free',
];

const TIME_FILTER_OPTIONS: TimeFilterOption[] = [
  { label: 'Under 5 min', maxMinutes: 5 },
  { label: 'Under 10 min', maxMinutes: 10 },
  { label: 'Under 20 min', maxMinutes: 20 },
  { label: 'Under 30 min', maxMinutes: 30 },
];

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

type TagFilterSheetProps = {
  visible: boolean;
  selectedTags: string[];
  onApply: (tags: string[]) => void;
  onClose: () => void;
};

function TagFilterSheet({ visible, selectedTags, onApply, onClose }: TagFilterSheetProps) {
  // Biến tạm để lưu các tag đang được chọn trong lúc mở Modal (chưa bấm Apply)
  const [pendingTags, setPendingTags] = React.useState<string[]>(selectedTags);

  // Mỗi khi mở Modal lên, đồng bộ biến tạm với state thật ở ngoài
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
      {/* Dim backdrop */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      {/* Sheet Container */}
      <View className="absolute bottom-0 left-0 right-0 max-h-[80%] rounded-t-3xl bg-[#F5F5F6] pb-10 pt-4 shadow-2xl">
        {/* Drag handle */}
        <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-[#D1D1D6]" />

        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between px-5">
          <VietnamText className="text-2xl font-bold text-[#1C1C1E]">Recipe Tags</VietnamText>
          <TouchableOpacity
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
            <Icon as={X} size={18} className="text-[#1C1C1E]" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Tags Area */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <View className="flex-row flex-wrap gap-3">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = pendingTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                  className={`rounded-full px-4 py-2.5 ${
                    isSelected
                      ? 'border border-[#2E7D32] bg-[#2E7D32]' // Màu xanh khi được chọn
                      : 'border border-[#E5E5EA] bg-white' // Màu trắng khi chưa chọn
                  }`}>
                  <VietnamText
                    className={`text-[15px] font-medium ${
                      isSelected ? 'text-white' : 'text-[#1C1C1E]'
                    }`}>
                    {tag}
                  </VietnamText>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="bg-[#F5F5F6] px-5 pt-4">
          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.85}
            className="items-center justify-center rounded-full bg-[#1F7B44] py-4 shadow-sm">
            <VietnamText className="text-lg font-bold text-white">Apply</VietnamText>
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
  const [pending, setPending] = React.useState<number | null>(selectedMaxMinutes);

  React.useEffect(() => {
    if (visible) setPending(selectedMaxMinutes);
  }, [visible, selectedMaxMinutes]);

  function handleApply() {
    onSelect(pending);
    onApply();
  }

  const boldNumber = (label: string) => {
    // Split "Under X min" into parts so we can bold the number
    const parts = label.split(/(\d+)/);
    return (
      <VietnamText className="text-base text-[#1C1C1E]">
        {parts.map((part, i) =>
          /^\d+$/.test(part) ? (
            <VietnamText key={i} className="text-base font-bold text-[#1C1C1E]">
              {part}
            </VietnamText>
          ) : (
            part
          )
        )}
      </VietnamText>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      {/* Dim backdrop */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      {/* Sheet */}
      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl">
        {/* Drag handle */}
        <View className="mb-4 h-1 w-10 self-center rounded-full bg-[#E0E0E0]" />

        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between">
          <VietnamText className="text-xl font-bold text-[#1C1C1E]">Cooking Time</VietnamText>
          <TouchableOpacity
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F2]">
            <Icon as={X} size={16} className="text-[#1C1C1E]" />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View className="mb-6 gap-y-3">
          {TIME_FILTER_OPTIONS.map((opt) => {
            const isSelected = pending === opt.maxMinutes;
            return (
              <TouchableOpacity
                key={opt.maxMinutes}
                onPress={() => setPending(isSelected ? null : opt.maxMinutes)}
                activeOpacity={0.7}
                className={`flex-row items-center justify-between rounded-2xl px-4 py-4 ${
                  isSelected ? 'bg-[#F0FAF0]' : 'bg-[#F7F7F7]'
                }`}>
                {boldNumber(opt.label)}
                {/* Radio circle */}
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-[#2E7D32]' : 'border-[#D1D1D6]'
                  }`}>
                  {isSelected && <View className="h-3 w-3 rounded-full bg-[#2E7D32]" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Apply button */}
        <TouchableOpacity
          onPress={handleApply}
          activeOpacity={0.85}
          className="items-center rounded-2xl bg-[#2E7D32] py-4">
          <VietnamText className="text-base font-bold text-white">Apply</VietnamText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ─── Main Container ───────────────────────────────────────────────────────────

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

  // Time filter state
  const [timeSheetVisible, setTimeSheetVisible] = React.useState(false);
  const [selectedMaxMinutes, setSelectedMaxMinutes] = React.useState<number | null>(null);
  const [tagSheetVisible, setTagSheetVisible] = React.useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setSelectedTags([initialQuery]);
    }
  }, [initialQuery]);

  const filteredRecipes = React.useMemo(() => {
    const keywordTerms = splitSearchTerms(query);
    const normalizedTags = selectedTags.map((tag) => normalizeSearchText(tag)).filter(Boolean);
    const activeTags = keywordTerms.length > 0 ? [] : normalizedTags;

    return SEARCH_RECIPES.filter((item) => {
      const content = normalizeSearchText(item.name);

      const matchQuery =
        keywordTerms.length === 0 || keywordTerms.some((term) => content.includes(term));
      const matchTag = activeTags.length === 0 || activeTags.some((tag) => content.includes(tag));

      const matchTime =
        selectedMaxMinutes === null ||
        (typeof item.timeMinutes === 'number' && item.timeMinutes <= selectedMaxMinutes);

      return matchQuery && matchTag && matchTime;
    });
  }, [query, selectedTags, selectedMaxMinutes]);

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

  function handleClearAllTags() {
    setSelectedTags([]);
    setQuery('');
    setSelectedMaxMinutes(null);
  }

  const timeFilterLabel = selectedMaxMinutes
    ? `⌛ ${String(t('searchResults.timeFilter'))} (≤${selectedMaxMinutes}m)`
    : ` ${String(t('searchResults.timeFilter'))}`;

  const hasActiveFilters = selectedTags.length > 0 || selectedMaxMinutes !== null;

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
          <Pressable onPress={() => setTagSheetVisible(true)}>
            <View pointerEvents="none">
              <SearchFilterChip
                className="mr-2"
                label={`${String(t('searchResults.tagFilter'))}${
                  selectedTags.length > 0 ? ` (${selectedTags.length})` : ''
                }`}
                left={<View className="h-3.5 w-3.5 rounded-[4px] bg-[#F3BA1B]" />}
              />
            </View>
          </Pressable>

          {/* Time chip — opens the bottom sheet */}
          <Pressable onPress={() => setTimeSheetVisible(true)}>
            label={timeFilterLabel}
            left={<VietnamText className="text-sm">⌛ {t('searchResults.timeFilter')}</VietnamText>}
          </Pressable>

          <Pressable
            onPress={handleClearAllTags}
            disabled={!hasActiveFilters}
            className="ml-auto h-9 w-9 items-center justify-center">
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
      </View>

      {/* Cooking Time bottom sheet */}
      <CookingTimeSheet
        visible={timeSheetVisible}
        selectedMaxMinutes={selectedMaxMinutes}
        onSelect={setSelectedMaxMinutes}
        onApply={() => setTimeSheetVisible(false)}
        onClose={() => setTimeSheetVisible(false)}
      />
      {/* 3. Chèn TagFilterSheet vào đây */}
      <TagFilterSheet
        visible={tagSheetVisible}
        selectedTags={selectedTags}
        onApply={(newTags) => {
          setSelectedTags(newTags); // Cập nhật mảng tag mới
          setTagSheetVisible(false); // Đóng modal
        }}
        onClose={() => setTagSheetVisible(false)}
      />
    </SafeAreaView>
  );
}
