import * as React from 'react';
import { RenameCookbookModal } from '@/components/ui/rename-cookbook-modal';
import { useFocusEffect, useRouter } from 'expo-router';
import { View, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, ChevronRight, Plus, ChefHat, ArrowDown10, Edit2, Trash2, X, BookOpen } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as ImagePicker from 'expo-image-picker';
import i18n from '@/lib/i18n';
import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { CookbookCard } from '@/components/in-app-ui/cookbook-card';
import { ImportBottomSheet } from '@/components/import-bottom-sheet';
import { useLocale } from '@/hooks/use-locale';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { GLOBAL_RECIPES } from './cookbook-detail';

const initialCookbooks = [
  { id: 'uncategorized', translationKey: 'cookbookDetail.uncategorized', count: 0, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
  { id: 'desserts', translationKey: 'cookbookDetail.desserts', count: 0, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80' },
  { id: 'dinner', translationKey: 'cookbookDetail.dinner', count: 0, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' },
];

function normalizeRecipeSearchText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export default function RecipeScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const { savedRecipes, savedRecipeIds, toggleSavedRecipe } = useSavedRecipes();

  const [activeTab, setActiveTab] = React.useState<'recipe' | 'cookbook'>('recipe');
  const [cookbooks, setCookbooks] = React.useState<any[]>(initialCookbooks);

  const [isAddModalVisible, setIsAddModalVisible] = React.useState(false);
  const [newBookName, setNewBookName] = React.useState('');
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<any>(null);
  
  const [isRenameVisible, setIsRenameVisible] = React.useState(false);
  const [renameTempName, setRenameTempName] = React.useState('');
  
  const [isImportVisible, setIsImportVisible] = React.useState(false);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);
  const [recipeSearchQuery, setRecipeSearchQuery] = React.useState('');

  const filteredSavedRecipes = React.useMemo(() => {
    const normalizedQuery = normalizeRecipeSearchText(recipeSearchQuery);

    if (!normalizedQuery) {
      return savedRecipes;
    }

    return savedRecipes.filter((recipe) => {
      const normalizedName = normalizeRecipeSearchText(recipe.name);
      const normalizedDescription = normalizeRecipeSearchText(recipe.description);
      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery)
      );
    });
  }, [recipeSearchQuery, savedRecipes]);

  const openRecipeDetail = (recipe: {
    id: string;
    name: string;
    description: string;
    calories: number;
    timeMinutes: number;
    imageUrl: string;
  }) => {
    router.push({
      pathname: '/(tabs)/recipe-detail',
      params: {
        recipeId: recipe.id,
        recipeName: recipe.name,
        recipeDescription: recipe.description,
        recipeCalories: String(recipe.calories),
        recipeTimeMinutes: String(recipe.timeMinutes),
        recipeImageUrl: recipe.imageUrl,
      },
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setCookbooks(prevCookbooks => 
        prevCookbooks.map(book => ({
          ...book,
          count: GLOBAL_RECIPES.filter((r) => r.folderId === book.id).length
        }))
      );
    }, [])
  );

  const handleCreateCookbook = () => {
    if (!newBookName.trim()) { Alert.alert(i18n.t('recipe.errorTitle'), i18n.t('recipe.errorEmptyName')); return; }
    const newBook = { id: Date.now().toString(), name: newBookName, translationKey: null, count: 0, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' };
    setCookbooks([...cookbooks, newBook]);
    setNewBookName('');
    setIsAddModalVisible(false);
  };

  const handleDeleteCookbook = () => {
    setCookbooks(cookbooks.filter(b => b.id !== selectedBook.id));
    setIsMenuVisible(false);
  };

  const simulateAILoading = (actionName: string) => {
    setIsLoadingAI(true);
    setTimeout(() => {
      setIsLoadingAI(false);
      setIsImportVisible(false); 
      Alert.alert(i18n.t('recipe.successTitle'), i18n.t('recipe.successAnalyzed', { source: actionName }));
    }, 3000);
  };

  const handleCameraPress = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) { Alert.alert(i18n.t('recipe.errorTitle'), i18n.t('recipe.errorCameraPermission')); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) simulateAILoading(i18n.t('recipe.aiSourceCamera'));
  };

  const handlePhotoPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert(i18n.t('recipe.errorTitle'), i18n.t('recipe.errorPhotoPermission')); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) simulateAILoading(i18n.t('recipe.aiSourcePhotoLibrary'));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row gap-6">
          <Pressable onPress={() => setActiveTab('recipe')} className={activeTab === 'recipe' ? "border-b-4 border-[#CE232A] pb-1" : "pb-1"}>
            <VietnamText className={`text-xl font-bold ${activeTab === 'recipe' ? 'text-gray-900' : 'text-gray-400'}`}>{i18n.t('recipe.tabRecipes')}</VietnamText>
          </Pressable>
          <Pressable onPress={() => setActiveTab('cookbook')} className={activeTab === 'cookbook' ? "border-b-4 border-[#CE232A] pb-1" : "pb-1"}>
            <VietnamText className={`text-xl font-bold ${activeTab === 'cookbook' ? 'text-gray-900' : 'text-gray-400'}`}>{i18n.t('recipe.tabCookbooks')}</VietnamText>
          </Pressable>
        </View>
        <Pressable className="bg-[#CE232A] p-2 rounded-full"><Icon as={ChefHat} size={20} className="text-white" /></Pressable>
      </View>

      {activeTab === 'recipe' ? (
        <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-32 pt-2">
          <View className="flex-row items-center px-4 py-3 gap-3">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
              <Icon as={Search} size={20} className="text-gray-400" />
              <TextInput
                value={recipeSearchQuery}
                onChangeText={setRecipeSearchQuery}
                placeholder={t("recipe.searchInMyRecipes")}
                className="flex-1 ml-2 text-base font-medium text-gray-900"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <Pressable><Icon as={SlidersHorizontal} size={24} className="text-gray-600" /></Pressable>
          </View>

          <View className="px-4 py-2 mt-1">
            <View className="flex-row items-center justify-between bg-red-50 rounded-2xl p-4 border border-red-100">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-yellow-400 rounded-xl relative items-center justify-center shadow-sm">
                  <Icon as={BookOpen} size={20} className="text-gray-800" />
                  <View className="absolute -bottom-1 -right-1 bg-[#CE232A] rounded-full w-4 h-4 items-center justify-center border border-white">
                    <VietnamText className="text-[8px] font-bold text-white">↓</VietnamText>
                  </View>
                </View>
                <VietnamText className="text-gray-800 font-medium text-base">
                  {t("recipe.todayRemainingImports")}:  <VietnamText className="text-[#CE232A] font-bold">10</VietnamText>
                </VietnamText>
              </View>
              <Icon as={ChevronRight} size={20} className="text-gray-400" />
            </View>
          </View>

          {savedRecipes.length === 0 ? (
            <View className="items-center px-8 py-12">
              <VietnamText className="text-xl font-bold text-gray-900 text-center">
                {t('recipe.noSavedRecipesTitle')}
              </VietnamText>
              <VietnamText className="mt-2 text-center text-base text-gray-500">
                {t('recipe.noSavedRecipesDescription')}
              </VietnamText>
            </View>
          ) : filteredSavedRecipes.length === 0 ? (
            <View className="items-center px-8 py-12">
              <VietnamText className="text-xl font-bold text-gray-900 text-center">
                {t('searchResults.noMatches')}
              </VietnamText>
            </View>
          ) : (
            <View className="px-4 mt-4 flex-row flex-wrap justify-between">
              {filteredSavedRecipes.map((recipe) => (
                <Pressable
                  key={recipe.id}
                  style={{ width: '48.5%', marginBottom: 16 }}
                  onPress={() => openRecipeDetail(recipe)}>
                  <RecipeCard
                    item={recipe}
                    isSaved={savedRecipeIds.has(recipe.id)}
                    onToggleSave={(id) => {
                      if (id === recipe.id) {
                        toggleSavedRecipe(recipe);
                      }
                    }}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="pb-32 pt-4">
          <View className="flex-row justify-end px-4 pb-4"><Icon as={ArrowDown10} size={24} className="text-gray-600" /></View>
          <View className="px-4 flex-row flex-wrap gap-x-[4%] gap-y-6">
            
            {cookbooks.map((book) => (
              <CookbookCard 
                key={book.id} 
                book={{...book, name: book.translationKey ? t(book.translationKey) : book.name}} 
                onMenuPress={() => { setSelectedBook(book); setIsMenuVisible(true); }} 
              />
            ))}

            <Pressable onPress={() => setIsAddModalVisible(true)} className="w-[48%] aspect-[4/5] border-2 border-dashed border-red-300 bg-red-50/50 rounded-2xl items-center justify-center overflow-hidden">
              <View className="bg-red-100 p-4 rounded-full mb-3 shadow-inner shadow-red-200/50"><Icon as={Plus} size={28} className="text-[#CE232A]" /></View>
              <VietnamText className="text-[#CE232A] font-medium text-base">{i18n.t('recipe.addCookbook')}</VietnamText>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <Pressable onPress={() => setIsImportVisible(true)} className="absolute bottom-6 right-6 bg-[#CE232A] w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-600/40 z-10">
        <Icon as={Plus} size={32} className="text-white" />
      </Pressable>

      <ImportBottomSheet visible={isImportVisible} isLoading={isLoadingAI} onClose={() => setIsImportVisible(false)} onCameraPress={handleCameraPress} onPhotoPress={handlePhotoPress} />

      <Modal visible={isAddModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[24px] p-6 shadow-2xl">
            <VietnamText className="text-xl font-bold text-gray-900 mb-4 text-center">{i18n.t('recipe.createCookbookTitle')}</VietnamText>
            <TextInput className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-medium text-gray-900 mb-6" placeholder={i18n.t('recipe.cookbookNamePlaceholder')} value={newBookName} onChangeText={setNewBookName} autoFocus />
            <View className="flex-row gap-4">
              <Pressable onPress={() => setIsAddModalVisible(false)} className="flex-1 bg-gray-100 py-3.5 rounded-xl items-center"><VietnamText className="font-semibold text-gray-600 text-base">{i18n.t('recipe.cancel')}</VietnamText></Pressable>
              <Pressable onPress={handleCreateCookbook} className="flex-1 bg-[#CE232A] py-3.5 rounded-xl items-center"><VietnamText className="font-semibold text-white text-base">{i18n.t('recipe.create')}</VietnamText></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isMenuVisible} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/40 justify-center items-center px-10" onPress={() => setIsMenuVisible(false)}>
          <View className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl">
            <View className="p-4 bg-gray-50 border-b border-gray-100 flex-row justify-between items-center">
              <VietnamText className="font-bold text-gray-900 text-lg line-clamp-1 flex-1">{selectedBook?.translationKey ? t(selectedBook.translationKey) : selectedBook?.name}</VietnamText>
              <Icon as={X} size={20} className="text-gray-400" />
            </View>
            <Pressable onPress={() => { setIsMenuVisible(false); setRenameTempName(selectedBook?.name || ''); setTimeout(() => setIsRenameVisible(true), 300); }} className="flex-row items-center gap-3 p-4 border-b border-gray-50">
              <Icon as={Edit2} size={20} className="text-gray-600" /><VietnamText className="font-medium text-gray-800 text-base">{i18n.t('recipe.editName')}</VietnamText>
            </Pressable>
            <Pressable onPress={handleDeleteCookbook} className="flex-row items-center gap-3 p-4">
              <Icon as={Trash2} size={20} className="text-[#CE232A]" /><VietnamText className="font-medium text-[#CE232A] text-base">{i18n.t('recipe.deleteCookbook')}</VietnamText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <RenameCookbookModal 
        visible={isRenameVisible} tempName={renameTempName} setTempName={setRenameTempName} onClose={() => setIsRenameVisible(false)}
        onConfirm={() => { setCookbooks(cookbooks.map(b => b.id === selectedBook?.id ? { ...b, name: renameTempName, translationKey: null } : b)); setIsRenameVisible(false); }}
      />
    </SafeAreaView>
  );
}