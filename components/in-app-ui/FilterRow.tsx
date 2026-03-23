import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { SlidersHorizontal } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type FilterRowProps = {
  t: any;
};

export function FilterRow({ t }: FilterRowProps) {
  return (
    <View className="mt-2 flex-row items-center">
      <Pressable className="mr-2 h-9 flex-row items-center rounded-full border border-[#ECECEF] bg-white px-3">
        <View className="mr-2 h-3.5 w-3.5 rounded-[4px] bg-[#F3BA1B]" />
        <VietnamText className="text-sm text-[#1D1D1F]">{t('searchResults.tagFilter')}</VietnamText>
      </Pressable>

      <Pressable className="h-9 flex-row items-center rounded-full border border-[#ECECEF] bg-white px-3">
        <VietnamText className="mr-2 text-sm">⌛</VietnamText>
        <VietnamText className="text-sm text-[#1D1D1F]">{t('searchResults.timeFilter')}</VietnamText>
      </Pressable>

      <Pressable className="ml-auto h-9 w-9 items-center justify-center">
        <Icon as={SlidersHorizontal} size={16} className="text-[#CE232A]" />
      </Pressable>
    </View>
  );
}