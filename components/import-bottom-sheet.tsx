import * as React from 'react';
import { View, Pressable, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, BookOpen, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';

interface ImportBottomSheetProps {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onPhotoPress: () => void;
}

export function ImportBottomSheet({ visible, isLoading, onClose, onCameraPress, onPhotoPress }: ImportBottomSheetProps) {
  const { t } = useLocale(); 
  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView className="flex-1 bg-black/40 justify-end" edges={['top', 'bottom']}>
        <Pressable className="flex-1" onPress={() => !isLoading && onClose()} />

        <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl relative">
          {isLoading && (
            <View className="absolute inset-0 bg-white/90 z-50 items-center justify-center rounded-t-[32px]">
              <ActivityIndicator size="large" color="#dc2626" />
              <VietnamText className="mt-4 text-red-600 font-bold text-lg animate-pulse">
                {t('cookbookDetail.aiAnalyzing') || 'AI đang phân tích dữ liệu...'}
              </VietnamText>
            </View>
          )}
          <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-10" />
          <View className="flex-row justify-center gap-10 px-2 mb-10">
            <Pressable onPress={onCameraPress} disabled={isLoading} className="items-center gap-3">
              <View className="w-[80px] h-[80px] bg-yellow-400 rounded-3xl items-center justify-center shadow-sm">
                <Icon as={Camera} size={32} className="text-white" />
              </View>
              <VietnamText className="text-sm font-medium text-gray-900">{t('cookbookDetail.camera')}</VietnamText>
            </Pressable>
            
            <Pressable onPress={onPhotoPress} disabled={isLoading} className="items-center gap-3">
              <View className="w-[80px] h-[80px] bg-blue-500 rounded-3xl items-center justify-center shadow-sm">
                <Icon as={ImageIcon} size={32} className="text-white" />
              </View>
              <VietnamText className="text-sm font-medium text-gray-900">{t('cookbookDetail.photo')}</VietnamText>
            </Pressable>
          </View>

          <Pressable className="flex-row items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <View className="flex-row items-center gap-4">
              <Icon as={BookOpen} size={22} className="text-gray-500" />
              <VietnamText className="font-semibold text-lg text-gray-900">
                {t('cookbookDetail.instruction')}
              </VietnamText>
            </View>
            <Icon as={ChevronRight} size={24} className="text-gray-400" />
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}