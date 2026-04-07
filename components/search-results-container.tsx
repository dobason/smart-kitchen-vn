import { SearchFilterChip } from '@/components/in-app-ui/search-filter-chip';
import { SearchQueryBar } from '@/components/in-app-ui/search-query-bar';
import { SearchRecipeCard, type SearchRecipeItem } from '@/components/in-app-ui/search-recipe-card';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useLocale } from '@/hooks/use-locale';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BrushCleaning } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SEARCH_RECIPES } from '@/constants/recipeData';

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

export function SearchResultsContainer() {
  const router = useRouter();
  const { t } = useLocale();
  const params = useLocalSearchParams<{ q?: string | string[] }>();

  const initialQuery = React.useMemo(() => {
    if (Array.isArray(params.q)) {
      return params.q[0] ?? '';
    }
    return params.q ?? '';
  }, [params.q]);

  const [query, setQuery] = React.useState(initialQuery || String(t('searchResults.defaultKeyword')));
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    initialQuery ? [initialQuery] : []
  );
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setSelectedTags([initialQuery]);
    }
  }, [initialQuery]);

  const filteredRecipes = React.useMemo(() => {
    const keywordTerms = splitSearchTerms(query);
    const normalizedTags = selectedTags.map((tag) => normalizeSearchText(tag)).filter(Boolean);

    // When users type in the query bar, avoid stale chip tags from previous searches
    // interfering with the current text search.
    const activeTags = keywordTerms.length > 0 ? [] : normalizedTags;

    if (keywordTerms.length === 0 && activeTags.length === 0) {
      return SEARCH_RECIPES;
    }

    return SEARCH_RECIPES.filter((item) => {
      const content = normalizeSearchText(`${item.name} ${item.description} ${item.tags.join(' ')}`);
      const matchQuery =
        keywordTerms.length === 0 || keywordTerms.some((term) => content.includes(term));
      const matchTag =
        activeTags.length === 0 || activeTags.some((tag) => content.includes(tag));
      return matchQuery && matchTag;
    });
  }, [query, selectedTags]);

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
  }

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
          <SearchFilterChip
            className="mr-2"
            label={`${String(t('searchResults.tagFilter'))}${
              selectedTags.length > 0 ? ` (${selectedTags.length})` : ''
            }`}
            left={<View className="h-3.5 w-3.5 rounded-[4px] bg-[#F3BA1B]" />}
          />

          <SearchFilterChip
            label={String(t('searchResults.timeFilter'))}
            left={<VietnamText className="text-sm">⌛</VietnamText>}
          />

          <Pressable
            onPress={handleClearAllTags}
            disabled={selectedTags.length === 0}
            className="ml-auto h-9 w-9 items-center justify-center">
            <Icon
              as={BrushCleaning}
              size={16}
              className={selectedTags.length === 0 ? 'text-[#BFC0C4]' : 'text-[#CE232A]'}
            />
          </Pressable>
        </View>

        <VietnamText className="mb-3 mt-3 text-base text-[#66666D]">
          {t('searchResults.results', { count: filteredRecipes.length })}
        </VietnamText>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
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
    </SafeAreaView>
  );
}
