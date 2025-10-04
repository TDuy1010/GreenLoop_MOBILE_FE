import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const CustomButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  className = '',
}: CustomButtonProps) => {
  const baseClasses = 'py-5 px-6 rounded-2xl items-center justify-center shadow-sm';
  const variantClasses = variant === 'primary' 
    ? 'bg-green-600 active:bg-green-700' 
    : 'bg-gray-50 border border-gray-200 active:bg-gray-100';
  const disabledClasses = (disabled || loading) ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#374151'} />
      ) : (
        <Text 
          className={`font-quicksandSemiBold text-base ${
            variant === 'primary' ? 'text-white' : 'text-gray-800'
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;