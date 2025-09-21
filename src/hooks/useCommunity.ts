import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  post_type: 'discussion' | 'tip' | 'event' | 'challenge';
  category: 'general' | 'recycling' | 'composting' | 'energy_saving' | 'events' | 'tips';
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    level: string;
  };
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
    level: string;
  };
}

export interface CommunityEvent {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  max_participants?: number;
  current_participants: number;
  event_type: 'cleanup' | 'workshop' | 'awareness' | 'competition';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  points_reward: number;
  created_at: string;
  profiles?: {
    full_name: string;
    level: string;
  };
}

export const useCommunityPosts = (category?: string) => {
  const { user } = useAuth();
  
  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['community-posts', category],
    queryFn: async () => {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles(full_name, level)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CommunityPost[];
    },
    enabled: !!user?.id
  });

  return { posts, isLoading, error };
};

export const useCommunityEvents = () => {
  const { user } = useAuth();
  
  const {
    data: events,
    isLoading,
    error
  } = useQuery({
    queryKey: ['community-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_events')
        .select(`
          *,
          profiles(full_name, level)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as CommunityEvent[];
    },
    enabled: !!user?.id
  });

  return { events, isLoading, error };
};

export const usePostComments = (postId: string) => {
  const { user } = useAuth();
  
  const {
    data: comments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles(full_name, level)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as CommunityComment[];
    },
    enabled: !!user?.id && !!postId
  });

  return { comments, isLoading, error };
};

export const useCommunityMutations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: async (postData: {
      title: string;
      content: string;
      post_type: string;
      category: string;
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          ...postData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    }
  });

  const createComment = useMutation({
    mutationFn: async (commentData: {
      post_id: string;
      content: string;
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          ...commentData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    }
  });

  const toggleLike = useMutation({
    mutationFn: async ({ postId, commentId }: { postId?: string; commentId?: string }) => {
      if (!user?.id) throw new Error('No user');
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('community_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('community_likes')
          .delete()
          .eq('id', existingLike.id);
        if (error) throw error;
        return 'unliked';
      } else {
        // Like
        const { error } = await supabase
          .from('community_likes')
          .insert({
            user_id: user.id,
            post_id: postId || null,
            comment_id: commentId || null
          });
        if (error) throw error;
        return 'liked';
      }
    },
    onSuccess: (_, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      }
      if (variables.commentId) {
        queryClient.invalidateQueries({ queryKey: ['post-comments'] });
      }
    }
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description: string;
      event_date: string;
      location: string;
      max_participants?: number;
      event_type: string;
      points_reward: number;
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('community_events')
        .insert({
          ...eventData,
          organizer_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
    }
  });

  const joinEvent = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('community_event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
    }
  });

  return {
    createPost,
    createComment,
    toggleLike,
    createEvent,
    joinEvent
  };
};

export const useLeaderboard = () => {
  const { user } = useAuth();
  
  const {
    data: leaderboard,
    isLoading,
    error
  } = useQuery({
    queryKey: ['community-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, total_points, level, city')
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  return { leaderboard, isLoading, error };
};