import { Tag } from '@/components/in-app-ui/tag';
import { TagsInput } from '@/components/in-app-ui/tags-input';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

type TagOption = {
  label: string;
  icon?: React.ReactNode;
  value: string;
};

type TagsSearchProps = {
  options: TagOption[];
  selectedTags?: string[];
  onSelectedTagsChange?: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
};

export function TagsSearch({
  options,
  selectedTags = [],
  onSelectedTagsChange,
  className,
  placeholder,
}: TagsSearchProps) {
  const [inputValue, setInputValue] = React.useState('');

  function toggleTag(value: string) {
    if (selectedTags.includes(value)) {
      onSelectedTagsChange?.(selectedTags.filter((t) => t !== value));
    } else {
      onSelectedTagsChange?.([...selectedTags, value]);
    }
  }

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <View className={cn('gap-4', className)}>
      <TagsInput
        tags={selectedTags}
        onTagsChange={(tags) => onSelectedTagsChange?.(tags)}
        inputValue={inputValue}
        onInputChange={setInputValue}
        placeholder={placeholder}
      />

      <View className="flex-row flex-wrap justify-center gap-2 px-8">
        {filteredOptions.map((opt) => (
          <Tag
            label={opt.label}
            icon={opt.icon}
            active={selectedTags.includes(opt.value)}
            onPress={() => toggleTag(opt.value)}
          />
        ))}
      </View>
    </View>
  );
}
