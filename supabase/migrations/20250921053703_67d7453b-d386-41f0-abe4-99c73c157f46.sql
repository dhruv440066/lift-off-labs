-- Fix Function Search Path Vulnerabilities ONLY
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