import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

type AISelectableChipProps = {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

export function AISelectableChip({
  label,
  emoji,
  selected = false,
  onPress,
  className,
}: AISelectableChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'min-h-[44px] flex-row items-center rounded-full border px-3.5 py-2',
        selected ? 'border-[#CE232A] bg-[#FDEBEC]' : 'border-[#E6E8EC] bg-white',
        className
      )}>
      <View className="flex-row items-center gap-2">
        {emoji ? <Text className="text-[20px]">{emoji}</Text> : null}
        <VietnamText
          className={cn(
            'text-[18px] font-semibold leading-[22px]',
            selected ? 'text-[#B71F26]' : 'text-[#111827]'
          )}>
          {label}
        </VietnamText>
      </View>
    </Pressable>
  );
}
