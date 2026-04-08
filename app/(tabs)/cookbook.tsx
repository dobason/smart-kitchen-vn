import * as React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, MoreVertical, ChefHat, ArrowDown10 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';

const mockCookbooks = [
  { id: '1', name: 'Chưa phân loại', count: 2, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
  { id: '2', name: 'Món tráng miệng', count: 1, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80' },
  { id: '3', name: 'Bữa tối', count: 0, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' },
];

export default function CookbookScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* --- HEADER: Tabs CÔNG THỨC & SỔ TAY --- */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <View className="flex-row gap-6">
          <Pressable onPress={() => router.push('/recipe')} className="pb-1">
            <VietnamText className="text-xl font-bold text-gray-400">
              CÔNG THỨC
            </VietnamText>
          </Pressable>
          <Pressable className="border-b-4 border-red-600 pb-1">
            <VietnamText className="text-xl font-bold text-gray-900">
              SỔ TAY
            </VietnamText>
          </Pressable>
        </View>
        <Pressable className="bg-red-600 p-2 rounded-full">
          <Icon as={ChefHat} size={20} className="text-white" />
        </Pressable>
      </View>

      {/* --- ICON BỘ LỌC GÓC TRÊN --- */}
      <View className="flex-row justify-end px-4 py-3">
        <Icon as={ArrowDown10} size={24} className="text-gray-600" />
      </View>

      {/* --- LƯỚI DANH SÁCH SỔ TAY --- */}
      <ScrollView className="flex-1 px-4">
        <View className="flex-row flex-wrap justify-between gap-y-6 pb-24">
          
          {mockCookbooks.map((book) => (
            <Pressable key={book.id} className="w-[47%] bg-white rounded-[20px] p-3 shadow-sm border border-gray-100">
              <View className="relative">
                {/* Giả lập hiệu ứng ảnh xếp chồng bằng cách vẽ các viền */}
                <View className="absolute -top-2 -right-2 w-full aspect-[4/3] rounded-xl bg-gray-200 border border-gray-100" />
                <View className="absolute -top-1 -right-1 w-full aspect-[4/3] rounded-xl bg-gray-300 border border-gray-100" />
                <Image
                  source={{ uri: book.image }}
                  className="w-full aspect-[4/3] rounded-xl bg-gray-100 z-10"
                />
                <Pressable className="absolute top-1 right-1 p-1 z-20">
                  <Icon as={MoreVertical} size={20} className="text-white drop-shadow-md" />
                </Pressable>
              </View>
              <View className="mt-4">
                <VietnamText className="font-bold text-lg text-gray-900" numberOfLines={1}>
                  {book.name}
                </VietnamText>
                <VietnamText className="text-sm text-gray-500 mt-1">
                  {book.count} Công thức
                </VietnamText>
              </View>
            </Pressable>
          ))}

          {/* --- NÚT THÊM SỔ TAY (Nét đứt) --- */}
          <Pressable className="w-[47%] aspect-[4/5] border-2 border-dashed border-red-300 bg-red-50/50 rounded-[20px] items-center justify-center">
            <View className="bg-red-100 p-4 rounded-full mb-3">
              <Icon as={Plus} size={28} className="text-red-600" />
            </View>
            <VietnamText className="text-red-600 font-medium text-base">
              Thêm Sổ Tay
            </VietnamText>
          </Pressable>

        </View>
      </ScrollView>

      {/* --- NÚT FAB MÀU ĐỎ --- */}
      <Pressable
        onPress={() => router.push('/import-recipe')}
        className="absolute bottom-6 right-6 bg-red-600 w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-600/40"
      >
        <Icon as={Plus} size={32} className="text-white" />
      </Pressable>
    </SafeAreaView>
  );
}