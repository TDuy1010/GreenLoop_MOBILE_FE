export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  sustainabilityPoints: number;
  rank: number;
  level: number;
}

export interface LeaderboardUser extends User {
  trend?: 'up' | 'down' | 'same';
  rankChange?: number;
}

export interface RankReward {
  minRank: number;
  maxRank: number;
  title: string;
  icon: string;
  rewards: Reward[];
  color: string;
}

export interface Reward {
  id: string;
  type: 'points' | 'badge' | 'voucher' | 'coin';
  name: string;
  description: string;
  icon: string;
  value?: number;
}