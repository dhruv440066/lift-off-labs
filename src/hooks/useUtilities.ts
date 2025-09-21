import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Utility {
  id: string;
  name: string;
  description?: string;
  category: 'recycling_tools' | 'eco_products' | 'energy_saving' | 'water_saving' | 'composting' | 'other';
  price_points: number;
  price_currency?: number;
  vendor_name?: string;
  image_url?: string;
  availability_status: 'available' | 'out_of_stock' | 'discontinued';
  specifications?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UtilityPurchase {
  id: string;
  user_id: string;
  utility_id: string;
  quantity: number;
  points_spent: number;
  currency_spent?: number;
  delivery_address: string;
  delivery_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  delivery_date?: string;
  created_at: string;
  updated_at: string;
  utilities?: Utility;
}

export interface CreatePurchaseData {
  utility_id: string;
  quantity: number;
  delivery_address: string;
}

export const useUtilities = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: utilities,
    isLoading: utilitiesLoading,
    error: utilitiesError
  } = useQuery({
    queryKey: ['utilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('utilities')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as Utility[];
    }
  });

  const {
    data: purchases,
    isLoading: purchasesLoading,
    error: purchasesError
  } = useQuery({
    queryKey: ['utility-purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('utility_purchases')
        .select(`
          *,
          utilities(name, description, image_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id
  });

  const purchaseUtility = useMutation({
    mutationFn: async ({ purchaseData, utility }: { purchaseData: CreatePurchaseData; utility: Utility }) => {
      if (!user?.id) throw new Error('No user');
      
      const totalCost = utility.price_points * purchaseData.quantity;
      
      const { data, error } = await supabase
        .from('utility_purchases')
        .insert({
          ...purchaseData,
          user_id: user.id,
          points_spent: totalCost,
          currency_spent: utility.price_currency ? utility.price_currency * purchaseData.quantity : null
        })
        .select()
        .single();

      if (error) throw error;
      
      // Deduct points from user profile
      await supabase
        .from('profiles')
        .update({ 
          total_points: (await supabase.from('profiles').select('total_points').eq('user_id', user.id).single()).data?.total_points - totalCost 
        })
        .eq('user_id', user.id);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utility-purchases', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }
  });

  return {
    utilities,
    purchases,
    isLoading: utilitiesLoading || purchasesLoading,
    error: utilitiesError || purchasesError,
    purchaseUtility
  };
};