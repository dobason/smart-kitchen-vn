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
  onActionPress: () => void;
  actionLabel: string;
};

export function ManageActionBar({
  isAllSelected,
  selectedCount,
  onSelectAll,
  onActionPress,
  actionLabel,
}: Props) {
  const { t } = useLocale();

  return (
    <View className="absolute bottom-0 w-full flex-row items-center justify-between border-t border-[#E8E8ED] bg-white px-6 pb-10 pt-4">
      <Pressable onPress={onSelectAll} className="flex-row items-center gap-3">
        <View
          className={`h-7 w-7 items-center justify-center rounded-full border-2 ${
            isAllSelected ? 'border-[#CE232A] bg-[#CE232A]' : 'border-[#9CA3AF] bg-white'
          }`}>
          {isAllSelected && <Icon as={Check} size={14} className="text-white" />}
        </View>
        <VietnamText className="text-base font-semibold text-[#1C1C1E]">
          {t('cookbookDetail.selectAll')}
        </VietnamText>
      </Pressable>
      
      <Pressable
        disabled={selectedCount === 0}
        onPress={onActionPress}
        className={`min-w-[180px] items-center rounded-full px-10 py-3.5 ${
          selectedCount > 0 ? 'bg-[#CE232A]' : 'bg-[#E3A4A8]'
        }`}>
        <VietnamText className="text-base font-bold text-white">
          {actionLabel} {selectedCount > 0 ? selectedCount : ''}
        </VietnamText>
      </Pressable>
    </View>
  );
}