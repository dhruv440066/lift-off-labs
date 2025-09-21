-- Fix Function Search Path Vulnerabilities
-- Update all database functions to include SET search_path = public for security

-- 1. Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- 2. Fix calculate_points_for_waste function
CREATE OR REPLACE FUNCTION public.calculate_points_for_waste(waste_type text, weight_kg numeric)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
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
$function$;

-- 3. Fix handle_pickup_completion function
CREATE OR REPLACE FUNCTION public.handle_pickup_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- 4. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 5. Secure Recycling Centers Access - Require Authentication
DROP POLICY IF EXISTS "Anyone can view recycling centers" ON public.recycling_centers;

CREATE POLICY "Authenticated users can view recycling centers" 
ON public.recycling_centers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 6. Add Database Constraints for Data Validation
-- Add CHECK constraints for enum-like fields to prevent invalid data

-- Profiles table constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('individual', 'business', 'organization'));

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_verification_status_check 
CHECK (verification_status IN ('pending', 'verified', 'rejected'));

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_level_check 
CHECK (level IN ('Eco Starter', 'Eco Guardian', 'Eco Warrior', 'Eco Champion'));

-- Waste pickups table constraints
ALTER TABLE public.waste_pickups 
ADD CONSTRAINT waste_pickups_status_check 
CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'));

ALTER TABLE public.waste_pickups 
ADD CONSTRAINT waste_pickups_waste_type_check 
CHECK (waste_type IN ('plastic', 'paper', 'glass', 'metal', 'electronic', 'organic', 'mixed'));

-- Issue reports table constraints
ALTER TABLE public.issue_reports 
ADD CONSTRAINT issue_reports_status_check 
CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'));

ALTER TABLE public.issue_reports 
ADD CONSTRAINT issue_reports_priority_check 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- Points transactions table constraints
ALTER TABLE public.points_transactions 
ADD CONSTRAINT points_transactions_type_check 
CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty'));

-- User rewards table constraints
ALTER TABLE public.user_rewards 
ADD CONSTRAINT user_rewards_status_check 
CHECK (status IN ('active', 'used', 'expired'));

-- Rewards table constraints
ALTER TABLE public.rewards 
ADD CONSTRAINT rewards_type_check 
CHECK (reward_type IN ('discount', 'voucher', 'gift_card', 'product', 'cashback'));

-- Utilities table constraints
ALTER TABLE public.utilities 
ADD CONSTRAINT utilities_category_check 
CHECK (category IN ('tools', 'composting', 'energy', 'water', 'eco_products', 'other'));

ALTER TABLE public.utilities 
ADD CONSTRAINT utilities_availability_check 
CHECK (availability_status IN ('available', 'out_of_stock', 'discontinued'));

-- Utility purchases table constraints
ALTER TABLE public.utility_purchases 
ADD CONSTRAINT utility_purchases_delivery_status_check 
CHECK (delivery_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));