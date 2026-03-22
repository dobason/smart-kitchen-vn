import * as React from 'react';
import { View, ScrollView, Pressable, TextInput, Alert, Modal, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, ChevronRight, Plus, ChefHat, ArrowDown10, MoreVertical, Edit2, Trash2, X, Camera, Image as ImageIcon, BookOpen, Flame, Clock, ImagePlus } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as ImagePicker from 'expo-image-picker';

// DỮ LIỆU TĨNH SỔ TAY
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
    if (!newBookName.trim()) {
      Alert.alert("Lỗi", "Tên sổ tay không được để trống!"); return;
    }
    const newBook = {
      id: Date.now().toString(),
      name: newBookName,
      count: 0,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80'
    };
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
      {/* --- HEADER --- */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row gap-6">
          <Pressable onPress={() => setActiveTab('recipe')} className={activeTab === 'recipe' ? "border-b-4 border-red-600 pb-1" : "pb-1"}>
            <VietnamText className={`text-xl font-bold ${activeTab === 'recipe' ? 'text-gray-900' : 'text-gray-400'}`}>CÔNG THỨC</VietnamText>
          </Pressable>
          <Pressable onPress={() => setActiveTab('cookbook')} className={activeTab === 'cookbook' ? "border-b-4 border-red-600 pb-1" : "pb-1"}>
            <VietnamText className={`text-xl font-bold ${activeTab === 'cookbook' ? 'text-gray-900' : 'text-gray-400'}`}>SỔ TAY</VietnamText>
          </Pressable>
        </View>
        <Pressable className="bg-red-600 p-2 rounded-full">
          <Icon as={ChefHat} size={20} className="text-white" />
        </Pressable>
      </View>

      {/* --- NỘI DUNG CHÍNH --- */}
      {activeTab === 'recipe' ? (
        <ScrollView className="flex-1 bg-white" contentContainerClassName="pb-32 pt-2">
          {/* Thanh tìm kiếm */}
          <View className="flex-row items-center px-4 py-3 gap-3">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
              <Icon as={Search} size={20} className="text-gray-400" />
              <TextInput placeholder="Search in my recipes" className="flex-1 ml-2 text-base font-medium text-gray-900" placeholderTextColor="#9ca3af" />
            </View>
            <Pressable><Icon as={SlidersHorizontal} size={24} className="text-gray-600" /></Pressable>
          </View>

          {/* Banner Quota */}
          <View className="px-4 py-2">
            <View className="flex-row items-center justify-between bg-green-50 rounded-2xl p-4 border border-green-100">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-yellow-400 rounded-lg relative items-center justify-center">
                  <Icon as={BookOpen} size={20} className="text-gray-800" />
                  <View className="absolute -bottom-1 -right-1 bg-green-600 rounded-full w-4 h-4 items-center justify-center border border-white">
                    <VietnamText className="text-[8px] font-bold text-white">↓</VietnamText>
                  </View>
                </View>
                <VietnamText className="text-gray-800 font-medium text-base">Today's remaining imports: <VietnamText className="text-green-600 font-bold">10</VietnamText></VietnamText>
              </View>
              <Icon as={ChevronRight} size={20} className="text-gray-400" />
            </View>
          </View>

          {/* --- DANH SÁCH CÔNG THỨC --- */}
          <View className="px-4 mt-4 flex-row flex-wrap justify-between gap-y-6">

            <Pressable className="w-[48%] bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm pb-4">
              <View className="relative">
                <Image source={{ uri: 'https://images.squarespace-cdn.com/content/v1/66628bdc6b0b0d52d914a921/1752754499896-E9EAAEK78ESN8KAJV33G/unsplash-image-_33r6H_hiz4.jpg?format=1500w' }} className="w-full aspect-square" />
                <View className="absolute -bottom-3 right-3 bg-white p-1 rounded-full shadow-sm">
                  <View className="bg-red-600 p-1.5 rounded-full">
                    <Icon as={ImagePlus} size={14} className="text-white" />
                  </View>
                </View>
              </View>
              <View className="px-3 mt-4">
                <VietnamText className="text-lg font-bold text-gray-900" numberOfLines={2}>Súp phở</VietnamText>
                <VietnamText className="text-gray-400 text-xs mt-1" numberOfLines={1}>600ml nước, 100g bánh phở...</VietnamText>
                
                <View className="flex-row items-center justify-between mt-3">
                  <View className="flex-row items-center bg-orange-50 px-2 py-1 rounded-md gap-1">
                    <Icon as={Flame} size={12} className="text-orange-500" />
                    <VietnamText className="font-bold text-gray-800 text-[10px]">300 Cal</VietnamText>
                  </View>
                  <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md gap-1">
                    <Icon as={Clock} size={12} className="text-gray-400" />
                    <VietnamText className="font-bold text-gray-600 text-[10px]">15 min</VietnamText>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>         
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="pb-32 pt-4">
          <View className="flex-row justify-end px-4 pb-4"><Icon as={ArrowDown10} size={24} className="text-gray-600" /></View>
          <View className="px-4 flex-row flex-wrap gap-x-[4%] gap-y-6">
            
            {cookbooks.map((book) => (
              <Pressable key={book.id} className="w-[48%] bg-white rounded-2xl p-3 shadow-sm border border-gray-100 overflow-visible">
                <View className="relative">
                  <View className="absolute -top-2 -right-2 w-full aspect-[4/3] rounded-xl bg-gray-200 border border-gray-100" />
                  <View className="absolute -top-1 -right-1 w-full aspect-[4/3] rounded-xl bg-gray-300 border border-gray-100" />
                  <Image source={{ uri: book.image }} className="w-full aspect-[4/3] rounded-xl bg-gray-100 z-10" />
                  <Pressable onPress={() => { setSelectedBook(book); setIsMenuVisible(true); }} className="absolute top-1 right-1 p-2 z-20">
                    <Icon as={MoreVertical} size={20} className="text-white drop-shadow-md" />
                  </Pressable>
                </View>
                <View className="mt-4">
                  <VietnamText className="font-bold text-lg text-gray-900" numberOfLines={1}>{book.name}</VietnamText>
                  <VietnamText className="text-sm text-gray-500 mt-1">{book.count} Công thức</VietnamText>
                </View>
              </Pressable>
            ))}

            <Pressable onPress={() => setIsAddModalVisible(true)} className="w-[48%] aspect-[4/5] border-2 border-dashed border-red-300 bg-red-50/50 rounded-2xl items-center justify-center overflow-hidden">
              <View className="bg-red-100 p-4 rounded-full mb-3 shadow-inner shadow-red-200/50"><Icon as={Plus} size={28} className="text-red-600" /></View>
              <VietnamText className="text-red-600 font-medium text-base">Thêm Sổ Tay</VietnamText>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* --- TRẢ LẠI MÀU ĐỎ CHO NÚT FAB LỚN --- */}
      <Pressable onPress={() => setIsImportVisible(true)} className="absolute bottom-6 right-6 bg-red-600 w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-600/40 z-10">
        <Icon as={Plus} size={32} className="text-white" />
      </Pressable>

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

      {/* ================= BẢNG TRƯỢT IMPORT ================= */}
      <Modal visible={isImportVisible} transparent animationType="slide">
        <SafeAreaView className="flex-1 bg-black/40 justify-end" edges={['top', 'bottom']}>
          <Pressable className="flex-1" onPress={() => !isLoadingAI && setIsImportVisible(false)} />

          <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-2xl relative">
            {isLoadingAI && (
              <View className="absolute inset-0 bg-white/90 z-50 items-center justify-center rounded-t-[32px]">
                <ActivityIndicator size="large" color="#dc2626" />
                <VietnamText className="mt-4 text-red-600 font-bold text-lg animate-pulse">AI đang phân tích dữ liệu...</VietnamText>
              </View>
            )}
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-10" />

            <View className="flex-row justify-center gap-10 px-2 mb-10">
              <Pressable onPress={handleCameraPress} disabled={isLoadingAI} className="items-center gap-3">
                <View className="w-[60px] h-[60px] bg-yellow-400 rounded-2xl items-center justify-center shadow-sm"><Icon as={Camera} size={26} className="text-white" /></View>
                <VietnamText className="text-sm font-medium text-gray-900">Camera</VietnamText>
              </Pressable>
              <Pressable onPress={handlePhotoPress} disabled={isLoadingAI} className="items-center gap-3">
                <View className="w-[60px] h-[60px] bg-blue-500 rounded-2xl items-center justify-center shadow-sm"><Icon as={ImageIcon} size={26} className="text-white" /></View>
                <VietnamText className="text-sm font-medium text-gray-900">Ảnh</VietnamText>
              </Pressable>
            </View>

            <Pressable className="flex-row items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <View className="flex-row items-center gap-4"><Icon as={BookOpen} size={22} className="text-gray-500" /><VietnamText className="font-semibold text-lg text-gray-900">Hướng dẫn thêm công thức</VietnamText></View>
              <Icon as={ChevronRight} size={24} className="text-gray-400" />
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}