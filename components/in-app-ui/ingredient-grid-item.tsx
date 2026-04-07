import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { IngredientItem } from '@/types/ingredient';
import { X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

type IngredientGridItemProps = {
  ingredient: IngredientItem;
  size?: number;
  selected?: boolean;
  showLabel?: boolean;
  label?: string;
  onPress?: () => void;
  onRemove?: () => void;
};

export function IngredientGridItem({
  ingredient,
  size = 74,
  selected = false,
  showLabel = true,
  label,
  onPress,
  onRemove,
}: IngredientGridItemProps) {
  const emojiSize = Math.max(24, Math.round(size * 0.44));

  return (
    <View style={{ width: size + 8 }} className="items-center">
      <Pressable onPress={onPress} className="relative">
        <View
          style={{ width: size, height: size, backgroundColor: ingredient.bgColor }}
          className={cn(
            'items-center justify-center rounded-full border',
            selected ? 'border-[#CE232A]' : 'border-transparent'
          )}>
          <VietnamText style={{ fontSize: emojiSize }}>{ingredient.emoji}</VietnamText>
        </View>

        {onRemove ? (
          <Pressable
            onPress={onRemove}
            className="absolute -right-2 -top-1 h-7 w-7 items-center justify-center rounded-full bg-[#111111]">
            <Icon as={X} size={16} className="text-white" />
          </Pressable>
        ) : null}
      </Pressable>

      {showLabel ? (
        <VietnamText
          numberOfLines={2}
          className="mt-2 text-center text-[14px] font-semibold leading-[18px] text-[#111827]">
          {label ?? ingredient.name}
        </VietnamText>
      ) : null}
    </View>
  );
}
