import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: 'general' | 'environmental' | 'policy' | 'technology' | 'community' | 'recycling' | 'energy';
  article_type: 'news' | 'announcement' | 'update' | 'alert';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  author_name: string;
  featured_image_url?: string;
  is_published: boolean;
  is_featured: boolean;
  publish_date: string;
  views_count: number;
  likes_count: number;
  tags: string[];
  external_source?: string;
  external_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
    level: string;
  } | null;
}

export interface NewsletterSubscription {
  id: string;
  user_id: string;
  email: string;
  categories: string[];
  is_active: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export const useNewsArticles = (category?: string, featured?: boolean) => {
  const { user } = useAuth();
  
  const {
    data: articles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['news-articles', category, featured],
    queryFn: async () => {
      let query = supabase
        .from('news_articles')
        .select('*')
        .eq('is_published', true)
        .order('priority', { ascending: false })
        .order('publish_date', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as NewsArticle[] || [];
    },
    enabled: !!user?.id
  });

  return { articles, isLoading, error };
};

export const useNewsArticle = (articleId: string) => {
  const { user } = useAuth();
  
  const {
    data: article,
    isLoading,
    error
  } = useQuery({
    queryKey: ['news-article', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', articleId)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      // Increment view count
      await supabase.rpc('increment_article_views', { article_id: articleId });
      
      return data as NewsArticle;
    },
    enabled: !!user?.id && !!articleId
  });

  return { article, isLoading, error };
};

export const useNewsComments = (articleId: string) => {
  const { user } = useAuth();
  
  const {
    data: comments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['news-comments', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_comments')
        .select(`
          *,
          profiles(full_name, level)
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as NewsComment[] || [];
    },
    enabled: !!user?.id && !!articleId
  });

  return { comments, isLoading, error };
};

export const useNewsletterSubscription = () => {
  const { user } = useAuth();
  
  const {
    data: subscription,
    isLoading,
    error
  } = useQuery({
    queryKey: ['newsletter-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      return data as NewsletterSubscription | null;
    },
    enabled: !!user?.id
  });

  return { subscription, isLoading, error };
};

export const useNewsMutations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: async (commentData: {
      article_id: string;
      content: string;
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('news_comments')
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
      queryClient.invalidateQueries({ queryKey: ['news-comments', variables.article_id] });
    }
  });

  const toggleLike = useMutation({
    mutationFn: async ({ articleId, commentId }: { articleId?: string; commentId?: string }) => {
      if (!user?.id) throw new Error('No user');
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('news_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq(articleId ? 'article_id' : 'comment_id', articleId || commentId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('news_likes')
          .delete()
          .eq('id', existingLike.id);
        if (error) throw error;
        return 'unliked';
      } else {
        // Like
        const { error } = await supabase
          .from('news_likes')
          .insert({
            user_id: user.id,
            article_id: articleId || null,
            comment_id: commentId || null
          });
        if (error) throw error;
        return 'liked';
      }
    },
    onSuccess: (_, variables) => {
      if (variables.articleId) {
        queryClient.invalidateQueries({ queryKey: ['news-articles'] });
        queryClient.invalidateQueries({ queryKey: ['news-article', variables.articleId] });
      }
      if (variables.commentId) {
        queryClient.invalidateQueries({ queryKey: ['news-comments'] });
      }
    }
  });

  const subscribeNewsletter = useMutation({
    mutationFn: async (subscriptionData: {
      email: string;
      categories: string[];
      frequency: string;
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .upsert({
          user_id: user.id,
          ...subscriptionData,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscription', user?.id] });
    }
  });

  const updateNewsletterSubscription = useMutation({
    mutationFn: async (updates: Partial<NewsletterSubscription>) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscription', user?.id] });
    }
  });

  return {
    createComment,
    toggleLike,
    subscribeNewsletter,
    updateNewsletterSubscription
  };
};