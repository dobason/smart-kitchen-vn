import * as React from 'react';
import { View, Pressable } from 'react-native';
import { ArrowLeft, Pencil, Search, X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';

type Props = {
  isManageMode: boolean;
  cookbookName: string;
  totalRecipes: number;
  onBack: () => void;
  onCloseManage: () => void;
  onEditPress: () => void;
};

export function CookbookDetailHeader({ isManageMode, cookbookName, totalRecipes, onBack, onCloseManage, onEditPress }: Props) {
  const { t } = useLocale();
  return (
    <View className="bg-white px-4 py-3 border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        {!isManageMode ? (
          <React.Fragment>
            <Pressable onPress={onBack} className="p-2 -ml-2">
              <Icon as={ArrowLeft} size={24} className="text-gray-800" />
            </Pressable>
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-xl font-bold text-gray-900">{cookbookName}</VietnamText>
              <Pressable onPress={onEditPress}>
                <Icon as={Pencil} size={16} className="text-[#CE232A]" />
              </Pressable>
            </View>
            <Pressable className="p-2 -mr-2">
              <Icon as={Search} size={24} className="text-gray-800" />
            </Pressable>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Pressable onPress={onCloseManage} className="p-2 -ml-2">
              <Icon as={X} size={24} className="text-gray-800" />
            </Pressable>
            <View className="flex-row items-center gap-2">
              <VietnamText className="text-xl font-bold text-gray-900">{cookbookName}</VietnamText>
              <Pressable onPress={onEditPress}>
                <Icon as={Pencil} size={16} className="text-[#CE232A]" />
              </Pressable>
            </View>
            <View className="w-8" />
          </React.Fragment>
        )}
      </View>
      {isManageMode && (
        <VietnamText className="text-gray-500 font-medium mt-3">
          {t('cookbookDetail.total')} {totalRecipes}
        </VietnamText>
      )}
    </View>
  );
}