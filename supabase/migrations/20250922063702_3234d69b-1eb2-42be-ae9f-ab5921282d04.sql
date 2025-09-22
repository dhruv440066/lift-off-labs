-- Update the check constraint to allow 'tip' as an article_type
ALTER TABLE public.news_articles 
DROP CONSTRAINT news_articles_article_type_check;

ALTER TABLE public.news_articles 
ADD CONSTRAINT news_articles_article_type_check 
CHECK (article_type IN ('news', 'announcement', 'update', 'alert', 'tip'));

-- Now insert the sample news articles
INSERT INTO public.news_articles (title, content, excerpt, category, article_type, priority, author_name, is_featured, tags) VALUES

('New Government Policy on Plastic Waste Management', 
'The government has announced new comprehensive policies to tackle plastic waste across the country. The new regulations include mandatory plastic waste segregation, extended producer responsibility, and significant penalties for non-compliance. These measures are expected to reduce plastic pollution by 60% over the next five years.

Key highlights of the policy:
- Mandatory segregation at source for all plastic waste
- Ban on single-use plastics in public spaces
- Extended Producer Responsibility (EPR) for plastic manufacturers
- Incentives for recycling businesses and waste management companies
- Heavy penalties for illegal dumping of plastic waste

The policy will be implemented in phases starting from major metropolitan cities and gradually expanding to rural areas. Citizens are encouraged to participate actively in waste segregation and recycling programs.',
'Government introduces comprehensive plastic waste management policies with strict regulations and incentives for recycling.',
'policy', 'announcement', 'high', 'Ministry of Environment', true, 
ARRAY['policy', 'plastic', 'government', 'regulations', 'recycling']),

('Revolutionary AI-Powered Waste Sorting Technology', 
'A breakthrough in artificial intelligence is transforming waste management. New AI-powered sorting systems can identify and separate different types of waste with 99.5% accuracy, significantly improving recycling efficiency.

The technology uses computer vision and machine learning to:
- Identify different materials (plastic, paper, glass, metal)
- Sort waste at unprecedented speeds
- Reduce contamination in recycling streams
- Optimize resource recovery

Several cities have already implemented pilot programs with remarkable results. The technology is expected to reduce waste processing costs by 40% while improving recycling rates.',
'New AI technology achieves 99.5% accuracy in waste sorting, revolutionizing recycling efficiency.',
'technology', 'news', 'normal', 'Tech Innovation Weekly', true,
ARRAY['AI', 'technology', 'automation', 'recycling', 'innovation']),

('Mumbai Community Achieves Zero Waste Milestone', 
'The Bandra West community in Mumbai has successfully achieved zero waste to landfill status, becoming the first residential area in India to reach this milestone. Through intensive community participation and innovative waste management practices, the area has diverted 100% of its waste from landfills.

Success factors included:
- Door-to-door waste collection and segregation
- Community composting programs
- Local recycling initiatives
- Waste reduction awareness campaigns
- Partnership with local waste management companies

The model is now being replicated in other parts of Mumbai and across different cities in India.',
'Bandra West becomes India''s first zero-waste residential community through innovative waste management.',
'community', 'news', 'high', 'Mumbai Environmental Reporter', true,
ARRAY['community', 'zero-waste', 'mumbai', 'achievement', 'model']),

('Composting at Home: Complete Beginner''s Guide', 
'Home composting is one of the most effective ways to reduce household waste while creating nutrient-rich soil for gardens. This comprehensive guide covers everything you need to know to start composting at home.

Getting started:
- Choose the right composting method (bin, tumbler, or pile)
- Understand the brown-green material ratio
- Maintain proper moisture and aeration
- Monitor temperature and turning schedule
- Troubleshoot common problems

Benefits of home composting:
- Reduces household waste by 30-40%
- Creates valuable soil amendment
- Reduces methane emissions from landfills
- Saves money on fertilizers and soil conditioners
- Connects you with natural cycles

With proper setup and maintenance, you can have rich compost ready in 3-6 months.',
'Complete guide to home composting: reduce waste by 40% while creating nutrient-rich soil.',
'recycling', 'tip', 'normal', 'EcoWaste Team', false,
ARRAY['composting', 'home', 'guide', 'organic waste', 'soil']);

-- Add some sample comments
INSERT INTO public.news_comments (article_id, user_id, content) VALUES
((SELECT id FROM public.news_articles WHERE title LIKE '%Mumbai Community%' LIMIT 1), 
 '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 
 'This is incredible! As a Mumbai resident, I''m so proud of the Bandra West community. We need to implement this model citywide.'),

((SELECT id FROM public.news_articles WHERE title LIKE '%AI-Powered Waste%' LIMIT 1), 
 '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 
 'The future of waste management is here! This technology could revolutionize how we handle recycling globally.');

-- Add some likes
INSERT INTO public.news_likes (user_id, article_id) VALUES
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', (SELECT id FROM public.news_articles WHERE title LIKE '%Mumbai Community%' LIMIT 1)),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', (SELECT id FROM public.news_articles WHERE title LIKE '%AI-Powered Waste%' LIMIT 1));