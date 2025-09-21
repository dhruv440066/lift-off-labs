-- Add foreign key constraints for proper relations
ALTER TABLE public.community_posts 
ADD CONSTRAINT community_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

ALTER TABLE public.community_comments 
ADD CONSTRAINT community_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

ALTER TABLE public.community_comments 
ADD CONSTRAINT community_comments_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;

ALTER TABLE public.community_likes 
ADD CONSTRAINT community_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

ALTER TABLE public.community_likes 
ADD CONSTRAINT community_likes_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;

ALTER TABLE public.community_likes 
ADD CONSTRAINT community_likes_comment_id_fkey 
FOREIGN KEY (comment_id) REFERENCES public.community_comments(id) ON DELETE CASCADE;

ALTER TABLE public.community_events 
ADD CONSTRAINT community_events_organizer_id_fkey 
FOREIGN KEY (organizer_id) REFERENCES public.profiles(user_id);

ALTER TABLE public.community_event_participants 
ADD CONSTRAINT community_event_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

ALTER TABLE public.community_event_participants 
ADD CONSTRAINT community_event_participants_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.community_events(id) ON DELETE CASCADE;