import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { LeaderboardUser } from '@/types/user';

interface RankItemProps {
  user: LeaderboardUser;
}

const RankItem: React.FC<RankItemProps> = ({ user }) => {
  // Gradient colors for rank badge
  const getRankColors = (rank: number): [string, string] => {
    if (rank === 4) return ['#FFD700', '#FFA500']; // Gold
    if (rank === 5) return ['#FF6B6B', '#FF5252']; // Red
    if (rank === 6) return ['#9C27B0', '#7B1FA2']; // Purple
    if (rank === 7) return ['#FF9800', '#F57C00']; // Orange
    if (rank === 8) return ['#2196F3', '#1976D2']; // Blue
    if (rank === 9) return ['#4CAF50', '#388E3C']; // Green
    if (rank === 10) return ['#FF5722', '#E64A19']; // Deep Orange
    return ['#FFC107', '#FF9800']; // Default Yellow
  };

  const colors = getRankColors(user.rank);

  return (
    <TouchableOpacity
      className="flex-row items-center py-3"
      activeOpacity={0.7}
    >
      {/* Rank Badge with Gradient & Star */}
      <View className="w-14 items-center justify-center mr-3 relative">
        {/* Star Background */}
        <View className="absolute">
          <Text style={{ fontSize: 48, color: colors[0] }}>⭐</Text>
        </View>
        
        {/* Rank Number Badge */}
        <View 
          className="w-8 h-8 rounded-full items-center justify-center absolute"
          style={{ 
            backgroundColor: colors[1],
            borderWidth: 2,
            borderColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
            bottom: 2
          }}
        >
          <Text className="font-quicksandBold text-white text-sm">
            {user.rank}
          </Text>
        </View>
      </View>

      {/* Avatar with rounded corners */}
      <Image
        source={{ uri: user.avatar }}
        className="w-14 h-14 mr-3"
        style={{ 
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#f0f0f0'
        }}
      />

      {/* User Info */}
      <View className="flex-1">
        <Text 
          className="font-quicksandBold text-gray-800"
          style={{ fontSize: 16 }}
          numberOfLines={1}
        >
          {user.name}
        </Text>
      </View>

      {/* Points */}
      <Text 
        className="font-quicksandBold"
        style={{ 
          fontSize: 18,
          color: '#2E7D32'
        }}
      >
        {user.sustainabilityPoints}
      </Text>
    </TouchableOpacity>
  );
};

export default RankItem;