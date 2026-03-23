import { Icon } from '@/components/ui/icon';
import { Search, X } from 'lucide-react-native';
import * as React from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';

type SearchQueryBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  onClose: () => void;
};

export function SearchQueryBar({ query, onQueryChange, placeholder, onClose }: SearchQueryBarProps) {
  return (
    <View className="flex-row items-center gap-3 pb-2">
      <Pressable onPress={onClose} className="h-9 w-9 items-center justify-center rounded-full">
        <Icon as={X} size={20} className="text-[#111111]" />
      </Pressable>

      <View className="h-12 flex-1 flex-row items-center rounded-full bg-[#DCDDDE] px-4">
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={placeholder}
          className="flex-1 text-base text-[#222222]"
          style={{ fontFamily: 'BeVietnamPro_400Regular' }}
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <Pressable
          onPress={() => Keyboard.dismiss()}
          className="h-9 w-9 items-center justify-center rounded-full bg-[#CE232A]">
          <Icon as={Search} size={16} className="text-white" />
        </Pressable>
      </View>
    </View>
  );
}
