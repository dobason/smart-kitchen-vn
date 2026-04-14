import { VietnamText } from "./vietnam-text";
import { Icon } from "../ui/icon";
import { Bookmark, ChefHat, Clock3, Flame } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';
import { SearchRecipeItem } from "@/types/recipe"; 
import { useLocale } from '@/hooks/use-locale';

type RecipeCardProps = {
    item: SearchRecipeItem;
    isSaved: boolean;
    onToggleSave: (id: string) => void;
  showSaveButton?: boolean;
};

export function RecipeCard({ item, isSaved, onToggleSave, showSaveButton = true }: RecipeCardProps) {
    const { t } = useLocale();
    return (
    // Đã đổi thành w-full để nó tự lấp đầy container cha
    <View className="mb-4 overflow-hidden rounded-[16px] border border-[#E4E5E8] bg-white w-full">
      <View className="relative">
        <Image source={{ uri: item.imageUrl }} className="h-32 w-full" resizeMode="cover" />

        {showSaveButton ? (
          <Pressable
            onPress={() => onToggleSave(item.id)}
            className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-[9px] bg-white">
            <Icon as={Bookmark} size={14} className={isSaved ? 'text-[#CE232A]' : 'text-[#111111]'} />
          </Pressable>
        ) : null}

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
};