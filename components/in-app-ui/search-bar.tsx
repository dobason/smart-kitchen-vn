import { Icon } from "../ui/icon";
import { Search, X } from 'lucide-react-native';
import * as React from 'react';
import { TextInput, Pressable, View, Keyboard } from 'react-native';


type SearchBarProps = {
    query: string;
    setQuery: (text: string) => void; //Để cập nhật trạng thái (state) ở component cha
    onClose: () => void;
    placeholder: string; //Để linh hoạt hiển thị gợi ý (Ví dụ: "Tìm món ngon...", "Tìm đầu bếp...").
};


export function SearchBar({ query, setQuery, onClose, placeholder }: SearchBarProps) {
    return (
        <View className="flex-row items-center gap-2">
            <View className="flex-1 flex-row items-center gap-2 rounded-full bg-white px-4 py-2">
                <Icon as={Search} size={20} className="text-[#777780]" />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={placeholder}
                    placeholderTextColor="#777780"
                    className="flex-1 text-base text-[#121212]"
                />
                {query.length > 0 && (
                    <Pressable onPress={() => setQuery('')}>
                        <Icon as={X} size={20} className="text-[#777780]" />
                    </Pressable>
                )}
            </View>
            <Pressable onPress={onClose} className="h-10 w-10 items-center justify-center rounded-full bg-white">
                <Icon as={X} size={20} className="text-[#121212]" />
            </Pressable>
        </View>
    );
};

