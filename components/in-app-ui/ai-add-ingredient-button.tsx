import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type AIAddIngredientButtonProps = {
  label: string;
  onPress?: () => void;
  className?: string;
  tone?: 'green' | 'red';
  size?: number;
};

export function AIAddIngredientButton({
  label,
  onPress,
  className,
  tone = 'green',
  size = 80,
}: AIAddIngredientButtonProps) {
  const isRed = tone === 'red';

  return (
    <Pressable onPress={onPress} className={cn('items-center', className)} style={{ width: size }}>
      <View
        style={{ width: size, height: size }}
        className={cn(
          'items-center justify-center rounded-full border',
          isRed ? 'border-[#F4C9CC] bg-[#FDEDEF]' : 'border-[#D9EFE7] bg-[#EAF8F2]'
        )}>
        <Icon
          as={Plus}
          size={Math.max(22, Math.round(size * 0.38))}
          className={isRed ? 'text-[#CE232A]' : 'text-[#00B075]'}
        />
      </View>
      <VietnamText className="mt-2 text-[14px] font-semibold text-[#111827]">{label}</VietnamText>
    </Pressable>
  );
}
