import React from 'react';
import { View, Text, Image } from 'react-native';
import type { LeaderboardUser } from '@/types/user';

interface TopThreePodiumProps {
  users: LeaderboardUser[];
}

interface PodiumUserProps {
  user: LeaderboardUser;
  position: 'left' | 'center' | 'right';
}

const PodiumUser: React.FC<PodiumUserProps> = ({ user, position }) => {
  const isCenter = position === 'center';
  
  const config = {
    1: { 
      icon: '👑', 
      podiumHeight: 140, 
      avatarSize: 100,
      avatarBorder: '#FFD700',
      podiumBg: '#FFD700',
      nameColor: '#FFD700',
      marginTop: 0
    },
    2: { 
      icon: '2', 
      podiumHeight: 110, 
      avatarSize: 80,
      avatarBorder: '#4CAF50',
      podiumBg: '#2E7D32',
      nameColor: '#81C784',
      marginTop: 30
    },
    3: { 
      icon: '3', 
      podiumHeight: 110, 
      avatarSize: 80,
      avatarBorder: '#4CAF50',
      podiumBg: '#2E7D32',
      nameColor: '#81C784',
      marginTop: 30
    },
  }[user.rank] || { 
    icon: '?', 
    podiumHeight: 80, 
    avatarSize: 70,
    avatarBorder: '#666',
    podiumBg: '#666',
    nameColor: '#999',
    marginTop: 40
  };
  
  return (
    <View 
      className="flex-1 items-center"
      style={{ marginTop: config.marginTop }}
    >
      {/* Crown for #1 */}
      {user.rank === 1 && (
        <View className="mb-2 items-center">
          <Text style={{ fontSize: 40 }}>{config.icon}</Text>
        </View>
      )}

      {/* Avatar Container */}
      <View 
        className="rounded-full mb-2"
        style={{ 
          backgroundColor: 'white',
          padding: 4,
          borderWidth: 5,
          borderColor: config.avatarBorder,
        }}
      >
        <Image
          source={{ uri: user.avatar }}
          style={{ 
            width: config.avatarSize, 
            height: config.avatarSize,
            borderRadius: config.avatarSize / 2
          }}
        />
        
        {/* Rank Badge for #2 and #3 */}
        {user.rank !== 1 && (
          <View 
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: config.podiumBg }}
          >
            <Text className="text-white font-quicksandBold text-base">
              {user.rank}
            </Text>
          </View>
        )}

        {/* Medal icon for #1 */}
        {user.rank === 1 && (
          <View 
            className="absolute -bottom-2 self-center bg-yellow-400 rounded-full w-10 h-10 items-center justify-center"
            style={{
              borderWidth: 3,
              borderColor: 'white',
            }}
          >
            <Text style={{ fontSize: 20 }}>🏅</Text>
          </View>
        )}
      </View>
      
      {/* Name */}
      <Text 
        className="font-quicksandBold text-center px-1 mt-1"
        style={{ 
          fontSize: isCenter ? 18 : 15,
          color: 'white'
        }}
        numberOfLines={1}
      >
        {user.name}
      </Text>
      
      {/* Points */}
      <Text 
        className="font-quicksandBold mt-1"
        style={{ 
          fontSize: isCenter ? 28 : 22,
          color: config.nameColor
        }}
      >
        {user.sustainabilityPoints}
      </Text>
      
      {/* Username */}
      <Text 
        className="font-quicksand text-white/70 mt-0.5"
        style={{ fontSize: 12 }}
      >
        {user.username}
      </Text>

      {/* Podium Base - Show rank number for ALL */}
      <View 
        className="w-full mt-4 items-center justify-center"
        style={{ 
          height: config.podiumHeight,
          backgroundColor: config.podiumBg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <Text 
          className="text-white font-quicksandBold" 
          style={{ fontSize: user.rank === 1 ? 48 : 40 }}
        >
          {user.rank}
        </Text>
      </View>
    </View>
  );
};

const TopThreePodium: React.FC<TopThreePodiumProps> = ({ users }) => {
  if (!users || users.length < 3) return null;

  const [first, second, third] = users;

  return (
    <View className="px-3 pt-6 pb-2">
      <View className="flex-row items-end justify-center">
        <PodiumUser user={second} position="left" />
        <View style={{ width: 8 }} />
        <PodiumUser user={first} position="center" />
        <View style={{ width: 8 }} />
        <PodiumUser user={third} position="right" />
      </View>
    </View>
  );
};

export default TopThreePodium;