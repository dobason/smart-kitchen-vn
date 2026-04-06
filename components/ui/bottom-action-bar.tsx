import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import type { LucideIcon } from 'lucide-react-native';
import { PlusIcon } from 'lucide-react-native';
import { View } from 'react-native';

type ActionItem = {
  icon: LucideIcon;
  label: string;
};

const BRAND = '#00B075';

export function BottomActionBar({ icon, label }: ActionItem) {
  return (
    <View className="flex-1 items-center gap-1">
      <View className="relative">
        <Icon as={icon} size={26} className="text-gray-700" />
        <View
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full items-center justify-center"
          style={{ backgroundColor: BRAND }}
        >
          <Icon as={PlusIcon} size={9} className="text-white" />
        </View>
      </View>
      <VietnamText className="text-xs text-gray-600 text-center">{label}</VietnamText>
    </View>
  );
}