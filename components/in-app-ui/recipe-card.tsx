import * as React from 'react';
import { View, Pressable, Image } from 'react-native';
import { Flame, Clock, ImagePlus } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';

interface RecipeCardProps {
  title: string;
  ingredients: string;
  calories: number;
  time: number;
  imageUrl: string;
}

export function RecipeCard({ title, ingredients, calories, time, imageUrl }: RecipeCardProps) {
  return (
    <Pressable className="w-[48%] bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm pb-4">
      <View className="relative">
        <Image source={{ uri: imageUrl }} className="w-full aspect-square" />
        <View className="absolute -bottom-3 right-3 bg-white p-1 rounded-full shadow-sm">
          <View className="bg-red-600 p-1.5 rounded-full">
            <Icon as={ImagePlus} size={14} className="text-white" />
          </View>
        </View>
      </View>
      <View className="px-3 mt-4">
        <VietnamText className="text-lg font-bold text-gray-900" numberOfLines={2}>{title}</VietnamText>
        <VietnamText className="text-gray-400 text-xs mt-1" numberOfLines={1}>{ingredients}</VietnamText>
        
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center bg-orange-50 px-2 py-1 rounded-md gap-1">
            <Icon as={Flame} size={12} className="text-orange-500" />
            <VietnamText className="font-bold text-gray-800 text-[10px]">{calories} Cal</VietnamText>
          </View>
          <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md gap-1">
            <Icon as={Clock} size={12} className="text-gray-400" />
            <VietnamText className="font-bold text-gray-600 text-[10px]">{time} min</VietnamText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}