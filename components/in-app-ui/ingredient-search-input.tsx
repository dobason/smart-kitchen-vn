import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { cn } from '@/lib/utils';
import { IngredientItem } from '@/types/ingredient';
import { Search, X } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

type IngredientSearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  className?: string;
  selectedIngredients?: IngredientItem[];
  onRemoveIngredient?: (ingredientId: string) => void;
  onClearSelected?: () => void;
  editable?: boolean;
};

export function IngredientSearchInput({
  value,
  onChangeText,
  placeholder,
  className,
  selectedIngredients,
  onRemoveIngredient,
  onClearSelected,
  editable = true,
}: IngredientSearchInputProps) {
  const hasSelected = (selectedIngredients?.length ?? 0) > 0;

  return (
    <View
      className={cn(
        'h-12 flex-row items-center rounded-full border border-[#D3D7DC] bg-[#EEF0F2] px-4',
        className
      )}>
      <Icon as={Search} size={24} className="text-[#71757B]" />

      {hasSelected ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="ml-3 flex-1"
          contentContainerClassName="items-center gap-2 pr-2">
          {selectedIngredients?.map((ingredient) => (
            <View
              key={ingredient.id}
              className="h-7 flex-row items-center rounded-full bg-[#E9E9EA] px-2.5">
              <VietnamText className="text-[13px] text-[#111827]">{ingredient.name}</VietnamText>
              <Pressable
                onPress={() => onRemoveIngredient?.(ingredient.id)}
                className="ml-1 h-[18px] w-[18px] items-center justify-center rounded-full bg-[#DADDE1]">
                <Icon as={X} size={10} className="text-[#4B5563]" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={editable}
          className="ml-3 flex-1 text-[16px] text-[#111827]"
          style={{ fontFamily: 'BeVietnamPro_400Regular' }}
        />
      )}

      {hasSelected ? (
        <Pressable
          onPress={onClearSelected}
          className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-[#C9CED5]">
          <Icon as={X} size={14} className="text-[#F3F4F6]" />
        </Pressable>
      ) : null}
    </View>
  );
}
