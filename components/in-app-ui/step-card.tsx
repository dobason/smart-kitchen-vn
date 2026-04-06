import { View } from 'react-native';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { StepItem } from '@/types';

const BRAND = '#00B075';

export function StepCard({ number, text, tip, isLast = false }: StepItem) {
  return (
    <View className="flex-row">
      {/* Timeline */}
      <View className="mr-3 items-center" style={{ width: 32 }}>
        <View
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: BRAND }}>
          <VietnamText className="text-sm font-bold text-white">{number}</VietnamText>
        </View>
        {!isLast && (
          <View className="mt-1 w-0.5 flex-1" style={{ backgroundColor: BRAND, minHeight: 80 }} />
        )}
      </View>

      {/* Content */}
      <View className="flex-1 pb-6">
        <VietnamText className="mb-3 text-base font-semibold text-gray-800">{text}</VietnamText>

        {/* Tip card */}
        <View className="flex-row rounded-xl bg-white p-3 shadow-sm" style={{ elevation: 1 }}>
          <VietnamText className="mr-2 text-xl">📌</VietnamText>
          <VietnamText className="flex-1 text-sm text-gray-600">{tip}</VietnamText>
        </View>
      </View>
    </View>
  );
}
