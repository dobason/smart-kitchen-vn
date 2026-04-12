import { useRouter } from 'expo-router';
import * as React from 'react';
import { View, Pressable, Image } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale'; 

interface CookbookCardProps {
  book: { id: string; name: string; count: number; image: string; previewImages?: string[] };
  onMenuPress?: () => void;
  showMenu?: boolean;
}

export function CookbookCard({ book, onMenuPress, showMenu = true }: CookbookCardProps) {
  const router = useRouter();
  const { t } = useLocale();

  const coverImages = React.useMemo(() => {
    const uniqueImages = Array.from(new Set((book.previewImages ?? []).filter(Boolean)));

    if (uniqueImages.length === 0) {
      uniqueImages.push(book.image);
    }

    while (uniqueImages.length < 3) {
      uniqueImages.push(uniqueImages[0]);
    }

    return uniqueImages.slice(0, 3);
  }, [book.image, book.previewImages]);
  
  return (
      <Pressable 
        onPress={() => router.push({ pathname: '/(tabs)/cookbook-detail', params: { id: book.id, name: book.name } } as any)}
        className="w-[48%] rounded-[20px] border border-[#ECECF0] bg-[#F6F6F8] p-3.5 shadow-sm overflow-visible"
      >
      <View className="relative mt-1">
        <Image
          source={{ uri: coverImages[2] }}
          className="absolute -top-1 right-0 w-[96%] aspect-[4/3] rounded-[13px] border border-[#DBDEE4] bg-[#E9ECF2]"
          style={{ transform: [{ rotate: '6deg' }] }}
        />
        <Image
          source={{ uri: coverImages[1] }}
          className="absolute top-0 left-0 w-[96%] aspect-[4/3] rounded-[13px] border border-[#D7DAE1] bg-[#E2E5EB]"
          style={{ transform: [{ rotate: '-5deg' }] }}
        />
        <Image
          source={{ uri: coverImages[0] }}
          className="w-full aspect-[4/3] rounded-[13px] bg-[#D8DCE3] z-10"
          style={{ transform: [{ rotate: '-1.5deg' }] }}
        />
        {showMenu && onMenuPress ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onMenuPress();
            }}
            className="absolute top-1 right-1 p-1.5 z-20">
            <Icon as={MoreVertical} size={17} className="text-[#757984]" />
          </Pressable>
        ) : null}
      </View>
      <View className="mt-4 mb-1">
        <VietnamText className="text-[18px] font-bold text-[#16171A]" numberOfLines={1}>{book.name}</VietnamText>
        <VietnamText className="mt-1.5 text-[14px] text-[#7B808A]">
          {book.count} {t('recipePage.recipeTab')}
        </VietnamText>
      </View>
    </Pressable>
  );
}