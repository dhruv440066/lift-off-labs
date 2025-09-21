-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Mumbai',
  state TEXT DEFAULT 'Maharashtra',
  pincode TEXT,
  user_type TEXT DEFAULT 'individual' CHECK (user_type IN ('individual', 'business', 'organization')),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  total_points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Eco Starter',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recycling centers table
CREATE TABLE public.recycling_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  operating_hours JSONB,
  waste_types_accepted TEXT[] DEFAULT '{}',
  capacity_tons INTEGER DEFAULT 100,
  current_load_tons INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waste pickups table
CREATE TABLE public.waste_pickups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  center_id UUID REFERENCES public.recycling_centers(id),
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  waste_type TEXT NOT NULL CHECK (waste_type IN ('plastic', 'paper', 'glass', 'metal', 'electronic', 'organic', 'mixed')),
  estimated_weight_kg DECIMAL(10, 2),
  actual_weight_kg DECIMAL(10, 2),
  pickup_address TEXT NOT NULL,
  special_instructions TEXT,
  points_awarded INTEGER DEFAULT 0,
  driver_id UUID,
  driver_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create points transactions table
CREATE TABLE public.points_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_id UUID REFERENCES public.waste_pickups(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'bonus', 'penalty')),
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('discount', 'voucher', 'product', 'cashback')),
  value_amount DECIMAL(10, 2),
  vendor_name TEXT,
  terms_conditions TEXT,
  expiry_days INTEGER DEFAULT 30,
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user rewards (redemptions) table
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id),
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  expiry_date TIMESTAMP WITH TIME ZONE,
  redemption_code TEXT UNIQUE
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for recycling centers (public read)
CREATE POLICY "Anyone can view recycling centers" 
ON public.recycling_centers FOR SELECT 
USING (true);

-- RLS Policies for waste pickups
CREATE POLICY "Users can view their own pickups" 
ON public.waste_pickups FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pickups" 
ON public.waste_pickups FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pickups" 
ON public.waste_pickups FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for points transactions
CREATE POLICY "Users can view their own points transactions" 
ON public.points_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for rewards (public read)
CREATE POLICY "Anyone can view active rewards" 
ON public.rewards FOR SELECT 
USING (is_active = true);

-- RLS Policies for user rewards
CREATE POLICY "Users can view their own rewards" 
ON public.user_rewards FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can redeem rewards" 
ON public.user_rewards FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recycling_centers_updated_at 
BEFORE UPDATE ON public.recycling_centers 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_waste_pickups_updated_at 
BEFORE UPDATE ON public.waste_pickups 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at 
BEFORE UPDATE ON public.rewards 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate points based on waste weight
CREATE OR REPLACE FUNCTION public.calculate_points_for_waste(
  waste_type TEXT,
  weight_kg DECIMAL
) RETURNS INTEGER AS $$
DECLARE
  points_per_kg INTEGER;
BEGIN
  -- Points per kg based on waste type
  CASE waste_type
    WHEN 'plastic' THEN points_per_kg := 10;
    WHEN 'paper' THEN points_per_kg := 5;
    WHEN 'glass' THEN points_per_kg := 8;
    WHEN 'metal' THEN points_per_kg := 15;
    WHEN 'electronic' THEN points_per_kg := 25;
    WHEN 'organic' THEN points_per_kg := 3;
    ELSE points_per_kg := 5;
  END CASE;
  
  RETURN FLOOR(weight_kg * points_per_kg);
END;
$$ LANGUAGE plpgsql;

-- Create function to update user points when pickup is completed
CREATE OR REPLACE FUNCTION public.handle_pickup_completion()
RETURNS TRIGGER AS $$
DECLARE
  points_earned INTEGER;
