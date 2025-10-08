import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import TopThreePodium from '@/components/leaderboard/TopThreePodium';
import RankItem from '@/components/leaderboard/RankItem';
import RewardModal from '@/components/leaderboard/RewardModal';
import { MOCK_LEADERBOARD, RANK_REWARDS } from '@/constants/leaderboardData';

type TimeFilter = 'last-month' | 'this-month' | 'all';

const FILTERS: { key: TimeFilter; label: string }[] = [
  { key: 'last-month', label: 'Tháng trước' },
  { key: 'this-month', label: 'Tháng này' },
  { key: 'all', label: 'Tất cả' },
];

export default function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('this-month');
  const [showRewardModal, setShowRewardModal] = useState(false);

  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const restOfUsers = MOCK_LEADERBOARD.slice(3);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#66BB6A', '#4CAF50', '#43A047']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={['top']}>
          {/* Header - Clean & Simple */}
          <View className="px-5 py-4 flex-row items-center justify-between">
            {/* Empty space for balance */}
            <View style={{ width: 40 }} />
            
            {/* Title */}
            <Text className="text-white font-quicksandBold text-xl">
              Bảng xếp hạng
            </Text>
            
            {/* Reward Chest Button */}
            <TouchableOpacity 
              className="w-10 h-10 items-center justify-center"
              onPress={() => setShowRewardModal(true)}
              activeOpacity={0.7}
            >
              <View 
                className="items-center justify-center"
                style={{
                  shadowColor: '#FFD700',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                }}
              >
                <Text style={{ fontSize: 28 }}>🎁</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Top 3 Podium */}
            <TopThreePodium users={topThree} />

            {/* White Card Container */}
            <View 
              className="bg-white"
              style={{ 
                marginTop: 24,
                marginHorizontal: 16,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                minHeight: 500,
                paddingBottom: 40
              }}
            >
              {/* Filter Tabs */}
              <View className="px-4 pt-4 pb-2">
                <View 
                  className="flex-row p-1"
                  style={{ 
                    backgroundColor: '#2E7D32',
                    borderRadius: 16
                  }}
                >
                  {FILTERS.map((filter) => (
                    <TouchableOpacity
                      key={filter.key}
                      onPress={() => setSelectedFilter(filter.key)}
                      className="flex-1 py-3 items-center justify-center"
                      style={{
                        backgroundColor: selectedFilter === filter.key ? '#4CAF50' : 'transparent',
                        borderRadius: 12,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        className="font-quicksandBold"
                        style={{
                          fontSize: 14,
                          color: selectedFilter === filter.key ? 'white' : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Leaderboard List */}
              <View className="px-4 pt-2">
                {restOfUsers.map((user) => (
                  <RankItem key={user.id} user={user} />
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Reward Modal */}
      <RewardModal
        visible={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        rewards={RANK_REWARDS}
        currentRank={topThree[0]?.rank || 1}
      />
    </View>
  );
}
