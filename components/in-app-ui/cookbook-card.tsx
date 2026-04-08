import { useRouter } from 'expo-router';
import * as React from 'react';
import { View, Pressable, Image } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale'; 

interface CookbookCardProps {
  book: { id: string; name: string; count: number; image: string };
  onMenuPress: () => void;
}

export function CookbookCard({ book, onMenuPress }: CookbookCardProps) {
  const router = useRouter();
  const { t } = useLocale(); 
  
  return (
      <Pressable 
        onPress={() => router.push({ pathname: '/(tabs)/cookbook-detail', params: { id: book.id, name: book.name } } as any)}
        className="w-[48%] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 overflow-visible"
      >
      <View className="relative">
        <View className="absolute -top-2 -right-2 w-full aspect-[4/3] rounded-xl bg-gray-200 border border-gray-100" />
        <View className="absolute -top-1 -right-1 w-full aspect-[4/3] rounded-xl bg-gray-300 border border-gray-100" />
        <Image source={{ uri: book.image }} className="w-full aspect-[4/3] rounded-xl bg-gray-100 z-10" />
        <Pressable onPress={onMenuPress} className="absolute top-1 right-1 p-2 z-20">
          <Icon as={MoreVertical} size={20} className="text-white drop-shadow-md" />
        </Pressable>
      </View>
      <View className="mt-4">
        <VietnamText className="font-bold text-lg text-gray-900" numberOfLines={1}>{book.name}</VietnamText>
        <VietnamText className="text-sm text-gray-500 mt-1">
          {book.count} {t('recipePage.recipeTab')}
        </VietnamText>
      </View>
    </Pressable>
  );
}