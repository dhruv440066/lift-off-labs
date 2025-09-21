import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface IssueReport {
  id: string;
  user_id: string;
  issue_type: 'pickup_delay' | 'missed_pickup' | 'quality_issue' | 'driver_behavior' | 'payment_issue' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  pickup_id?: string;
  center_id?: string;
  attachments?: any;
  admin_notes?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIssueReportData {
  issue_type: string;
  title: string;
  description: string;
  priority?: string;
  pickup_id?: string;
  center_id?: string;
  attachments?: any;
}

export const useIssueReports = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: reports,
    isLoading,
    error
  } = useQuery({
    queryKey: ['issue-reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('issue_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as IssueReport[];
    },
    enabled: !!user?.id
  });

  const createReport = useMutation({
    mutationFn: async (reportData: CreateIssueReportData) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('issue_reports')
        .insert({
          ...reportData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-reports', user?.id] });
    }
  });

  return {
    reports,
    isLoading,
    error,
    createReport
  };
};