BEGIN
  -- Only process when status changes to completed and actual weight is recorded
  IF NEW.status = 'completed' AND NEW.actual_weight_kg IS NOT NULL AND 
     (OLD.status != 'completed' OR OLD.actual_weight_kg IS NULL) THEN
    
    -- Calculate points
    points_earned := public.calculate_points_for_waste(NEW.waste_type, NEW.actual_weight_kg);
    
    -- Update pickup with points awarded
    NEW.points_awarded := points_earned;
    
    -- Add points transaction
    INSERT INTO public.points_transactions (user_id, pickup_id, transaction_type, points, description)
    VALUES (NEW.user_id, NEW.id, 'earned', points_earned, 
            'Points earned for ' || NEW.waste_type || ' waste disposal (' || NEW.actual_weight_kg || ' kg)');
    
    -- Update user total points
    UPDATE public.profiles 
    SET total_points = total_points + points_earned,
        level = CASE 
          WHEN total_points + points_earned >= 5000 THEN 'Eco Champion'
          WHEN total_points + points_earned >= 2000 THEN 'Eco Warrior'
          WHEN total_points + points_earned >= 500 THEN 'Eco Guardian'
          ELSE 'Eco Starter'
        END
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for pickup completion
CREATE TRIGGER on_pickup_completion
  BEFORE UPDATE ON public.waste_pickups
  FOR EACH ROW EXECUTE FUNCTION public.handle_pickup_completion();

-- Insert sample recycling centers
INSERT INTO public.recycling_centers (name, address, city, state, pincode, latitude, longitude, phone, waste_types_accepted, operating_hours) VALUES
('EcoHub Mumbai Central', 'Shop No. 15, Green Plaza, Mumbai Central', 'Mumbai', 'Maharashtra', '400008', 19.0176, 72.8562, '+91-22-2345-6789', 
 ARRAY['plastic', 'paper', 'glass', 'metal'], 
 '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-18:00", "saturday": "9:00-15:00", "sunday": "closed"}'::jsonb),

('Green Cycle Bandra', 'Unit 204, Eco Tower, Bandra West', 'Mumbai', 'Maharashtra', '400050', 19.0544, 72.8181, '+91-22-2678-9012', 
 ARRAY['plastic', 'paper', 'electronic', 'metal'], 
 '{"monday": "8:00-19:00", "tuesday": "8:00-19:00", "wednesday": "8:00-19:00", "thursday": "8:00-19:00", "friday": "8:00-19:00", "saturday": "8:00-16:00", "sunday": "10:00-14:00"}'::jsonb),

('RecycleMart Andheri', 'Plot 45, Industrial Area, Andheri East', 'Mumbai', 'Maharashtra', '400069', 19.1136, 72.8697, '+91-22-2890-1234', 
 ARRAY['plastic', 'paper', 'glass', 'metal', 'electronic', 'organic'], 
 '{"monday": "7:00-20:00", "tuesday": "7:00-20:00", "wednesday": "7:00-20:00", "thursday": "7:00-20:00", "friday": "7:00-20:00", "saturday": "7:00-18:00", "sunday": "9:00-15:00"}'::jsonb);

-- Insert sample rewards
INSERT INTO public.rewards (title, description, points_required, reward_type, value_amount, vendor_name, terms_conditions, max_redemptions) VALUES
('₹50 Shopping Voucher', 'Get ₹50 off on your next purchase at partner stores', 500, 'voucher', 50.00, 'EcoMart', 'Valid for 30 days. Cannot be combined with other offers.', 1000),
('Free Coffee', 'Complimentary coffee at Green Café', 200, 'product', 0.00, 'Green Café', 'Valid at all Mumbai locations. One per customer per day.', 500),
('₹100 Cashback', 'Direct cashback to your wallet', 1000, 'cashback', 100.00, 'WasteWise', 'Credited within 24 hours of redemption.', 200),
('Eco-Friendly Tote Bag', 'Premium jute tote bag with WasteWise branding', 300, 'product', 0.00, 'WasteWise', 'Limited edition. While stocks last.', 100),
('20% Discount on Organic Products', 'Get 20% off on organic groceries', 750, 'discount', 0.00, 'Organic Valley', 'Valid on minimum purchase of ₹500. Maximum discount ₹200.', 300);