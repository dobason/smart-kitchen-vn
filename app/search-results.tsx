import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useLocale } from '@/hooks/use-locale';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Bookmark,
  ChefHat,
  Clock3,
  Flame,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import * as React from 'react';
import { Image, Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchRecipeItem = {
  id: string;
  name: string;
  description: string;
  calories: number;
  timeMinutes: number;
  imageUrl: string;
  tags: string[];
};

const SEARCH_RECIPES: SearchRecipeItem[] = [
  {
    id: 'pho-bo',
    name: 'Súp phở',
    description: '600ml nước,100g bánh phở...',
    calories: 300,
    timeMinutes: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
    tags: ['pho', 'bo', 'nuoc dung'],
  },
  {
    id: 'bo-mong-co',
    name: 'Thịt bò Mông Cổ và Hành lá',
    description: '2 thìa cà phê dầu thực vật...',
    calories: 391,
    timeMinutes: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
    tags: ['bo', 'hanh la', 'xao'],
  },
  {
    id: 'banh-xa-lach-cuon',
    name: 'Bánh xá lách cuộn kiểu Á nhanh',
    description: '4 cốc nước,2 cốc gạo trắng...',
    calories: 245,
    timeMinutes: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    tags: ['xa lach', 'salad', 'nhanh'],
  },
  {
    id: 'salad-ga-kieu-a',
    name: 'Salad Gà Kiểu Á',
    description: '1/4 cốc dầu thực vật,3 muỗng...',
    calories: 180,
    timeMinutes: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1000&q=80',
    tags: ['salad', 'ga', 'healthy'],
  },
  {
    id: 'bun-thit-nuong',
    name: 'Bún thịt nướng',
    description: 'Bún tươi, thịt heo ướp sả...',
    calories: 420,
    timeMinutes: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80',
    tags: ['bun', 'nuong', 'heo'],
  },
];

export default function SearchResultsScreen() {
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
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const filteredRecipes = React.useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return SEARCH_RECIPES;
    }

    return SEARCH_RECIPES.filter((item) => {
      const content = `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
      return content.includes(keyword);
    });
  }, [query]);

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

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F6]">
      <View className="flex-1 px-3 pt-1">
        <View className="flex-row items-center gap-3 pb-2">
          <Pressable onPress={handleClose} className="h-9 w-9 items-center justify-center rounded-full">
            <Icon as={X} size={20} className="text-[#111111]" />
          </Pressable>

          <View className="h-12 flex-1 flex-row items-center rounded-full bg-[#DCDDDE] px-4">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={String(t('searchResults.searchPlaceholder'))}
              className="flex-1 text-base text-[#222222]"
              style={{ fontFamily: 'BeVietnamPro_400Regular' }}
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <Pressable
              onPress={() => Keyboard.dismiss()}
              className="h-9 w-9 items-center justify-center rounded-full bg-[#CE232A]">
              <Icon as={Search} size={16} className="text-white" />
            </Pressable>
          </View>
        </View>

        <View className="mt-2 flex-row items-center">
          <Pressable className="mr-2 h-9 flex-row items-center rounded-full border border-[#ECECEF] bg-white px-3">
            <View className="mr-2 h-3.5 w-3.5 rounded-[4px] bg-[#F3BA1B]" />
            <VietnamText className="text-sm text-[#1D1D1F]">{t('searchResults.tagFilter')}</VietnamText>
          </Pressable>

          <Pressable className="h-9 flex-row items-center rounded-full border border-[#ECECEF] bg-white px-3">
            <VietnamText className="mr-2 text-sm">⌛</VietnamText>
            <VietnamText className="text-sm text-[#1D1D1F]">{t('searchResults.timeFilter')}</VietnamText>
          </Pressable>

          <Pressable className="ml-auto h-9 w-9 items-center justify-center">
            <Icon as={SlidersHorizontal} size={16} className="text-[#CE232A]" />
          </Pressable>
        </View>

        <VietnamText className="mb-3 mt-3 text-base text-[#66666D]">
          {t('searchResults.results', { count: filteredRecipes.length })}
        </VietnamText>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
          <View className="flex-row flex-wrap justify-between">
            {filteredRecipes.map((item) => {
              const isSaved = savedIds.has(item.id);

              return (
                <View
                  key={item.id}
                  className="mb-4 overflow-hidden rounded-[16px] border border-[#E4E5E8] bg-white"
                  style={{ width: '48.6%' }}>
                  <View className="relative">
                    <Image source={{ uri: item.imageUrl }} className="h-32 w-full" resizeMode="cover" />

                    <Pressable
                      onPress={() => toggleSave(item.id)}
                      className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-[9px] bg-white">
                      <Icon
                        as={Bookmark}
                        size={14}
                        className={isSaved ? 'text-[#CE232A]' : 'text-[#111111]'}
                      />
                    </Pressable>

                    <View className="absolute bottom-2 right-2 h-7 w-7 items-center justify-center rounded-full bg-[#CE232A]">
                      <Icon as={ChefHat} size={13} className="text-white" />
                    </View>
                  </View>

                  <View className="p-3">
                    <VietnamText className="min-h-[48px] text-[20px] font-semibold leading-6 text-[#121212]" numberOfLines={2}>
                      {item.name}
                    </VietnamText>

                    <VietnamText className="mt-1 min-h-[34px] text-xs text-[#777780]" numberOfLines={2}>
                      {item.description}
                    </VietnamText>

                    <View className="mt-2 gap-1.5">
                      <View className="self-start rounded-full bg-[#FFF5E8] px-2.5 py-1">
                        <View className="flex-row items-center gap-1.5">
                          <Icon as={Flame} size={12} className="text-[#F08C2E]" />
                          <VietnamText className="text-xs font-semibold text-[#232326]">
                            {item.calories} {t('searchResults.cal')}
                          </VietnamText>
                        </View>
                      </View>

                      <View className="self-start rounded-full bg-[#EEF5FF] px-2.5 py-1">
                        <View className="flex-row items-center gap-1.5">
                          <Icon as={Clock3} size={12} className="text-[#3A7AF6]" />
                          <VietnamText className="text-xs font-semibold text-[#232326]">
                            {item.timeMinutes} {t('searchResults.minute')}
                          </VietnamText>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}