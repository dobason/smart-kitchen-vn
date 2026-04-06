import * as React from 'react';
import { View, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Book, Camera, Import, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';
import { useRouter } from 'expo-router';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function AddRecipeModal({ visible, onClose }: Props) {
  const { t } = useLocale();
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView className="flex-1 bg-black/40 justify-end" edges={['top', 'bottom']}>
        {/* Bấm ra ngoài để đóng */}
        <Pressable className="flex-1" onPress={onClose} />
        
        <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl relative">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
          
          <VietnamText className="text-xl font-bold text-gray-900 mb-6 text-center">
            {t('cookbookDetail.addRecipesFrom')}
          </VietnamText>
          
          {/* Nút 1: Công thức của tôi */}
          <Pressable 
            onPress={() => { onClose(); /* Mở trang chọn công thức đã có */ }} 
            className="flex-row items-center justify-between bg-orange-50 p-5 rounded-2xl border border-orange-100 mb-4"
          >
            <View className="flex-row items-center gap-4">
              <Icon as={Book} size={24} className="text-orange-500" />
              <VietnamText className="font-bold text-lg text-gray-900">{t('cookbookDetail.myOwnRecipes')}</VietnamText>
            </View>
            <Icon as={ChevronRight} size={24} className="text-gray-400" />
          </Pressable>
          
          {/* Nút 2: Nhập công thức mới */}
          <Pressable 
            onPress={() => { 
              onClose(); 
              router.push('/import-recipe' as any); // Chuyển sang trang Import
            }} 
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
      </SafeAreaView>
    </Modal>
  );
}