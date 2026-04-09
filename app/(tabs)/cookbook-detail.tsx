import * as React from 'react';
import { View, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; 
import { Settings2, ChevronRight, Check, X, Plus } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';

import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { CookbookDetailHeader } from '@/components/ui/cookbook-detail-header';
import { ManageActionBar } from '@/components/ui/manage-action-bar';
import { RenameCookbookModal } from '@/components/ui/rename-cookbook-modal';
import { AddRecipeModal } from '@/components/ui/add-recipe-modal';

export let GLOBAL_RECIPES = [
  { id: '1', folderId: 'dinner', name: 'Mì nước cay kiểu Á', description: 'mì sợi, thịt heo...', calories: 550, timeMinutes: 25, imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500' },
  { id: '2', folderId: 'dinner', name: 'Pizza phô mai và rau củ', description: 'bột bánh pizza, phô mai...', calories: 250, timeMinutes: 30, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
  { id: '3', folderId: 'desserts', name: 'Bánh Cupcake dâu tây', description: 'Bột mì, dâu tây, kem tươi...', calories: 350, timeMinutes: 45, imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500' },
  { id: '4', folderId: 'uncategorized', name: 'Salad gà nướng', description: 'Ức gà, xà lách, sốt mè rang...', calories: 220, timeMinutes: 15, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
  { id: '5', folderId: 'uncategorized', name: 'Bánh mì bơ tỏi', description: 'Bánh mì, bơ, tỏi băm...', calories: 200, timeMinutes: 10, imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500' },
  { id: '6', folderId: 'uncategorized', name: 'Sinh tố xoài', description: 'Xoài chín, sữa tươi, đá...', calories: 150, timeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500' },
];

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
  }, [id, name, t, currentFolderId, passedName]); 

  const toggleSelection = (recipeId: string) => {
    setSelectedIds(prev => prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
  };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === currentRecipes.length ? [] : currentRecipes.map(r => r.id));
  };

  const handleSaveRename = () => {
    setCookbookName(tempName);
    setIsRenameVisible(false);
  };

  const handleConfirmMove = () => {
    GLOBAL_RECIPES = GLOBAL_RECIPES.map(r => 
      selectedIds.includes(r.id) ? { ...r, folderId: selectedFolderToMove } : r
    );
    setCurrentRecipes(GLOBAL_RECIPES.filter(r => r.folderId === currentFolderId));
    setSelectedIds([]);
    setIsMoveVisible(false);
    setIsManageMode(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      <CookbookDetailHeader 
        isManageMode={isManageMode}
        cookbookName={cookbookName}
        totalRecipes={currentRecipes.length}
        onBack={() => router.back()}
        onCloseManage={() => { setIsManageMode(false); setSelectedIds([]); }}
        onEditPress={() => { setTempName(cookbookName); setIsRenameVisible(true); }}
      />

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
          {currentRecipes.map((recipe: any) => {
            const isSelected = selectedIds.includes(recipe.id);
            return (
              <Pressable 
                key={recipe.id}
                style={{ width: '48.5%', marginBottom: 16 }}
                onPress={() =>
                  isManageMode
                    ? toggleSelection(recipe.id)
                    : router.push({
                        pathname: '/(tabs)/recipe-detail',
                        params: {
                          recipeId: recipe.id,
                          recipeName: recipe.name,
                          recipeDescription: recipe.description,
                          recipeCalories: String(recipe.calories),
                          recipeTimeMinutes: String(recipe.timeMinutes),
                          recipeImageUrl: recipe.imageUrl,
                        },
                      })
                }
                className="relative"
              >
                <View className="pointer-events-none w-full">
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
        </View>
      </ScrollView>

      {isManageMode && (
        <ManageActionBar 
          isAllSelected={selectedIds.length === currentRecipes.length && currentRecipes.length > 0}
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
      <AddRecipeModal visible={isAddRecipeVisible} onClose={() => setIsAddRecipeVisible(false)} />
    </SafeAreaView>
  );
}