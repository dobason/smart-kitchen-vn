import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

type AITimeOptionChipProps = {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function AITimeOptionChip({
  label,
  emoji,
  selected = false,
  onPress,
}: AITimeOptionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'w-[31.5%] min-h-[94px] items-center justify-center rounded-[22px] border px-2 py-3',
        selected ? 'border-[#CE232A] bg-[#FDEBEC]' : 'border-[#E6E8EC] bg-white'
      )}>
      <View className="items-center gap-2">
        {emoji ? <Text className="text-[30px]">{emoji}</Text> : null}
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
