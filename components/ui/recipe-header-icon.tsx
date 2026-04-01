import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  PencilIcon, 
  Trash2Icon 
} from 'lucide-react-native';

export function RecipeHeaderIcons() {
  return (
    <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-2">
      {/* Nút Back */}
      <TouchableOpacity
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      >
        <Icon as={ArrowLeftIcon} size={20} className="text-white" />
      </TouchableOpacity>

      {/* Nhóm nút chức năng bên phải */}
      <View className="flex-row gap-3">
        {[PrinterIcon, PencilIcon, Trash2Icon].map((Ic, i) => (
          <TouchableOpacity
            key={i}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <Icon as={Ic} size={18} className="text-white" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}