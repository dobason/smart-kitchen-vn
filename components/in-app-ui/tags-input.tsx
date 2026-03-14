import { cn } from '@/lib/utils';
import { SearchIcon, XCircleIcon, XIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, TextInput, type TextInputProps, View } from 'react-native';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';

type TagsInputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
};

export function TagsInput({
  tags,
  onTagsChange,
  inputValue = '',
  onInputChange,
  placeholder,
  className,
  ...props
}: TagsInputProps) {
  function removeTag(index: number) {
    onTagsChange(tags.filter((_, i) => i !== index));
  }

  function clearAll() {
    onTagsChange([]);
    onInputChange?.('');
  }

  return (
    <View
      className={cn(
        'flex-row items-center gap-2 rounded-full border border-primary bg-background px-3 py-3 shadow-md shadow-black/10',
        className
      )}>
      <SearchIcon size={20} className="mr-2 text-primary" color="hsl(0, 0%, 45.1%)" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row items-center gap-1.5"
        className="flex-1">
        {tags.map((tag, index) => (
          <View
            key={index}
            className="flex-row items-center gap-1 rounded-full bg-primary/10 px-2 py-1.5">
            <VietnamText className="text-sm">{tag}</VietnamText>
            <Pressable onPress={() => removeTag(index)} hitSlop={6}>
              <XIcon size={12} />
            </Pressable>
          </View>
        ))}

        <TextInput
          value={inputValue}
          onChangeText={onInputChange}
          placeholder={tags.length === 0 ? placeholder : undefined}
          placeholderTextColor="hsl(0, 0%, 45.1%)"
          className="min-w-16 text-foreground"
          {...props}
        />
      </ScrollView>

      {(tags.length > 0 || inputValue.length > 0) && (
        <Pressable onPress={clearAll} hitSlop={8} className="ml-1">
          <XCircleIcon size={20} color="hsl(0, 0%, 45.1%)" />
        </Pressable>
      )}
    </View>
  );
}
