import * as React from 'react';
import { View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Image as ImageIcon, Link2, FileText, BookOpen, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as ImagePicker from 'expo-image-picker';

export default function ImportRecipeScreen() {
  // Trạng thái Loading
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClose = () => {
    router.navigate('/recipe'); 
  };

  // Hàm giả lập gọi AI xử lý (Mất 3 giây)
  const simulateAILoading = (actionName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Thành công!", `Đã phân tích xong từ ${actionName}.`);
      handleClose();
    }, 3000);
  };

  const handleCameraPress = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Thiếu quyền truy cập", "Vui lòng cho phép ứng dụng sử dụng Camera điện thoại để chụp công thức nhé.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3], 
      quality: 0.8, 
    });

    if (!result.canceled) {
      simulateAILoading("ảnh chụp Camera");
    }
  };

  const handlePhotoPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Thiếu quyền truy cập", "Vui lòng cho phép ứng dụng truy cập Thư viện ảnh để chọn công thức nhé.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      simulateAILoading("ảnh từ Thư viện");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black/40 justify-end" edges={['top', 'bottom']}>
        <Pressable className="flex-1" onPress={handleClose} disabled={isLoading} />
        
        <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl relative">
            
            {/* Nếu đang Loading thì hiển thị Overlay che lại */}
            {isLoading && (
              <View className="absolute inset-0 bg-white/80 z-50 items-center justify-center rounded-t-[32px]">
                <ActivityIndicator size="large" color="#dc2626" />
                <VietnamText className="mt-4 text-red-600 font-medium text-lg animate-pulse">
                  AI đang phân tích dữ liệu...
                </VietnamText>
              </View>
            )}

            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-10" />

            <View className="flex-row justify-between px-2 mb-10">
                <Pressable onPress={handleCameraPress} disabled={isLoading} className="items-center gap-3">
                    <View className="w-[60px] h-[60px] bg-yellow-400 rounded-2xl items-center justify-center shadow-sm">
                        <Icon as={Camera} size={26} className="text-white" />
                    </View>
                    <VietnamText className="text-sm font-medium text-gray-900">Camera</VietnamText>
                </Pressable>

                <Pressable onPress={handlePhotoPress} disabled={isLoading} className="items-center gap-3">
                    <View className="w-[60px] h-[60px] bg-blue-500 rounded-2xl items-center justify-center shadow-sm">
                        <Icon as={ImageIcon} size={26} className="text-white" />
                    </View>
                    <VietnamText className="text-sm font-medium text-gray-900">Ảnh</VietnamText>
                </Pressable>

                <Pressable onPress={() => simulateAILoading("đường dẫn Web URL")} disabled={isLoading} className="items-center gap-3">
                    <View className="w-[60px] h-[60px] bg-blue-500 rounded-2xl items-center justify-center shadow-sm">
                        <Icon as={Link2} size={26} className="text-white" />
                    </View>
                    <VietnamText className="text-sm font-medium text-gray-900">Web URL</VietnamText>
                </Pressable>

                <Pressable onPress={() => simulateAILoading("đoạn văn bản")} disabled={isLoading} className="items-center gap-3">
                    <View className="w-[60px] h-[60px] bg-yellow-400 rounded-2xl items-center justify-center shadow-sm">
                        <Icon as={FileText} size={26} className="text-white" />
                    </View>
                    <VietnamText className="text-sm font-medium text-gray-900">Dán văn bản</VietnamText>
                </Pressable>
            </View>

            <Pressable className="flex-row items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <View className="flex-row items-center gap-4">
                    <Icon as={BookOpen} size={22} className="text-gray-500" />
                    <VietnamText className="font-semibold text-lg text-gray-900">
                        Hướng dẫn thêm công thức
                    </VietnamText>
                </View>
                <Icon as={ChevronRight} size={24} className="text-gray-400" />
            </Pressable>
        </View>
    </SafeAreaView>
  );
}