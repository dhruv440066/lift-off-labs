-- Add sample community data for demonstration

-- Insert sample community posts
INSERT INTO public.community_posts (user_id, title, content, post_type, category, likes_count, comments_count, is_pinned) VALUES
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Welcome to our Eco Community!', 'Hey everyone! Let''s share our best recycling tips and support each other in making our city cleaner and greener. Looking forward to connecting with fellow eco-warriors!', 'discussion', 'general', 5, 3, true),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'DIY Compost Bin Tutorial', 'Here''s how I made an amazing compost bin from old plastic containers. It''s been working great for 6 months now! Materials needed: Large plastic container, drill, wire mesh, organic waste. Steps: 1) Drill holes in container 2) Add wire mesh base 3) Start adding organic waste in layers...', 'tip', 'composting', 12, 7, false),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Weekly Recycling Challenge', 'Challenge: This week, let''s all try to reduce our plastic waste by 50%. Share your progress and tips below! Winner gets bragging rights and 100 bonus points 🏆', 'challenge', 'recycling', 8, 4, false),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Best Energy-Saving Apps', 'I''ve been testing different apps to track my home energy consumption. Here are my top 3 recommendations and why they work so well...', 'tip', 'energy_saving', 6, 2, false);

-- Insert sample community events
INSERT INTO public.community_events (organizer_id, title, description, event_date, location, max_participants, current_participants, event_type, status, points_reward) VALUES
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Mumbai Beach Cleanup Drive', 'Join us for a massive beach cleanup at Juhu Beach. We''ll provide gloves, bags, and refreshments. Let''s make our beautiful coastline pristine again!', '2025-10-01 08:00:00+00:00', 'Juhu Beach, Mumbai', 50, 12, 'cleanup', 'upcoming', 100),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Composting Workshop for Beginners', 'Learn the art of home composting from expert gardeners. We''ll cover everything from choosing the right materials to maintaining your compost bin.', '2025-09-28 10:00:00+00:00', 'Community Center, Bandra', 25, 8, 'workshop', 'upcoming', 75),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Plastic-Free Living Challenge', 'A month-long challenge to reduce plastic consumption. Weekly meetups, progress tracking, and prizes for the most innovative alternatives!', '2025-10-15 18:00:00+00:00', 'Various locations', 100, 23, 'competition', 'upcoming', 200);

-- Insert sample comments
INSERT INTO public.community_comments (post_id, user_id, content, likes_count) VALUES
((SELECT id FROM public.community_posts WHERE title = 'Welcome to our Eco Community!' LIMIT 1), '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'So excited to be part of this community! Already learned so much from everyone.', 2),
((SELECT id FROM public.community_posts WHERE title = 'Welcome to our Eco Community!' LIMIT 1), '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Count me in! I have some great energy-saving tips to share.', 3),
((SELECT id FROM public.community_posts WHERE title = 'DIY Compost Bin Tutorial' LIMIT 1), '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'This is exactly what I needed! Going to try this weekend.', 4),
((SELECT id FROM public.community_posts WHERE title = 'DIY Compost Bin Tutorial' LIMIT 1), '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'Great tutorial! I made mine last month and it''s working wonderfully.', 1);

-- Insert some likes
INSERT INTO public.community_likes (user_id, post_id) VALUES
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', (SELECT id FROM public.community_posts WHERE title = 'Welcome to our Eco Community!' LIMIT 1)),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', (SELECT id FROM public.community_posts WHERE title = 'DIY Compost Bin Tutorial' LIMIT 1));

-- Insert event participants
INSERT INTO public.community_event_participants (event_id, user_id, participation_status) VALUES
((SELECT id FROM public.community_events WHERE title = 'Mumbai Beach Cleanup Drive' LIMIT 1), '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'registered'),
((SELECT id FROM public.community_events WHERE title = 'Composting Workshop for Beginners' LIMIT 1), '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 'registered');