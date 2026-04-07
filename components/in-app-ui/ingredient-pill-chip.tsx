import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { cn } from '@/lib/utils';
import { IngredientItem } from '@/types/ingredient';
import { View } from 'react-native';

type IngredientPillChipProps = {
  ingredient: IngredientItem;
  selected?: boolean;
  label?: string;
  className?: string;
};

export function IngredientPillChip({
  ingredient,
  selected = false,
  label,
  className,
}: IngredientPillChipProps) {
  return (
    <View
      className={cn(
        'min-h-[48px] max-w-[96%] self-start flex-row items-center rounded-full border bg-white pl-3.5 pr-4 py-1.5',
        selected ? 'border-[#CE232A]' : 'border-[#D8DDE3]',
        className
      )}>
      <View
        style={{ backgroundColor: ingredient.bgColor }}
        className="h-7 w-7 shrink-0 items-center justify-center rounded-full">
        <VietnamText className="text-[15px]">{ingredient.emoji}</VietnamText>
      </View>
      <VietnamText
        className="ml-2 text-[15px] leading-5 text-[#111827]"
        numberOfLines={1}
        ellipsizeMode="tail">
        {label ?? ingredient.name}
      </VietnamText>
    </View>
  );
}
