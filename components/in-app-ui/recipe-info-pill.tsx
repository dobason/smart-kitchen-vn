import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type RecipeInfoPillProps = {
  icon: LucideIcon;
  value: string;
  bgClassName: string;
  iconClassName: string;
};

export function RecipeInfoPill({ icon, value, bgClassName, iconClassName }: RecipeInfoPillProps) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${bgClassName}`}>
      <View className="flex-row items-center gap-1.5">
        <Icon as={icon} size={12} className={iconClassName} />
        <VietnamText className="text-xs font-semibold text-[#232326]">{value}</VietnamText>
      </View>
    </View>
  );
}
