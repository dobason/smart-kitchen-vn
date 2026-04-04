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
        'h-[48px] shrink-0 self-start flex-row items-center rounded-full border bg-white px-3.5',
        selected ? 'border-[#CE232A]' : 'border-[#D8DDE3]',
        className
      )}>
      <View
        style={{ backgroundColor: ingredient.bgColor }}
        className="h-7 w-7 items-center justify-center rounded-full">
        <VietnamText className="text-[15px]">{ingredient.emoji}</VietnamText>
      </View>
      <VietnamText
        className="ml-2 text-[15px] font-semibold text-[#111827]"
        adjustsFontSizeToFit
        minimumFontScale={0.88}>
        {label ?? ingredient.name}
      </VietnamText>
    </View>
  );
}
