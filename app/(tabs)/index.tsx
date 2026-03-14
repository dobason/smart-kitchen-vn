import * as React from 'react';
import { View } from 'react-native';
import { LogoWithText } from '@/components/in-app-ui/logo-with-text';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { LanguageToggle } from '@/components/in-app-ui/language-toggle';
import { UserMenu } from '@/components/user-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TagsSearch } from '@/components/tags-search';
import { useLocale } from '@/hooks/use-locale';

export default function ExploreScreen() {
  const { t } = useLocale();

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
          selectedTags={['Tag 1']}
          className="w-full max-w-sm"
        />
        <RoundedButton variant="outline">
          <VietnamText className="font-semibold text-primary">
            {t('home.addIngredients')}
          </VietnamText>
        </RoundedButton>
        <View className="flex-1 items-center justify-center gap-4 p-4">
          <RoundedButton className="h-14 w-full">
            <VietnamText className="w-full flex-row text-center text-lg font-semibold">
              {t('home.search')}
            </VietnamText>
          </RoundedButton>
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
