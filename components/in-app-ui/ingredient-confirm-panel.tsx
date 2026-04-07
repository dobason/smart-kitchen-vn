import { IngredientGridItem } from '@/components/in-app-ui/ingredient-grid-item';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { IngredientItem } from '@/types/ingredient';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IngredientConfirmPanelProps = {
  selectedIngredients: IngredientItem[];
  title: string;
  confirmLabel: string;
  onRemove: (ingredientId: string) => void;
  onConfirm: () => void;
  accentColor?: string;
  getIngredientLabel?: (ingredient: IngredientItem) => string;
};

export function IngredientConfirmPanel({
  selectedIngredients,
  title,
  confirmLabel,
  onRemove,
  onConfirm,
  accentColor = '#CE232A',
  getIngredientLabel,
}: IngredientConfirmPanelProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      className="rounded-t-[24px] border-t border-[#E5E7EB] bg-white px-4 pt-5">
      <VietnamText className="text-[18px] font-bold text-[#111827]">{title}</VietnamText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 py-3 pr-3">
        {selectedIngredients.map((ingredient) => (
          <IngredientGridItem
            key={ingredient.id}
            ingredient={ingredient}
            size={72}
            label={getIngredientLabel?.(ingredient)}
            onRemove={() => onRemove(ingredient.id)}
          />
        ))}
      </ScrollView>

      <Pressable
        onPress={onConfirm}
        style={{ backgroundColor: accentColor }}
        className="h-[62px] items-center justify-center rounded-full">
        <VietnamText className="text-[20px] font-bold tracking-[1px] text-white">{confirmLabel}</VietnamText>
      </Pressable>
    </View>
  );
}
