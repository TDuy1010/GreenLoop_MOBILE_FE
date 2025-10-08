import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RankReward } from '@/types/user';

interface RewardModalProps {
  visible: boolean;
  onClose: () => void;
  rewards: RankReward[];
  currentRank: number;
}

const RewardModal: React.FC<RewardModalProps> = ({ visible, onClose, rewards, currentRank }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          {/* Header */}
          <LinearGradient
            colors={['#4CAF50', '#388E3C']}
            className="rounded-t-3xl px-6 py-6"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-quicksandBold text-2xl">
                  Phần thưởng 🎁
                </Text>
                <Text className="text-white/80 font-quicksand text-sm mt-1">
                  Xem phần thưởng theo xếp hạng
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Content */}
          <ScrollView className="flex-1 px-6 pt-6">
            <View className="items-center mb-6">
              <Text style={{ fontSize: 64 }}>🏆</Text>
              <Text className="font-quicksandBold text-xl text-gray-800 mt-2">
                Hạng hiện tại: #{currentRank}
              </Text>
              <Text className="font-quicksand text-sm text-gray-500 mt-1">
                Càng cao hạng, càng nhiều phần thưởng!
              </Text>
            </View>

            {/* Reward Tiers */}
            <View className="mb-6">
              {[
                { rank: '1', title: 'Hạng Nhất', icon: '👑', color: '#FFD700', rewards: ['5000 điểm xanh', 'Voucher 500K', 'Huy hiệu vàng'] },
                { rank: '2-3', title: 'Hạng Nhì & Ba', icon: '🥈', color: '#C0C0C0', rewards: ['3000 điểm xanh', 'Voucher 300K', 'Huy hiệu bạc'] },
                { rank: '4-10', title: 'Top 10', icon: '🥉', color: '#CD7F32', rewards: ['1500 điểm xanh', 'Voucher 150K', 'Huy hiệu đồng'] },
                { rank: '11-50', title: 'Top 50', icon: '🌟', color: '#4CAF50', rewards: ['500 điểm xanh', 'Voucher 50K'] },
              ].map((tier, index) => (
                <View 
                  key={index}
                  className="mb-4 rounded-2xl p-4"
                  style={{ backgroundColor: tier.color + '20', borderWidth: 2, borderColor: tier.color }}
                >
                  <View className="flex-row items-center mb-3">
                    <Text style={{ fontSize: 32, marginRight: 8 }}>{tier.icon}</Text>
                    <View>
                      <Text className="font-quicksandBold text-lg text-gray-800">
                        {tier.title}
                      </Text>
                      <Text className="font-quicksand text-sm text-gray-600">
                        Hạng {tier.rank}
                      </Text>
                    </View>
                  </View>
                  
                  {tier.rewards.map((reward, idx) => (
                    <View key={idx} className="flex-row items-center mb-2">
                      <View 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: tier.color }}
                      />
                      <Text className="font-quicksand text-sm text-gray-700">
                        {reward}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default RewardModal;