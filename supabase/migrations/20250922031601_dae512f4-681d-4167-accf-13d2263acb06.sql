-- Create News & Updates Tables

-- News Articles Table
CREATE TABLE public.news_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'environmental', 'policy', 'technology', 'community', 'recycling', 'energy')),
  article_type text NOT NULL DEFAULT 'news' CHECK (article_type IN ('news', 'announcement', 'update', 'alert')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  author_name text DEFAULT 'EcoWaste Team',
  featured_image_url text,
  is_published boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  publish_date timestamp with time zone DEFAULT now(),
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  external_source text,
  external_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- News Comments Table
CREATE TABLE public.news_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- News Likes Table
CREATE TABLE public.news_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  article_id uuid,
  comment_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT news_likes_target_check CHECK ((article_id IS NOT NULL AND comment_id IS NULL) OR (article_id IS NULL AND comment_id IS NOT NULL)),
  UNIQUE(user_id, article_id),
  UNIQUE(user_id, comment_id)
);

-- Newsletter Subscriptions Table
CREATE TABLE public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  categories text[] DEFAULT '{"general", "environmental", "community"}',
  is_active boolean DEFAULT true,
  frequency text NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all news tables
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for News Articles
CREATE POLICY "Anyone can view published articles" ON public.news_articles FOR SELECT USING (is_published = true AND auth.uid() IS NOT NULL);

-- RLS Policies for News Comments
CREATE POLICY "Anyone can view comments" ON public.news_comments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create comments" ON public.news_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.news_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.news_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for News Likes
CREATE POLICY "Anyone can view likes" ON public.news_likes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create likes" ON public.news_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.news_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Newsletter Subscriptions
CREATE POLICY "Users can view own subscription" ON public.newsletter_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own subscription" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON public.newsletter_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscription" ON public.newsletter_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Add foreign key constraints
ALTER TABLE public.news_comments 
ADD CONSTRAINT news_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

ALTER TABLE public.news_comments 
ADD CONSTRAINT news_comments_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.news_articles(id) ON DELETE CASCADE;

ALTER TABLE public.news_likes 
ADD CONSTRAINT news_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

ALTER TABLE public.news_likes 
ADD CONSTRAINT news_likes_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.news_articles(id) ON DELETE CASCADE;

ALTER TABLE public.news_likes 
ADD CONSTRAINT news_likes_comment_id_fkey 
FOREIGN KEY (comment_id) REFERENCES public.news_comments(id) ON DELETE CASCADE;

ALTER TABLE public.newsletter_subscriptions 
ADD CONSTRAINT newsletter_subscriptions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_comments_updated_at BEFORE UPDATE ON public.news_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_newsletter_subscriptions_updated_at BEFORE UPDATE ON public.newsletter_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Functions to update counters
CREATE OR REPLACE FUNCTION public.update_article_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.article_id IS NOT NULL THEN
      UPDATE news_articles SET likes_count = likes_count + 1 WHERE id = NEW.article_id;
    ELSIF NEW.comment_id IS NOT NULL THEN
      UPDATE news_comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.article_id IS NOT NULL THEN
      UPDATE news_articles SET likes_count = likes_count - 1 WHERE id = OLD.article_id;
    ELSIF OLD.comment_id IS NOT NULL THEN
      UPDATE news_comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to increment article views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE news_articles 
  SET views_count = views_count + 1 
  WHERE id = article_id;
END;
$$;

-- Create triggers
CREATE TRIGGER update_article_likes_count_trigger
  AFTER INSERT OR DELETE ON public.news_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_article_likes_count();