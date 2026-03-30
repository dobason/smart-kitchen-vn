import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type SearchFilterChipProps = {
  label: string;
  left?: React.ReactNode;
  className?: string;
};

export function SearchFilterChip({ label, left, className }: SearchFilterChipProps) {
  return (
    <Pressable className={`h-9 flex-row items-center rounded-full border border-[#ECECEF] bg-white px-3 ${className ?? ''}`}>
      {left ? <View className="mr-2">{left}</View> : null}
      <VietnamText className="text-sm text-[#1D1D1F]">{label}</VietnamText>
    </Pressable>
  );
}
