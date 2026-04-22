import * as React from 'react';
import { View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Image as ImageIcon, BookOpen, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as ImagePicker from 'expo-image-picker';
import { useLocale } from '@/hooks/use-locale';
import {
  detectIngredientsFromImage,
  generateRecipeFromInstruction,
  getAiRecipeErrorMessage,
  RecipeInstructionResponse,
} from '@/services/aiRecipeServices';
import { useAIRecipeSession } from '../../hooks/use-ai-recipe-session';

export default function ImportRecipeScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { t, locale } = useLocale();
  const { setSession } = useAIRecipeSession();

  const handleClose = () => {
    router.navigate('/(tabs)/recipe'); 
  };

  const normalizeLanguage = React.useCallback(
    () => (String(locale || '').toLowerCase().startsWith('vi') ? 'vi' : 'en'),
    [locale]
  );

  const processImageToRecipe = React.useCallback(async (imageUri: string, actionName: string, mimeType?: string) => {
    setIsLoading(true);

    try {
      const ingredientsResponse = await detectIngredientsFromImage({
        imageUri,
        mimeType,
        language: normalizeLanguage(),
      });

      if (!ingredientsResponse.ingredients || ingredientsResponse.ingredients.length === 0) {
        throw new Error('No ingredients detected from image.');
      }

      const recipeResponse = await generateRecipeFromInstruction({
        ingredients: ingredientsResponse.ingredients,
        language: normalizeLanguage(),
      });

      if (
        recipeResponse.ingredients.length === 0 &&
        recipeResponse.steps.length === 0 &&
        !recipeResponse.dish &&
        !recipeResponse.time
      ) {
        throw new Error('Empty recipe returned from instruction API.');
      }

      setSession({
        imageUri,
        sourceLabel: actionName,
        detectedIngredients: ingredientsResponse.ingredients,
        recipe: recipeResponse,
      });

      router.replace('/ai-recipe-result');
    } catch (error) {
      console.error('Import recipe AI error:', error);
      Alert.alert(
        t('recipe.errorTitle') || 'Lỗi',
        getAiRecipeErrorMessage(error) || 'Không thể phân tích ảnh hoặc sinh công thức. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [normalizeLanguage, setSession, t]);

  const handleCameraPress = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(t('recipe.errorTitle') || "Lỗi", t('recipe.errorCameraPermission') || "Thiếu quyền truy cập Camera");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    const asset = result.assets?.[0];
    if (!result.canceled && asset?.uri) {
      await processImageToRecipe(asset.uri, t('recipe.aiSourceCamera') || 'Camera', asset.mimeType ?? undefined);
    }
  };

  const handlePhotoPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(t('recipe.errorTitle') || "Lỗi", t('recipe.errorPhotoPermission') || "Thiếu quyền truy cập Thư viện ảnh");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    const asset = result.assets?.[0];
    if (!result.canceled && asset?.uri) {
      await processImageToRecipe(asset.uri, t('recipe.aiSourcePhotoLibrary') || 'Thư viện ảnh', asset.mimeType ?? undefined);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black/40 justify-end" edges={['top', 'bottom']}>
        <Pressable className="flex-1" onPress={handleClose} disabled={isLoading} />
        
        <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl relative">
            
            {/* Overlay Loading */}
            {isLoading && (
              <View className="absolute inset-0 bg-white/80 z-50 items-center justify-center rounded-t-[32px]">
                <ActivityIndicator size="large" color="#dc2626" />
                <VietnamText className="mt-4 text-red-600 font-bold text-lg animate-pulse">
                  {t('cookbookDetail.aiAnalyzing')}
                </VietnamText>
              </View>
            )}

            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-10" />

            <View className="flex-row justify-center gap-10 mb-10">
                <Pressable onPress={handleCameraPress} disabled={isLoading} className="items-center gap-3">
                    <View className="w-[80px] h-[80px] bg-yellow-400 rounded-3xl items-center justify-center shadow-sm">
                        <Icon as={Camera} size={32} className="text-white" />
                    </View>
                    <VietnamText className="text-sm font-semibold text-gray-900">{t('cookbookDetail.camera')}</VietnamText>
                </Pressable>

                <Pressable onPress={handlePhotoPress} disabled={isLoading} className="items-center gap-3">
                    <View className="w-[80px] h-[80px] bg-blue-500 rounded-3xl items-center justify-center shadow-sm">
                        <Icon as={ImageIcon} size={32} className="text-white" />
                    </View>
                    <VietnamText className="text-sm font-semibold text-gray-900">{t('cookbookDetail.photo')}</VietnamText>
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
  );
}