import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Reward {
  id: string;
  title: string;
  description?: string;
  points_required: number;
  reward_type: 'discount' | 'voucher' | 'product' | 'cashback';
  value_amount?: number;
  vendor_name?: string;
  terms_conditions?: string;
  expiry_days: number;
  max_redemptions?: number;
  current_redemptions: number;
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
  status: 'active' | 'used' | 'expired';
  expiry_date?: string;
  redemption_code?: string;
  rewards: Reward;
}

export const useRewards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: rewards,
    isLoading: rewardsLoading,
    error: rewardsError
  } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_required');

      if (error) throw error;
      return data as Reward[];
    }
  });

  const {
    data: userRewards,
    isLoading: userRewardsLoading,
    error: userRewardsError
  } = useQuery({
    queryKey: ['user-rewards', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          rewards(*)
        `)
        .eq('user_id', user.id)
        .order('redeemed_at', { ascending: false });

      if (error) throw error;
      return data as UserReward[];
    },
    enabled: !!user?.id
  });

  const redeemReward = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user?.id) throw new Error('No user');
      
      // Generate redemption code
      const redemptionCode = `WW${Date.now().toString(36).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('user_rewards')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          redemption_code: redemptionCode,
          expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-rewards', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }
  });

  return {
    rewards,
    userRewards,
    isLoading: rewardsLoading || userRewardsLoading,
    error: rewardsError || userRewardsError,
    redeemReward
  };
};