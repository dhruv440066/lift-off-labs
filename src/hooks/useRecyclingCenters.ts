import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  operating_hours?: any;
  waste_types_accepted: string[];
  capacity_tons: number;
  current_load_tons: number;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useRecyclingCenters = () => {
  const {
    data: centers,
    isLoading,
    error
  } = useQuery({
    queryKey: ['recycling-centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recycling_centers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as RecyclingCenter[];
    }
  });

  return {
    centers,
    isLoading,
    error
  };
};