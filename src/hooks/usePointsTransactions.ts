import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PointsTransaction {
  id: string;
  user_id: string;
  pickup_id?: string;
  transaction_type: 'earned' | 'redeemed' | 'bonus' | 'penalty';
  points: number;
  description: string;
  metadata?: any;
  created_at: string;
}

export const usePointsTransactions = () => {
  const { user } = useAuth();

  const {
    data: transactions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['points-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as PointsTransaction[];
    },
    enabled: !!user?.id
  });

  return {
    transactions,
    isLoading,
    error
  };
};