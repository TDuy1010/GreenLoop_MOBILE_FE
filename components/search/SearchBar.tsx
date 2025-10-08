import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Tìm kiếm sản phẩm...' 
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
    Keyboard.dismiss();
  };

  return (
    <View 
      className={`bg-gray-50 px-4 py-3 rounded-xl flex-row items-center ${
        isFocused ? 'border-2 border-green-600' : ''
      }`}
    >
      <Ionicons name="search" size={20} color={isFocused ? "#16A34A" : "#9CA3AF"} />
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 ml-3 font-quicksand text-gray-800 text-base"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear}
          className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;