import * as React from 'react';
import { View, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { Search, SlidersHorizontal, Check, X } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';
import { RecipeCard } from '@/components/in-app-ui/recipe-card';

type Props = {
  visible: boolean;
  availableRecipes: any[];
  onClose: () => void;
  onAdd: (selectedIds: string[]) => void;
};

export function MyOwnRecipesModal({ visible, availableRecipes, onClose, onAdd }: Props) {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (visible) {
      setSelectedIds([]);
      setSearchQuery('');
    }
  }, [visible]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // ĐÂY LÀ "TÂM PHÁP" 1 DÒNG ĐỂ LỌC TIẾNG VIỆT
  const normalizeStr = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredRecipes = availableRecipes.filter(r => 
    normalizeStr(r.name).includes(normalizeStr(searchQuery))
  );

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent={true}>
      <View className="flex-1 bg-white pt-12">
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-4 border-b border-gray-100">
          <View className="w-8" />
          <VietnamText className="text-xl font-bold text-gray-900">
            {t('cookbookDetail.myOwnRecipes')}
          </VietnamText>
          <Pressable onPress={onClose} className="w-8 items-end">
            <Icon as={X} size={24} className="text-gray-800" />
          </Pressable>
        </View>

        {/* Thanh Tìm kiếm */}
        <View className="px-4 py-4">
          <View className="flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
              <Icon as={Search} size={20} className="text-gray-400" />
              <TextInput
                placeholder={t('recipe.searchInMyRecipes')}
                className="flex-1 ml-2 text-base font-medium text-gray-900"
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} className="p-1">
                  <Icon as={X} size={16} className="text-gray-400" />
                </Pressable>
              )}
            </View>
            <Pressable>
              <Icon as={SlidersHorizontal} size={24} className="text-gray-600" />
            </Pressable>
          </View>
        </View>

        {/* Danh sách */}
        <ScrollView className="flex-1 px-4" contentContainerClassName="flex-row flex-wrap justify-between pb-32">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => {
              const isSelected = selectedIds.includes(recipe.id);
              return (
                <Pressable
                  key={recipe.id}
                  style={{ width: '48.5%', marginBottom: 16 }}
                  onPress={() => toggleSelection(recipe.id)}
                  className="relative"
                >
                  <View pointerEvents="none" className="w-full">
                    <RecipeCard item={recipe} isSaved={false} onToggleSave={() => {}} />
                  </View>
                  <View className={`absolute top-3 left-3 w-7 h-7 rounded-full border-2 items-center justify-center shadow-sm ${isSelected ? 'bg-[#CE232A] border-[#CE232A]' : 'bg-white/80 border-gray-300'}`}>
                    {isSelected && <Icon as={Check} size={16} className="text-white" />}
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View className="w-full items-center justify-center py-20 mt-10">
                <VietnamText className="text-gray-400 font-medium text-base text-center">
                   Không tìm thấy công thức nào phù hợp với "{searchQuery}"
                </VietnamText>
            </View>
          )}
        </ScrollView>

        {/* Thanh Xác nhận */}
        <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 pb-10 shadow-lg">
          <Pressable
            onPress={() => onAdd(selectedIds)}
            disabled={selectedIds.length === 0}
            className={`py-4 rounded-full items-center ${selectedIds.length > 0 ? 'bg-[#CE232A]' : 'bg-gray-300'}`}
          >
            <VietnamText className="font-bold text-white text-base">
              Thêm {selectedIds.length} công thức
            </VietnamText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}