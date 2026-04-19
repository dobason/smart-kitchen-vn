import {
  INGREDIENT_LIBRARY,
  getIngredientDisplayName,
  getIngredientsByIds,
} from '@/constants/ingredientData';
import { IngredientConfirmPanel } from '@/components/in-app-ui/ingredient-confirm-panel';
import { IngredientGridItem } from '@/components/in-app-ui/ingredient-grid-item';
import { IngredientSearchInput } from '@/components/in-app-ui/ingredient-search-input';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { useIngredients, useGetIngredients, useCreateIngredient } from '@/hooks/use-ingredients'; 
import { useLocale } from '@/hooks/use-locale';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Plus } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function toggleInList(value: string, current: string[]) {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }
  return [...current, value];
}

export default function IngredientsPickerScreen() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const params = useLocalSearchParams<{ target?: string }>();
  const isAITarget = params.target === 'ai';

  const {
    exploreIngredientIds,
    setExploreIngredientIds,
    aiIngredientIds,
    setAiIngredientIds,
  } = useIngredients();

  const baseIngredientIds = isAITarget ? aiIngredientIds : exploreIngredientIds;
  const setBaseIngredientIds = isAITarget ? setAiIngredientIds : setExploreIngredientIds;

  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [draftSelectedIds, setDraftSelectedIds] = React.useState<string[]>(baseIngredientIds);

  // Thêm State cho Modal
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newIngredientName, setNewIngredientName] = React.useState('');

  // DEBOUNCE: Đợi người dùng gõ xong 500ms mới cập nhật chữ để gọi API
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // GỌI API: Tự động lấy danh sách nguyên liệu mới nhất
  const { data: apiIngredients = [], isLoading } = useGetIngredients(debouncedQuery);
  const createIngredientMutation = useCreateIngredient();

  React.useEffect(() => {
    setDraftSelectedIds(baseIngredientIds);
  }, [baseIngredientIds]);

  // KẾT HỢP DỮ LIỆU: Tìm full thông tin của các nguyên liệu đang được chọn
  const selectedIngredients = React.useMemo(() => {
    return draftSelectedIds.map(id => {
      // Ưu tiên tìm trong API trước, nếu không có thì tìm trong mảng Local
      const fromApi = apiIngredients.find((item: any) => item.id === id);
      const fromLocal = INGREDIENT_LIBRARY.find((item: any) => item.id === id);
      return fromApi || fromLocal;
    }).filter(Boolean) as any[]; // Lọc bỏ những cái null
  }, [draftSelectedIds, apiIngredients]);

  function handleClose() {
    if (isAITarget) {
      router.replace('/ai-recipe');
      return;
    }
    router.replace('/(tabs)');
  }

  function handleConfirm() {
    setBaseIngredientIds(draftSelectedIds);
    handleClose();
  }

  // HÀM TẠO NGUYÊN LIỆU MỚI BẰNG API
  const handleCreateIngredient = async () => {
    if (!newIngredientName.trim()) return;
    try {
      await createIngredientMutation.mutateAsync({ name: newIngredientName.trim(), icon: '🥬' });
      setNewIngredientName('');
      setIsAddModalOpen(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm nguyên liệu.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pb-2 pt-2">
        <Pressable onPress={handleClose} className="h-11 w-11 items-start justify-center pt-1">
          <Icon as={X} size={34} className="text-[#111827]" />
        </Pressable>

        <VietnamText className="flex-1 text-center text-[24px] font-bold text-[#08090A]">
          {t('ingredientsPicker.title')}
        </VietnamText>
        <View className="h-11 w-11" />
      </View>

      <View className="px-4 pt-1">
        <IngredientSearchInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('ingredientsPicker.searchPlaceholder')}
          className="h-[56px] rounded-[28px] border-[#E5E7EB] bg-[#F3F4F6]"
        />
      </View>

      <View className="h-3" />

      <ScrollView
        className="flex-1"
        contentContainerClassName={selectedIngredients.length > 0 ? 'px-4 pb-[290px]' : 'px-4 pb-7'}>
        <VietnamText className="mt-7 text-[20px] font-bold text-[#08090A]">
          {t('ingredientsPicker.youMightHave')}
        </VietnamText>
        {isLoading ? (
          <View className="mt-10 items-center justify-center">
             <ActivityIndicator size="large" color="#CE232A" />
          </View>
        ) : (
          <View className="mt-5 flex-row flex-wrap">
            {apiIngredients.map((ingredient: any) => (
              <View key={ingredient.id} className="mb-7 w-1/4 items-center">
                <IngredientGridItem
                  ingredient={ingredient}
                  size={82}
                  label={ingredient.translationKey ? getIngredientDisplayName(ingredient, locale) : ingredient.name}
                  selected={draftSelectedIds.includes(ingredient.id)}
                  onPress={() =>
                    setDraftSelectedIds((prev) => toggleInList(ingredient.id, prev))
                  }
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {selectedIngredients.length > 0 ? (
        <View className="absolute bottom-0 left-0 right-0">
          <IngredientConfirmPanel
            selectedIngredients={selectedIngredients}
            title={t('ingredientsPicker.selected', { count: selectedIngredients.length })}
            confirmLabel={t('ingredientsPicker.confirm')}
            onRemove={(ingredientId) =>
              setDraftSelectedIds((prev) => prev.filter((id) => id !== ingredientId))
            }
            onConfirm={handleConfirm}
            accentColor="#CE232A"
            getIngredientLabel={(ingredient: any) => ingredient.translationKey ? getIngredientDisplayName(ingredient, locale) : ingredient.name}
          />
        </View>
      ) : null}
      <Pressable 
        onPress={() => setIsAddModalOpen(true)} 
        className="absolute bottom-32 right-6 bg-[#CE232A] w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-red-600/40 z-10"
      >
        <Icon as={Plus} size={28} className="text-white" />
      </Pressable>
      <Modal visible={isAddModalOpen} transparent animationType="fade" statusBarTranslucent={true}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[24px] p-6 shadow-2xl items-center">
            <Pressable onPress={() => setIsAddModalOpen(false)} className="absolute top-4 right-4">
              <Icon as={X} size={24} className="text-gray-400" />
            </Pressable>
            <VietnamText className="text-xl font-bold text-gray-900 mb-6">Thêm nguyên liệu mới</VietnamText>
            <TextInput 
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base font-medium text-gray-900 mb-6" 
              placeholder="Ví dụ: Nấm kim châm..."
              value={newIngredientName} 
              onChangeText={setNewIngredientName} 
              autoFocus 
            />
            <Pressable 
              onPress={handleCreateIngredient}
              className="bg-[#CE232A] w-full py-3.5 rounded-full items-center shadow-sm"
            >
              <VietnamText className="font-bold text-white text-base">Thêm ngay</VietnamText>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}