import { View } from 'react-native';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { NutritionStatProps } from '@/types/nutrition';

export function NutritionStat({ value, label, emoji, hasBorder }: NutritionStatProps) {
  return (
    <View
      className={`flex-1 items-center py-2 ${hasBorder ? 'border-l border-gray-200' : ''}`}
    >
      <VietnamText className="text-lg font-bold text-gray-900">{value}</VietnamText>
      <View className="flex-row items-center gap-1 mt-0.5">
        <VietnamText className="text-base">{emoji}</VietnamText>
        <VietnamText className="text-xs text-gray-500">{label}</VietnamText>
      </View>
    </View>
  );
}