import { View } from 'react-native';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { IngredientItem } from '@/types';

export function IngredientRow({ emoji, name, qty, bg }: IngredientItem) {
  return (
    <View className="flex-row items-center py-3 border-b border-dashed border-gray-200">
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: bg }}
      >
        <VietnamText className="text-2xl">{emoji}</VietnamText>
      </View>
      <VietnamText className="flex-1 text-base text-gray-800">{name}</VietnamText>
      <VietnamText className="text-base font-bold text-gray-800">{qty}</VietnamText>
    </View>
  );
}