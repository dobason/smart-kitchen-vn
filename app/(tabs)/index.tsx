import {
  INGREDIENT_LIBRARY,
  getIngredientDisplayName,
  getIngredientsByIds,
} from '@/constants/ingredientData';
import { LanguageToggle } from '@/components/in-app-ui/language-toggle';
import { IngredientPillChip } from '@/components/in-app-ui/ingredient-pill-chip';
import { IngredientSearchInput } from '@/components/in-app-ui/ingredient-search-input';
import { LogoWithText } from '@/components/in-app-ui/logo-with-text';
import { ShinyButton } from '@/components/in-app-ui/shiny-button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { UserMenu } from '@/components/user-menu';
import { Icon } from '@/components/ui/icon';
import { useIngredients } from '@/hooks/use-ingredients';
import { useLocale } from '@/hooks/use-locale';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SAMPLE_INGREDIENT_IDS = [
  'chicken',
  'cucumber',
  'pork',
  'egg',
  'tofu',
  'potato',
  'ground-meat',
];

export default function ExploreScreen() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { exploreIngredientIds, setExploreIngredientIds } = useIngredients();

  const selectedIngredients = React.useMemo(
    () => getIngredientsByIds(exploreIngredientIds),
    [exploreIngredientIds]
  );

  const [searchText, setSearchText] = React.useState('');

  const sampleIngredients = React.useMemo(
    () => getIngredientsByIds(SAMPLE_INGREDIENT_IDS),
    []
  );

  const selectedIngredientsForTagBar = React.useMemo(
    () =>
      selectedIngredients.map((item) => ({
        ...item,
        name: getIngredientDisplayName(item, locale),
      })),
    [selectedIngredients, locale]
  );

  function handleSearch() {
    const fallback = INGREDIENT_LIBRARY[0]?.name ?? String(t('searchResults.defaultKeyword'));
    const selectedQuery = selectedIngredientsForTagBar.map((item) => item.name).join(', ');
    const query = selectedQuery || searchText.trim() || fallback;

    router.push({
      pathname: '/search-results',
      params: { q: query },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F7F4EA]">
      <View className="flex-1 px-3.5 pb-3">
        <View className="flex-row items-center justify-between pt-1">
          <UserMenu />
          <LanguageToggle />
        </View>

        <View className="items-center pt-1">
          <LogoWithText />
        </View>

        <View className="mt-3">
          <IngredientSearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={t('home.searchPlaceholder')}
            selectedIngredients={selectedIngredientsForTagBar}
            onRemoveIngredient={(ingredientId) =>
              setExploreIngredientIds((prev) => prev.filter((id) => id !== ingredientId))
            }
            onClearSelected={() => setExploreIngredientIds([])}
            className="h-[54px] border-[#CE232A] bg-[#F6F7F9]"
          />
        </View>

        <View className="mt-4 flex-row flex-wrap justify-center gap-x-2.5 gap-y-2.5">
          {sampleIngredients.map((ingredient) => (
            <IngredientPillChip
              key={ingredient.id}
              ingredient={ingredient}
              selected={exploreIngredientIds.includes(ingredient.id)}
              label={getIngredientDisplayName(ingredient, locale)}
              className={locale.startsWith('vi') ? 'w-[46%]' : undefined}
            />
          ))}
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: '../ingredients-picker',
              params: { target: 'explore' },
            })
          }
          className="mt-3 h-11 w-[82%] self-center flex-row items-center justify-center rounded-full border border-[#CE232A] bg-white">
          <Icon as={Plus} size={16} className="text-[#CE232A]" />
          <VietnamText
            className="ml-2 text-[15px] font-semibold text-[#1F2937]"
            adjustsFontSizeToFit
            minimumFontScale={0.88}>
            {t('home.moreIngredients')}
          </VietnamText>
        </Pressable>

        <View className="mt-6 gap-3 pb-1">
          <ShinyButton onPress={handleSearch} className="h-14 border-[#CE232A] bg-[#CE232A]">
            <VietnamText className="w-full text-center text-[18px] font-semibold text-white">
              {t('home.search')}
            </VietnamText>
          </ShinyButton>

          <Pressable
            onPress={() => router.push('../ai-recipe')}
            className="h-14 flex-row items-center justify-center rounded-full border border-[#CE232A] bg-white">
            <VietnamText
              className="text-[18px] font-semibold text-[#CE232A]"
              adjustsFontSizeToFit
              minimumFontScale={0.88}>
              {t('home.generateWithAI')}
            </VietnamText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
