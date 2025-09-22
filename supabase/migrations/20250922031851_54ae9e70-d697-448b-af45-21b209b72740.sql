-- Add sample news articles for demonstration

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

('Energy Recovery from Waste: New Plant Opens in Delhi', 
'Delhi''s first state-of-the-art waste-to-energy plant has begun operations, capable of processing 2,000 tons of municipal solid waste daily while generating 40 MW of clean electricity. The plant represents a significant step towards sustainable waste management and renewable energy generation.

Plant specifications:
- Capacity: 2,000 tons/day waste processing
- Energy output: 40 MW electricity generation
- Emission controls: Advanced pollution control systems
- Job creation: 500+ direct and indirect jobs
- Carbon reduction: 1.5 million tons CO2 equivalent annually

The plant uses advanced incineration technology with stringent emission controls, ensuring minimal environmental impact while maximizing energy recovery.',
'Delhi''s new waste-to-energy plant processes 2,000 tons daily, generating 40 MW clean electricity.',
'energy', 'update', 'normal', 'Energy & Environment News', false,
ARRAY['waste-to-energy', 'delhi', 'renewable', 'electricity', 'sustainability']),

('Global Plastic Pollution Crisis: Latest Research Findings', 
'New research reveals alarming statistics about global plastic pollution, with microplastics now found in every corner of our planet. The study, conducted by international environmental organizations, highlights the urgent need for immediate action.

Key findings:
- 8 million tons of plastic enter oceans annually
- Microplastics detected in 83% of global tap water samples
- 1 million seabirds die yearly due to plastic pollution
- Plastic pollution affects 267 marine species
- Current recycling rates are insufficient to address the crisis

Scientists recommend immediate implementation of circular economy principles, increased recycling infrastructure, and stronger regulations on single-use plastics.',
'Latest research reveals critical state of global plastic pollution, calling for immediate action.',
'environmental', 'alert', 'urgent', 'Global Environmental Research', false,
ARRAY['plastic pollution', 'research', 'microplastics', 'ocean', 'crisis']),

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
ARRAY['composting', 'home', 'guide', 'organic waste', 'soil']),

('Urgent: Illegal Dumping Site Discovered in Suburban Area', 
'Environmental authorities have discovered a large illegal dumping site containing hazardous materials in the suburban area of Thane. Immediate cleanup operations have begun, and investigations are underway to identify responsible parties.

Site details:
- Area: 5 acres of contaminated land
- Waste types: Industrial chemicals, electronic waste, medical waste
- Environmental impact: Soil and groundwater contamination risk
- Health concerns: Potential exposure to toxic substances
- Cleanup timeline: 6-8 weeks estimated

Residents in surrounding areas are advised to:
- Avoid the contaminated area
- Report any unusual odors or symptoms
- Use alternative water sources if advised
- Follow health authority guidelines

This incident highlights the critical need for stricter enforcement of waste disposal regulations.',
'Illegal dumping site with hazardous materials discovered in Thane; cleanup operations underway.',
'environmental', 'alert', 'urgent', 'Environmental Protection Agency', false,
ARRAY['illegal dumping', 'hazardous waste', 'contamination', 'thane', 'cleanup']);

-- Add some sample comments
INSERT INTO public.news_comments (article_id, user_id, content) VALUES
((SELECT id FROM public.news_articles WHERE title LIKE '%Mumbai Community%' LIMIT 1), 
 '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 
 'This is incredible! As a Mumbai resident, I''m so proud of the Bandra West community. We need to implement this model citywide.'),

((SELECT id FROM public.news_articles WHERE title LIKE '%AI-Powered Waste%' LIMIT 1), 
 '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 
 'The future of waste management is here! This technology could revolutionize how we handle recycling globally.'),

((SELECT id FROM public.news_articles WHERE title LIKE '%Composting at Home%' LIMIT 1), 
 '5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', 
 'Started home composting last month following these tips. Already seeing great results and my kitchen waste has reduced significantly!');

-- Add some likes
INSERT INTO public.news_likes (user_id, article_id) VALUES
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', (SELECT id FROM public.news_articles WHERE title LIKE '%Mumbai Community%' LIMIT 1)),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', (SELECT id FROM public.news_articles WHERE title LIKE '%AI-Powered Waste%' LIMIT 1)),
('5ae6fbbe-13a8-4a1c-bad9-cd38dd011f7b', (SELECT id FROM public.news_articles WHERE title LIKE '%Government Policy%' LIMIT 1));