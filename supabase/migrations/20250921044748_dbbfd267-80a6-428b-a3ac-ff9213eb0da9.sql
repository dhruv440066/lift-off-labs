-- Create issue reports table
CREATE TABLE public.issue_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('pickup_delay', 'missed_pickup', 'quality_issue', 'driver_behavior', 'payment_issue', 'other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  pickup_id UUID,
  center_id UUID,
  attachments JSONB,
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create utilities store table
CREATE TABLE public.utilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('recycling_tools', 'eco_products', 'energy_saving', 'water_saving', 'composting', 'other')),
  price_points INTEGER NOT NULL,
  price_currency NUMERIC,
  vendor_name TEXT,
  image_url TEXT,
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'out_of_stock', 'discontinued')),
  specifications JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create utility purchases table
CREATE TABLE public.utility_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  utility_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  points_spent INTEGER NOT NULL,
  currency_spent NUMERIC,
  delivery_address TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create center rewards table for bonus coins
CREATE TABLE public.center_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  center_id UUID NOT NULL,
  user_id UUID NOT NULL,
  bonus_points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  pickup_id UUID,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_rewards ENABLE ROW LEVEL SECURITY;

-- RLS policies for issue_reports
CREATE POLICY "Users can view their own issue reports" 
ON public.issue_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own issue reports" 
ON public.issue_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issue reports" 
ON public.issue_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for utilities
CREATE POLICY "Anyone can view active utilities" 
ON public.utilities 
FOR SELECT 
USING (is_active = true);

-- RLS policies for utility_purchases
CREATE POLICY "Users can view their own utility purchases" 
ON public.utility_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own utility purchases" 
ON public.utility_purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for center_rewards
CREATE POLICY "Users can view their own center rewards" 
ON public.center_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add emergency flag to waste_pickups
ALTER TABLE public.waste_pickups 
ADD COLUMN is_emergency BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN emergency_fee_points INTEGER DEFAULT 0;

-- Create trigger for updated_at
CREATE TRIGGER update_issue_reports_updated_at
BEFORE UPDATE ON public.issue_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_utilities_updated_at
BEFORE UPDATE ON public.utilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_utility_purchases_updated_at
BEFORE UPDATE ON public.utility_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();