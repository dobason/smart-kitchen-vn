import { RecipeInfoPill } from '@/components/in-app-ui/recipe-info-pill';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import type { SearchRecipeItem } from '@/types/recipe';
import { Bookmark, ChefHat, Clock3, Flame } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, View } from 'react-native';

type SearchRecipeCardProps = {
  item: SearchRecipeItem;
  isSaved: boolean;
  calUnit: string;
  minuteUnit: string;
  onPressRecipe: (id: string) => void;
  onToggleSave: (id: string) => void;
};

export function SearchRecipeCard({
  item,
  isSaved,
  calUnit,
  minuteUnit,
  onPressRecipe,
  onToggleSave,
}: SearchRecipeCardProps) {
  return (
    <Pressable
      onPress={() => onPressRecipe(item.id)}
      className="mb-4 overflow-hidden rounded-[16px] border border-[#E4E5E8] bg-white"
      style={{ width: '48.6%' }}>
      <View className="relative">
        <Image source={{ uri: item.imageUrl }} className="h-32 w-full" resizeMode="cover" />

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onToggleSave(item.id);
          }}
          className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-[9px] bg-white">
          <Icon as={Bookmark} size={14} className={isSaved ? 'text-[#CE232A]' : 'text-[#111111]'} />
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
          <RecipeInfoPill
            icon={Flame}
            value={`${item.calories} ${calUnit}`}
            bgClassName="bg-[#FFF5E8]"
            iconClassName="text-[#F08C2E]"
          />

          <RecipeInfoPill
            icon={Clock3}
            value={`${item.timeMinutes} ${minuteUnit}`}
            bgClassName="bg-[#EEF5FF]"
            iconClassName="text-[#3A7AF6]"
          />
        </View>
      </View>
    </Pressable>
  );
}
