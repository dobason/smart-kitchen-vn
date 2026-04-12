import * as React from 'react';
import { View, ScrollView, Pressable, Modal, Alert, TextInput } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; 
import { Settings2, ChevronRight, Check, X, Plus, Search } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';
import * as ImagePicker from 'expo-image-picker'; 

import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { CookbookDetailHeader } from '@/components/ui/cookbook-detail-header';
import { ManageActionBar } from '@/components/ui/manage-action-bar';
import { RenameCookbookModal } from '@/components/ui/rename-cookbook-modal';
import { AddRecipeModal } from '@/components/ui/add-recipe-modal';
import { ImportBottomSheet } from '@/components/import-bottom-sheet';
import { MyOwnRecipesModal } from '@/components/ui/my-own-recipes-modal'; 
import { GLOBAL_RECIPES, updateGlobalRecipes } from '@/constants/cookbookData';

export default function CookbookDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useLocale();

  const currentFolderId = id ? String(id) : 'dinner';
  const passedName = name ? String(name) : '';

  const [currentRecipes, setCurrentRecipes] = React.useState<any[]>([]);
  const [cookbookName, setCookbookName] = React.useState('');

  const [isManageMode, setIsManageMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  
  const [isRenameVisible, setIsRenameVisible] = React.useState(false);
  const [tempName, setTempName] = React.useState('');
  const [isAddRecipeVisible, setIsAddRecipeVisible] = React.useState(false);
  const [isMoveVisible, setIsMoveVisible] = React.useState(false);
  const [selectedFolderToMove, setSelectedFolderToMove] = React.useState('uncategorized');
  const [isImportVisible, setIsImportVisible] = React.useState(false);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false); 
  const [isMyRecipesVisible, setIsMyRecipesVisible] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  
  React.useEffect(() => {
    setCurrentRecipes(GLOBAL_RECIPES.filter(r => r.folderId === currentFolderId));
    
    const isDefault = ['uncategorized', 'desserts', 'dinner'].includes(currentFolderId);
    if (isDefault) {
      setCookbookName(t(`cookbookDetail.${currentFolderId}`));
    } else {
      setCookbookName(passedName || t('cookbook.COOKBOOK')); 
    }
    
    setIsManageMode(false);
    setSelectedIds([]);
    setSearchQuery('');
    setIsSearchActive(false);
  }, [id, name, t, currentFolderId, passedName]); 

  const normalizeStr = (str: string) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const filteredCurrentRecipes = React.useMemo(() => {
    if (!searchQuery) return currentRecipes;
    return currentRecipes.filter(r => normalizeStr(r.name).includes(normalizeStr(searchQuery)));
  }, [currentRecipes, searchQuery]);

  const toggleSelection = (recipeId: string) => {
    setSelectedIds(prev => prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
  };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === filteredCurrentRecipes.length ? [] : filteredCurrentRecipes.map(r => r.id));
  };

  const handleSaveRename = () => {
    setCookbookName(tempName);
    setIsRenameVisible(false);
  };

  const handleConfirmMove = () => {
    const updatedRecipes = GLOBAL_RECIPES.map(r => 
      selectedIds.includes(r.id) ? { ...r, folderId: selectedFolderToMove } : r
    );
    updateGlobalRecipes(updatedRecipes);
    setCurrentRecipes(updatedRecipes.filter(r => r.folderId === currentFolderId));
    setSelectedIds([]);
    setIsMoveVisible(false);
    setIsManageMode(false);
  };

  const availableRecipesToAdd = GLOBAL_RECIPES.filter(r => r.folderId !== currentFolderId);

  const handleAddExistingRecipes = (selectedIdsToMove: string[]) => {
    const updatedRecipes = GLOBAL_RECIPES.map(r => 
      selectedIdsToMove.includes(r.id) ? { ...r, folderId: currentFolderId } : r
    );
    updateGlobalRecipes(updatedRecipes);
    setCurrentRecipes(updatedRecipes.filter(r => r.folderId === currentFolderId));
    setIsMyRecipesVisible(false); 
  };

  const simulateAILoading = (actionName: string) => {
    setIsLoadingAI(true);
    setTimeout(() => {
      setIsLoadingAI(false);
      setIsImportVisible(false); 
      Alert.alert('Thành công', `Đã phân tích từ ${actionName}`);
    }, 3000);
  };

  const handleCameraPress = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) { Alert.alert('Lỗi', 'Thiếu quyền Camera'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) simulateAILoading('Camera');
  };

  const handlePhotoPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Lỗi', 'Thiếu quyền Thư viện ảnh'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) simulateAILoading('Thư viện ảnh');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      <CookbookDetailHeader 
        isManageMode={isManageMode}
        cookbookName={cookbookName}
        totalRecipes={filteredCurrentRecipes.length}
        onBack={() => router.back()}
        onCloseManage={() => { setIsManageMode(false); setSelectedIds([]); }}
        onEditPress={() => { setTempName(cookbookName); setIsRenameVisible(true); }}
        onSearchPress={() => setIsSearchActive(!isSearchActive)} 
      />
      {isSearchActive && !isManageMode && (
        <View className="px-4 py-3 bg-white border-b border-gray-100 z-10 shadow-sm">
           <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
              <Icon as={Search} size={20} className="text-gray-400" />
              <TextInput
                 placeholder={t('recipe.searchInMyRecipes')}
                 className="flex-1 ml-2 text-base font-medium text-gray-900"
                 placeholderTextColor="#9ca3af"
                 value={searchQuery}
                 onChangeText={setSearchQuery}
                 autoFocus
              />
              {searchQuery.length > 0 && (
                 <Pressable onPress={() => setSearchQuery('')} className="p-1">
                    <Icon as={X} size={16} className="text-gray-400" />
                 </Pressable>
              )}
           </View>
        </View>
      )}

      <ScrollView className="flex-1" contentContainerClassName="pb-32 pt-2">
        {!isManageMode && (
          <Pressable onPress={() => setIsManageMode(true)} className="flex-row items-center justify-between bg-white px-4 py-4 mb-4 shadow-sm border-y border-gray-100">
            <View className="flex-row items-center gap-3">
              <Icon as={Settings2} size={20} className="text-gray-500" />
              <VietnamText className="text-base font-semibold text-gray-800">{t('cookbookDetail.manageCookbook')}</VietnamText>
            </View>
            <Icon as={ChevronRight} size={20} className="text-gray-400" />
          </Pressable>
        )}
        
        <View className="px-4 flex-row flex-wrap justify-between">
          {/*Render mảng đã lọc */}
          {filteredCurrentRecipes.map((recipe: any) => {
            const isSelected = selectedIds.includes(recipe.id);
            return (
              <Pressable 
                key={recipe.id}
                style={{ width: '48.5%', marginBottom: 16 }}
                onPress={() => isManageMode ? toggleSelection(recipe.id) : router.push('/(tabs)/recipe-detail')}
                className="relative"
              >
                <View pointerEvents="none" className="w-full">
                    <RecipeCard item={recipe} isSaved={false} onToggleSave={() => {}} />
                </View>
                
                {isManageMode && (
                  <View className={`absolute top-3 left-3 w-7 h-7 rounded-full border-2 items-center justify-center shadow-sm ${isSelected ? 'bg-[#CE232A] border-[#CE232A]' : 'bg-white/80 border-gray-300'}`}>
                    {isSelected && <Icon as={Check} size={16} className="text-white" />}
                  </View>
                )}
              </Pressable>
            );
          })}

          {filteredCurrentRecipes.length === 0 && searchQuery.length > 0 && (
             <View className="w-full py-10 items-center">
                <VietnamText className="text-gray-500 font-medium">Không tìm thấy "{searchQuery}"</VietnamText>
             </View>
          )}
        </View>
      </ScrollView>

      {isManageMode && (
        <ManageActionBar 
          isAllSelected={selectedIds.length === filteredCurrentRecipes.length && filteredCurrentRecipes.length > 0}
          selectedCount={selectedIds.length}
          onSelectAll={handleSelectAll}
          onMovePress={() => setIsMoveVisible(true)}
        />
      )}

      <RenameCookbookModal 
        visible={isRenameVisible}
        tempName={tempName}
        setTempName={setTempName}
        onClose={() => setIsRenameVisible(false)}
        onConfirm={handleSaveRename}
      />

      <Modal visible={isMoveVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[24px] p-6 shadow-2xl">
             <Pressable onPress={() => setIsMoveVisible(false)} className="absolute top-4 right-4 z-10">
               <Icon as={X} size={24} className="text-gray-400" />
             </Pressable>
             <VietnamText className="text-xl font-bold text-gray-900 mb-6">{t('cookbookDetail.moveTo')}</VietnamText>
             <View className="gap-3 mb-8">
                {['uncategorized', 'desserts', 'dinner'].map((folder) => (
                  <Pressable key={folder} onPress={() => setSelectedFolderToMove(folder)} className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <VietnamText className="text-base font-semibold text-gray-800">{t(`cookbookDetail.${folder}`)}</VietnamText>
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedFolderToMove === folder ? 'bg-[#CE232A] border-[#CE232A]' : 'border-gray-300 bg-white'}`}>
                      {selectedFolderToMove === folder && <Icon as={Check} size={14} className="text-white" />}
                    </View>
                  </Pressable>
                ))}
             </View>
             <Pressable onPress={handleConfirmMove} className="bg-[#CE232A] py-4 rounded-full items-center">
                <VietnamText className="font-bold text-white text-base">{t('cookbookDetail.move')}</VietnamText>
             </Pressable>
          </View>
        </View>
      </Modal>
      
      {!isManageMode && (
        <Pressable onPress={() => setIsAddRecipeVisible(true)} className="absolute bottom-8 right-6 bg-[#CE232A] w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-600/40 z-10">
          <Icon as={Plus} size={32} className="text-white" />
        </Pressable>
      )}

      <AddRecipeModal 
        visible={isAddRecipeVisible} 
        onClose={() => setIsAddRecipeVisible(false)} 
        onOpenImport={() => setIsImportVisible(true)}
        onOpenMyRecipes={() => setIsMyRecipesVisible(true)} 
      />

      <ImportBottomSheet 
        visible={isImportVisible} 
        isLoading={isLoadingAI} 
        onClose={() => setIsImportVisible(false)} 
        onCameraPress={handleCameraPress} 
        onPhotoPress={handlePhotoPress} 
      />

      <MyOwnRecipesModal
        visible={isMyRecipesVisible}
        availableRecipes={availableRecipesToAdd}
        onClose={() => setIsMyRecipesVisible(false)}
        onAdd={handleAddExistingRecipes}
      />

    </SafeAreaView>
  );
}