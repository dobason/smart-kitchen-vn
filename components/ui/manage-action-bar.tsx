import * as React from 'react';
import { View, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';

type Props = {
  isAllSelected: boolean;
  selectedCount: number;
  onSelectAll: () => void;
  onMovePress: () => void;
};

export function ManageActionBar({ isAllSelected, selectedCount, onSelectAll, onMovePress }: Props) {
  const { t } = useLocale();

  return (
    <View className="absolute bottom-0 w-full bg-gray-100 border-t border-gray-200 px-6 py-4 flex-row items-center justify-between pb-10">
      <Pressable onPress={onSelectAll} className="flex-row items-center gap-3">
        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isAllSelected ? 'bg-[#CE232A] border-[#CE232A]' : 'bg-transparent border-gray-400'}`}>
          {isAllSelected && <Icon as={Check} size={14} className="text-white" />}
        </View>
        <VietnamText className="text-base font-semibold text-gray-800">{t('cookbookDetail.selectAll')}</VietnamText>
      </Pressable>
      
      <Pressable 
        disabled={selectedCount === 0} 
        onPress={onMovePress}
        className={`px-8 py-3 rounded-full ${selectedCount > 0 ? 'bg-[#CE232A]' : 'bg-gray-300'}`}
      >
        <VietnamText className="text-white font-bold text-base">
          {t('cookbookDetail.moveTo')} {selectedCount > 0 ? selectedCount : ''}
        </VietnamText>
      </Pressable>
    </View>
  );
}