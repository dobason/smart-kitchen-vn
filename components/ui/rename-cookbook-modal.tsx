import * as React from 'react';
import { View, Pressable, TextInput, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';

type Props = {
  visible: boolean;
  tempName: string;
  setTempName: (name: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function RenameCookbookModal({ visible, tempName, setTempName, onClose, onConfirm }: Props) {
  const { t } = useLocale();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white w-full rounded-[24px] p-6 shadow-2xl items-center">
          <Pressable onPress={onClose} className="absolute top-4 right-4">
            <Icon as={X} size={24} className="text-gray-400" />
          </Pressable>
          <VietnamText className="text-xl font-bold text-gray-900 mb-6">{t('cookbookDetail.rename')}</VietnamText>
          <TextInput 
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base font-medium text-gray-900 mb-6" 
            value={tempName} 
            onChangeText={setTempName} 
            autoFocus 
          />
          <Pressable onPress={onConfirm} className="bg-[#CE232A] w-full py-3.5 rounded-full items-center shadow-sm">
            <VietnamText className="font-bold text-white text-base">{t('cookbookDetail.confirm')}</VietnamText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}