import * as React from 'react';
import { View, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, ChevronRight, Plus, ChefHat, ArrowDown10, Edit2, Trash2, X, BookOpen } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as ImagePicker from 'expo-image-picker';

import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { CookbookCard } from '@/components/in-app-ui/cookbook-card';
import { ImportBottomSheet } from '@/components/import-bottom-sheet';

// --- DATA MẪU ---
const staticRecipes = [
  { id: '1', title: 'Súp phở', ingredients: '600ml nước, 100g bánh phở...', calories: 300, time: 15, imageUrl: 'https://images.squarespace-cdn.com/content/v1/66628bdc6b0b0d52d914a921/1752754499896-E9EAAEK78ESN8KAJV33G/unsplash-image-_33r6H_hiz4.jpg?format=1500w' }
];

const initialCookbooks = [
  { id: '1', name: 'Chưa phân loại', count: 2, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
  { id: '2', name: 'Món tráng miệng', count: 1, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80' },
  { id: '3', name: 'Bữa tối', count: 0, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' },
];

export default function RecipeScreen() {
  const [activeTab, setActiveTab] = React.useState<'recipe' | 'cookbook'>('recipe');
  const [cookbooks, setCookbooks] = React.useState<any[]>(initialCookbooks);

  const [isAddModalVisible, setIsAddModalVisible] = React.useState(false);
  const [newBookName, setNewBookName] = React.useState('');
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<any>(null);

  const [isImportVisible, setIsImportVisible] = React.useState(false);
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);

  const handleCreateCookbook = () => {
    if (!newBookName.trim()) { Alert.alert("Lỗi", "Tên sổ tay không được để trống!"); return; }
    const newBook = { id: Date.now().toString(), name: newBookName, count: 0, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' };
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
      Alert.alert("Thành công!", `Đã phân tích xong từ ${actionName}.`);
    }, 3000);
  };

  const handleCameraPress = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) { Alert.alert("Lỗi", "Cần quyền truy cập Camera."); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) simulateAILoading("ảnh chụp Camera");
  };

  const handlePhotoPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Lỗi", "Cần quyền truy cập Thư viện ảnh."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) simulateAILoading("ảnh từ Thư viện");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row gap-6">
          <Pressable onPress={() => setActiveTab('recipe')} className={activeTab === 'recipe' ? "border-b-4 border-red-600 pb-1" : "pb-1"}>
            <VietnamText className={`text-xl font-bold ${activeTab === 'recipe' ? 'text-gray-900' : 'text-gray-400'}`}>CÔNG THỨC</VietnamText>
          </Pressable>
          <Pressable onPress={() => setActiveTab('cookbook')} className={activeTab === 'cookbook' ? "border-b-4 border-red-600 pb-1" : "pb-1"}>
            <VietnamText className={`text-xl font-bold ${activeTab === 'cookbook' ? 'text-gray-900' : 'text-gray-400'}`}>SỔ TAY</VietnamText>
          </Pressable>
        </View>
        <Pressable className="bg-red-600 p-2 rounded-full"><Icon as={ChefHat} size={20} className="text-white" /></Pressable>
      </View>

      {/* Nội dung chính */}
      {activeTab === 'recipe' ? (
        <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-32 pt-2">
          {/* Search */}
          <View className="flex-row items-center px-4 py-3 gap-3">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
              <Icon as={Search} size={20} className="text-gray-400" />
              <TextInput placeholder="Search in my recipes" className="flex-1 ml-2 text-base font-medium text-gray-900" placeholderTextColor="#9ca3af" />
            </View>
            <Pressable><Icon as={SlidersHorizontal} size={24} className="text-gray-600" /></Pressable>
          </View>

          {/* Banner */}
          <View className="px-4 py-2">
            <View className="flex-row items-center justify-between bg-red-50 rounded-2xl p-4 border border-red-100">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-yellow-400 rounded-lg relative items-center justify-center">
                  <Icon as={BookOpen} size={20} className="text-gray-800" />
                  <View className="absolute -bottom-1 -right-1 bg-red-600 rounded-full w-4 h-4 items-center justify-center border border-white">
                    <VietnamText className="text-[8px] font-bold text-white">↓</VietnamText>
                  </View>
                </View>
                <VietnamText className="text-gray-800 font-medium text-base">Today's remaining imports: <VietnamText className="text-red-600 font-bold">10</VietnamText></VietnamText>
              </View>
              <Icon as={ChevronRight} size={20} className="text-gray-400" />
            </View>
          </View>

          {/* Dùng RecipeCard Component */}
          <View className="px-4 mt-4 flex-row flex-wrap justify-between gap-y-6">
            {staticRecipes.map(recipe => (
              <RecipeCard key={recipe.id} title={recipe.title} ingredients={recipe.ingredients} calories={recipe.calories} time={recipe.time} imageUrl={recipe.imageUrl} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="pb-32 pt-4">
          <View className="flex-row justify-end px-4 pb-4"><Icon as={ArrowDown10} size={24} className="text-gray-600" /></View>
          <View className="px-4 flex-row flex-wrap gap-x-[4%] gap-y-6">
            
            {/* Dùng CookbookCard Component */}
            {cookbooks.map((book) => (
              <CookbookCard key={book.id} book={book} onMenuPress={() => { setSelectedBook(book); setIsMenuVisible(true); }} />
            ))}

            <Pressable onPress={() => setIsAddModalVisible(true)} className="w-[48%] aspect-[4/5] border-2 border-dashed border-red-300 bg-red-50/50 rounded-2xl items-center justify-center overflow-hidden">
              <View className="bg-red-100 p-4 rounded-full mb-3 shadow-inner shadow-red-200/50"><Icon as={Plus} size={28} className="text-red-600" /></View>
              <VietnamText className="text-red-600 font-medium text-base">Thêm Sổ Tay</VietnamText>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* Nút FAB Mở Import */}
      <Pressable onPress={() => setIsImportVisible(true)} className="absolute bottom-6 right-6 bg-red-600 w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-600/40 z-10">
        <Icon as={Plus} size={32} className="text-white" />
      </Pressable>

      {/* Dùng Container Component ImportBottomSheet */}
      <ImportBottomSheet visible={isImportVisible} isLoading={isLoadingAI} onClose={() => setIsImportVisible(false)} onCameraPress={handleCameraPress} onPhotoPress={handlePhotoPress} />

      {/* Các Modals (Giữ lại trong file chính để dễ quản lý state) */}
      <Modal visible={isAddModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[24px] p-6 shadow-2xl">
            <VietnamText className="text-xl font-bold text-gray-900 mb-4 text-center">Tạo Sổ Tay Mới</VietnamText>
            <TextInput className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-medium text-gray-900 mb-6" placeholder="Nhập tên sổ tay..." value={newBookName} onChangeText={setNewBookName} autoFocus />
            <View className="flex-row gap-4">
              <Pressable onPress={() => setIsAddModalVisible(false)} className="flex-1 bg-gray-100 py-3.5 rounded-xl items-center"><VietnamText className="font-semibold text-gray-600 text-base">Hủy</VietnamText></Pressable>
              <Pressable onPress={handleCreateCookbook} className="flex-1 bg-red-600 py-3.5 rounded-xl items-center"><VietnamText className="font-semibold text-white text-base">Tạo mới</VietnamText></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isMenuVisible} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/40 justify-center items-center px-10" onPress={() => setIsMenuVisible(false)}>
          <View className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl">
            <View className="p-4 bg-gray-50 border-b border-gray-100 flex-row justify-between items-center">
              <VietnamText className="font-bold text-gray-900 text-lg line-clamp-1 flex-1">{selectedBook?.name}</VietnamText>
              <Icon as={X} size={20} className="text-gray-400" />
            </View>
            <Pressable onPress={() => { Alert.alert('Thông báo', 'Tính năng đổi tên sẽ có trong bản cập nhật sau.'); setIsMenuVisible(false); }} className="flex-row items-center gap-3 p-4 border-b border-gray-50">
              <Icon as={Edit2} size={20} className="text-gray-600" /><VietnamText className="font-medium text-gray-800 text-base">Chỉnh sửa tên</VietnamText>
            </Pressable>
            <Pressable onPress={handleDeleteCookbook} className="flex-row items-center gap-3 p-4">
              <Icon as={Trash2} size={20} className="text-red-600" /><VietnamText className="font-medium text-red-600 text-base">Xóa sổ tay</VietnamText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}