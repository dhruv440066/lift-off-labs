-- Insert sample eco-friendly products into utilities table
INSERT INTO public.utilities (name, description, category, price_points, price_currency, vendor_name, image_url, availability_status, specifications) VALUES
-- Recycling Tools
('Smart Waste Segregator', 'AI-powered waste sorting bin with 4 compartments for different waste types. Helps you sort waste efficiently and earn more points.', 'recycling_tools', 150, 2499.99, 'EcoTech Solutions', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'available', '{"capacity": "50L", "compartments": 4, "power": "Solar/Battery", "dimensions": "60x40x80cm"}'),

('Compost Maker Pro', 'Advanced home composting system that converts organic waste into nutrient-rich compost in just 21 days.', 'composting', 200, 3999.99, 'GreenLife Tech', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'available', '{"capacity": "25kg", "process_time": "21 days", "material": "Recycled plastic", "warranty": "2 years"}'),

('Eco-Friendly Recycling Bags', 'Set of 50 biodegradable waste collection bags made from cornstarch. Perfect for organic waste collection.', 'recycling_tools', 25, 299.99, 'BioBag India', 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400', 'available', '{"count": 50, "material": "Cornstarch", "biodegradable": true, "size": "Medium"}'),

-- Eco Products
('Solar Power Bank', 'Portable solar charger with 20000mAh capacity. Charge your devices using clean solar energy anywhere.', 'energy_saving', 180, 2799.99, 'SolarMax', 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400', 'available', '{"capacity": "20000mAh", "solar_panel": "Monocrystalline", "outputs": "USB-A, USB-C", "waterproof": "IP65"}'),

('Bamboo Toothbrush Set', 'Set of 4 eco-friendly bamboo toothbrushes with soft bristles. Completely biodegradable alternative to plastic.', 'eco_products', 40, 399.99, 'EcoBrush Co.', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400', 'available', '{"count": 4, "material": "Bamboo handle", "bristles": "Soft nylon", "biodegradable": true}'),

('Reusable Water Bottle', 'Stainless steel insulated water bottle that keeps drinks cold for 24h or hot for 12h. BPA-free and leak-proof.', 'eco_products', 60, 899.99, 'HydroGreen', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 'available', '{"capacity": "750ml", "material": "Stainless steel", "insulation": "Double wall", "bpa_free": true}'),

-- Energy Saving
('LED Smart Bulb Kit', 'Set of 6 smart LED bulbs with app control, dimming, and color changing. Uses 80% less energy than traditional bulbs.', 'energy_saving', 120, 1999.99, 'SmartLite', 'https://images.unsplash.com/photo-1558403194-611308249627?w=400', 'available', '{"count": 6, "wattage": "9W", "equivalent": "60W incandescent", "lifespan": "25000 hours", "smart_features": true}'),

('Solar Garden Lights', 'Set of 8 decorative solar-powered garden lights. Automatically turn on at dusk and provide 8 hours of illumination.', 'energy_saving', 80, 1299.99, 'SolarGarden', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 'available', '{"count": 8, "power_source": "Solar", "runtime": "8 hours", "waterproof": "IP44", "auto_on_off": true}'),

-- Water Saving
('Smart Water Monitor', 'WiFi-enabled water usage monitor that tracks consumption and detects leaks. Helps reduce water waste by up to 30%.', 'water_saving', 220, 3499.99, 'AquaSmart', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400', 'available', '{"connectivity": "WiFi", "leak_detection": true, "app_control": true, "water_savings": "Up to 30%"}'),

('Rainwater Harvesting Kit', 'Complete kit for collecting and storing rainwater. Includes filters, storage tank, and distribution system.', 'water_saving', 300, 4999.99, 'RainHarvest Pro', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'available', '{"tank_capacity": "500L", "filtration": "Multi-stage", "material": "Food grade plastic", "installation": "DIY friendly"}'),

-- Composting
('Worm Composting Bin', 'Complete vermicomposting setup with red worms. Turn kitchen scraps into premium organic fertilizer.', 'composting', 90, 1499.99, 'WormFarm India', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'available', '{"capacity": "15kg", "includes_worms": true, "harvest_time": "3-4 months", "odor_free": true}'),

('Bokashi Composting Kit', 'Japanese fermentation method for composting all food waste including meat and dairy. Complete starter kit included.', 'composting', 110, 1799.99, 'Bokashi Organics', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'available', '{"method": "Fermentation", "accepts": "All food waste", "process_time": "14 days", "includes": "Starter kit"}'),

-- Other
('Eco-Friendly Lunch Box', 'Stainless steel lunch box with multiple compartments. Keeps food fresh and eliminates need for disposable containers.', 'other', 35, 549.99, 'GreenBox', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'available', '{"material": "Stainless steel", "compartments": 3, "leak_proof": true, "dishwasher_safe": true}'),

('Plant-Based Cleaning Kit', 'Set of 5 natural cleaning products made from plant-based ingredients. Safe for family and environment.', 'other', 70, 999.99, 'CleanGreen', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400', 'available', '{"count": 5, "ingredients": "Plant-based", "chemical_free": true, "biodegradable": true}'),

('Seed Starter Kit', 'Everything needed to start your own vegetable garden. Includes seeds, soil, pots, and growing guide.', 'other', 45, 699.99, 'Urban Farmer', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'available', '{"seeds": "10 varieties", "includes": "Soil, pots, guide", "organic": true, "difficulty": "Beginner friendly"}');