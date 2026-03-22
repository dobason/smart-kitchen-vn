import * as React from 'react';
import { View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { PlusIcon } from 'lucide-react-native';
import { LogoWithText } from '@/components/in-app-ui/logo-with-text';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { ShinyButton } from '@/components/in-app-ui/shiny-button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { LanguageToggle } from '@/components/in-app-ui/language-toggle';
import { UserMenu } from '@/components/user-menu';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TagsSearch } from '@/components/tags-search';
import { useLocale } from '@/hooks/use-locale';

export default function ExploreScreen() {
  const { t } = useLocale();
  const router = useRouter();
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['Tag 1']);
  const [searchText, setSearchText] = React.useState('');

  function handleSearch() {
    const query = searchText.trim() || selectedTags[0] || String(t('searchResults.defaultKeyword'));
    router.push({
      pathname: '/search-results',
      params: { q: query },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-2">
        <UserMenu />
        <LanguageToggle />
      </View>
      <View className="flex-1 items-center justify-center gap-6 p-4">
        <LogoWithText />
        <TagsSearch
          options={[
            { label: 'Tag 1', value: 'Tag 1' },
            { label: 'Tag 2', value: 'Tag 2' },
            { label: 'Tag 3', value: 'Tag 3' },
            { label: 'Tag 4', value: 'Tag 4' },
            { label: 'Tag 5', value: 'Tag 5' },
            { label: 'Tag 6', value: 'Tag 6' },
          ]}
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
          onInputChange={setSearchText}
          placeholder={String(t('searchResults.searchPlaceholder'))}
          className="w-full max-w-sm"
        />
        <RoundedButton variant="outline">
          <Icon as={PlusIcon} size={16} className="text-primary" />
          <VietnamText className="font-semibold text-primary">
            {t('home.addIngredients')}
          </VietnamText>
        </RoundedButton>
        <View className="flex-1 items-center justify-center gap-4 p-4">
          <ShinyButton className="h-14 w-full" onPress={handleSearch}>
            <VietnamText className="w-full flex-row text-center text-lg font-semibold text-white">
              {t('home.search')}
            </VietnamText>
          </ShinyButton>
          <RoundedButton className="h-14 w-full" variant="outline">
            <VietnamText className="w-full flex-row text-center text-lg font-semibold">
              {t('home.generateRecipesVia')}{' '}
              <VietnamText className="ml-1 text-lg font-semibold text-orange-500">
                {t('AI')}
              </VietnamText>
            </VietnamText>
          </RoundedButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
