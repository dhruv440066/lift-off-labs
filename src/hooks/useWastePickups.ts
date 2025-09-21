import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface WastePickup {
  id: string;
  user_id: string;
  center_id?: string;
  pickup_date: string;
  pickup_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  waste_type: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronic' | 'organic' | 'mixed';
  estimated_weight_kg?: number;
  actual_weight_kg?: number;
  pickup_address: string;
  special_instructions?: string;
  points_awarded: number;
  driver_id?: string;
  driver_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePickupData {
  pickup_date: string;
  pickup_time: string;
  waste_type: string;
  estimated_weight_kg?: number;
  pickup_address: string;
  special_instructions?: string;
  center_id?: string;
}

export const useWastePickups = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: pickups,
    isLoading,
    error
  } = useQuery({
    queryKey: ['waste-pickups', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('waste_pickups')
        .select(`
          *,
          recycling_centers(name, address, phone)
        `)
        .eq('user_id', user.id)
        .order('pickup_date', { ascending: false });

      if (error) throw error;
      return data as WastePickup[];
    },
    enabled: !!user?.id
  });

  const createPickup = useMutation({
    mutationFn: async (pickupData: CreatePickupData) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('waste_pickups')
        .insert({
          ...pickupData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-pickups', user?.id] });
    }
  });

  const updatePickup = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WastePickup> }) => {
      const { data, error } = await supabase
        .from('waste_pickups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-pickups', user?.id] });
    }
  });

  return {
    pickups,
    isLoading,
    error,
    createPickup,
    updatePickup
  };
};