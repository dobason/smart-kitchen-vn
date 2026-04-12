import * as React from 'react';
import { RenameCookbookModal } from '@/components/ui/rename-cookbook-modal';
import { Link, useFocusEffect } from 'expo-router';
import { View, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, ChevronRight, Plus, ChefHat, ArrowDown10, Edit2, Trash2, X, BookOpen, Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as ImagePicker from 'expo-image-picker';
import i18n from '@/lib/i18n';
import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { CookbookCard } from '@/components/in-app-ui/cookbook-card';
import { ImportBottomSheet } from '@/components/import-bottom-sheet';
import { useLocale } from '@/hooks/use-locale';
import { INITIAL_COOKBOOKS, GLOBAL_RECIPES } from '@/constants/cookbookData';

const staticRecipes = [
  { id: '1', name: 'Súp phở', description: '600ml nước, 100g bánh phở...', calories: 300, timeMinutes: 15, imageUrl: 'https://images.squarespace-cdn.com/content/v1/66628bdc6b0b0d52d914a921/1752754499896-E9EAAEK78ESN8KAJV33G/unsplash-image-_33r6H_hiz4.jpg?format=1500w', tags: [] }
];

export default function RecipeScreen() {
  const [activeTab, setActiveTab] = React.useState<'recipe' | 'cookbook'>('recipe');
  const [cookbooks, setCookbooks] = React.useState<any[]>(INITIAL_COOKBOOKS);

  const [isAddModalVisible, setIsAddModalVisible] = React.useState(false);
  const [newBookName, setNewBookName] = React.useState('');
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<any>(null);
  
  const [isRenameVisible, setIsRenameVisible] = React.useState(false);
  const [renameTempName, setRenameTempName] = React.useState('');
  
  const [isImportVisible, setIsImportVisible] = React.useState(false);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);

  const [isSortMenuVisible, setIsSortMenuVisible] = React.useState(false);
  const [sortType, setSortType] = React.useState<'countDesc' | 'countAsc' | 'nameAsc' | 'nameDesc'>('countDesc');

  const { t } = useLocale();

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

  const displayCookbooks = React.useMemo(() => {
    const uncategorizedBook = cookbooks.find(book => book.id === 'uncategorized');
    const otherBooks = cookbooks.filter(book => book.id !== 'uncategorized');

    otherBooks.sort((a, b) => {
      const nameA = a.translationKey ? String(t(a.translationKey)) : a.name;
      const nameB = b.translationKey ? String(t(b.translationKey)) : b.name;

      switch (sortType) {
        case 'countDesc': // Nhiều món nhất
          if (b.count !== a.count) return b.count - a.count;
          return nameA.localeCompare(nameB);
        case 'countAsc':  // Ít món nhất
          if (a.count !== b.count) return a.count - b.count;
          return nameA.localeCompare(nameB);
        case 'nameAsc':   // Tên từ A -> Z
          return nameA.localeCompare(nameB);
        case 'nameDesc':  // Tên từ Z -> A
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });
    return uncategorizedBook ? [uncategorizedBook, ...otherBooks] : otherBooks;
  }, [cookbooks, sortType, t]);

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
              <TextInput placeholder={t("recipe.searchInMyRecipes")} className="flex-1 ml-2 text-base font-medium text-gray-900" placeholderTextColor="#9ca3af" />
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

          <View className="px-4 mt-4 flex-row flex-wrap justify-between">
            {staticRecipes.map(recipe => (
              <Link key={recipe.id} href="/(tabs)/recipe-detail" asChild>
                <Pressable style={{ width: '48.5%', marginBottom: 16 }}>
                  <RecipeCard item={recipe} isSaved={false} onToggleSave={() => {}} />
                </Pressable>
              </Link>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="pb-32 pt-4">
          
          {/*3. Thanh tiêu đề nhỏ có nút Sắp xếp */}
          <View className="flex-row justify-between items-center px-4 pb-4">
            <VietnamText className="text-gray-500 font-medium">
               {sortType === 'countDesc' ? `↓ ${t('recipe.sortMostRecipes')}` : 
                sortType === 'countAsc' ? `↑ ${t('recipe.sortLeastRecipes')}` : 
                sortType === 'nameAsc' ? `↓ ${t('recipe.sortNameAsc')}` : 
                `↑ ${t('recipe.sortNameDesc')}`}
            </VietnamText>
            <Pressable onPress={() => setIsSortMenuVisible(true)} className="p-1">
              <Icon as={ArrowDown10} size={24} className="text-[#CE232A]" />
            </Pressable>
          </View>

          <View className="px-4 flex-row flex-wrap gap-x-[4%] gap-y-6">
            {/* Sử dụng mảng displayCookbooks đã được tính toán sắp xếp */}
            {displayCookbooks.map((book) => (
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

      {/*4. MENU THẢ XUỐNG DÀNH CHO NÚT SẮP XẾP */}
      <Modal visible={isSortMenuVisible} transparent animationType="fade" statusBarTranslucent={true}>
        <Pressable className="flex-1 bg-transparent" onPress={() => setIsSortMenuVisible(false)}>
          <View className="absolute top-[160px] right-4 bg-white w-56 rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
            
            <Pressable onPress={() => { setSortType('countDesc'); setIsSortMenuVisible(false); }} className={`p-4 flex-row items-center justify-between border-b border-gray-50 ${sortType === 'countDesc' ? 'bg-red-50' : ''}`}>
              <VietnamText className={sortType === 'countDesc' ? "text-[#CE232A] font-bold" : "text-gray-700"}>{t('recipe.sortMostRecipes')}</VietnamText>
              {sortType === 'countDesc' ? <Icon as={Check} size={18} className="text-[#CE232A]" /> : null}
            </Pressable>
            
            <Pressable onPress={() => { setSortType('countAsc'); setIsSortMenuVisible(false); }} className={`p-4 flex-row items-center justify-between border-b border-gray-50 ${sortType === 'countAsc' ? 'bg-red-50' : ''}`}>
              <VietnamText className={sortType === 'countAsc' ? "text-[#CE232A] font-bold" : "text-gray-700"}>{t('recipe.sortLeastRecipes')}</VietnamText>
              {sortType === 'countAsc' ? <Icon as={Check} size={18} className="text-[#CE232A]" /> : null}
            </Pressable>
            
            <Pressable onPress={() => { setSortType('nameAsc'); setIsSortMenuVisible(false); }} className={`p-4 flex-row items-center justify-between border-b border-gray-50 ${sortType === 'nameAsc' ? 'bg-red-50' : ''}`}>
              <VietnamText className={sortType === 'nameAsc' ? "text-[#CE232A] font-bold" : "text-gray-700"}>{t('recipe.sortNameAsc')}</VietnamText>
              {sortType === 'nameAsc' ? <Icon as={Check} size={18} className="text-[#CE232A]" /> : null}
            </Pressable>
            
            <Pressable onPress={() => { setSortType('nameDesc'); setIsSortMenuVisible(false); }} className={`p-4 flex-row items-center justify-between ${sortType === 'nameDesc' ? 'bg-red-50' : ''}`}>
              <VietnamText className={sortType === 'nameDesc' ? "text-[#CE232A] font-bold" : "text-gray-700"}>{t('recipe.sortNameDesc')}</VietnamText>
              {sortType === 'nameDesc' ? <Icon as={Check} size={18} className="text-[#CE232A]" /> : null}
            </Pressable>

          </View>
        </Pressable>
      </Modal>

      <Modal visible={isAddModalVisible} transparent animationType="fade" statusBarTranslucent={true}>
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

      <Modal visible={isMenuVisible} transparent animationType="fade" statusBarTranslucent={true}>
        <Pressable className="flex-1 bg-black/40 justify-center items-center px-10" onPress={() => setIsMenuVisible(false)}>
          <View className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl">
            <View className="p-4 bg-gray-50 border-b border-gray-100 flex-row justify-between items-center">
              <VietnamText className="font-bold text-gray-900 text-lg line-clamp-1 flex-1">{selectedBook?.translationKey ? t(selectedBook.translationKey) : selectedBook?.name}</VietnamText>
              <Icon as={X} size={20} className="text-gray-400" />
            </View>
            <Pressable onPress={() => { setIsMenuVisible(false); setRenameTempName(selectedBook?.name || ''); setTimeout(() => setIsRenameVisible(true), 300); }} className="flex-row items-center gap-3 p-4 border-b border-gray-50">
              <Icon as={Edit2} size={20} className="text-gray-600" /><VietnamText className="font-medium text-gray-800 text-base">{i18n.t('recipe.editName')}</VietnamText>
            </Pressable>
            
            {selectedBook?.id !== 'uncategorized' && (
              <Pressable onPress={handleDeleteCookbook} className="flex-row items-center gap-3 p-4">
                <Icon as={Trash2} size={20} className="text-[#CE232A]" /><VietnamText className="font-medium text-[#CE232A] text-base">{i18n.t('recipe.deleteCookbook')}</VietnamText>
              </Pressable>
            )}
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