import * as React from 'react';
import { View, Pressable, Modal } from 'react-native';
import { Book, Camera, Import, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenImport: () => void;
  onOpenMyRecipes: () => void; 
};

export function AddRecipeModal({ visible, onClose, onOpenImport, onOpenMyRecipes }: Props) {
  const { t } = useLocale();

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent={true}>
      <View className="flex-1 bg-black/40 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        
        <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl relative">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
          
          <VietnamText className="text-xl font-bold text-gray-900 mb-6 text-center">
            {t('cookbookDetail.addRecipesFrom')}
          </VietnamText>
          <Pressable 
            onPress={() => { onClose(); onOpenMyRecipes(); }} 
            className="flex-row items-center justify-between bg-orange-50 p-5 rounded-2xl border border-orange-100 mb-4"
          >
            <View className="flex-row items-center gap-4">
              <Icon as={Book} size={24} className="text-orange-500" />
              <VietnamText className="font-bold text-lg text-gray-900">{t('cookbookDetail.myOwnRecipes')}</VietnamText>
            </View>
            <Icon as={ChevronRight} size={24} className="text-gray-400" />
          </Pressable>
          
          <Pressable 
            onPress={() => { onClose(); onOpenImport(); }} 
            className="flex-row items-center justify-between bg-green-50 p-5 rounded-2xl border border-green-100"
          >
            <View className="flex-row items-center gap-4">
              <View className="flex-row gap-1">
                <Icon as={Camera} size={20} className="text-[#CE232A]" />
                <Icon as={Import} size={20} className="text-[#CE232A]" />
              </View>
              <VietnamText className="font-bold text-lg text-gray-900">{t('cookbookDetail.importNewRecipes')}</VietnamText>
            </View>
            <Icon as={ChevronRight} size={24} className="text-gray-400" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}