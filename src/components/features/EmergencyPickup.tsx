import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWastePickups, CreatePickupData } from '@/hooks/useWastePickups';
import { useRecyclingCenters } from '@/hooks/useRecyclingCenters';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Clock, Zap, Info } from 'lucide-react';

export const EmergencyPickup: React.FC = () => {
  const { createPickup } = useWastePickups();
  const { centers } = useRecyclingCenters();
  const { profile } = useProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pickup_date: '',
    pickup_time: '',
    waste_type: '',
    estimated_weight_kg: '',
    pickup_address: '',
    special_instructions: '',
    center_id: ''
  });

  const EMERGENCY_FEE = 50; // Emergency fee in points

  const wasteTypes = [
    'plastic', 'paper', 'glass', 'metal', 'electronic', 'organic', 'mixed'
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.pickup_date || !formData.pickup_time || !formData.waste_type || !formData.pickup_address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check if user has enough points for emergency fee
    if ((profile?.total_points || 0) < EMERGENCY_FEE) {
      toast({
        title: "Insufficient Points",
        description: `Emergency pickup requires ${EMERGENCY_FEE} points. You have ${profile?.total_points || 0} points.`,
        variant: "destructive"
      });
      return;
    }

    // Check if date is within next 24 hours
    const selectedDate = new Date(`${formData.pickup_date}T${formData.pickup_time}`);
    const now = new Date();
    const hoursDifference = (selectedDate.getTime() - now.getTime()) / (1000 * 3600);
    
    if (hoursDifference > 24) {
      toast({
        title: "Invalid Date",
        description: "Emergency pickup must be within the next 24 hours.",
        variant: "destructive"
      });
      return;
    }

    try {
      const pickupData: CreatePickupData & { is_emergency?: boolean; emergency_fee_points?: number } = {
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        waste_type: formData.waste_type,
        estimated_weight_kg: formData.estimated_weight_kg ? parseFloat(formData.estimated_weight_kg) : undefined,
        pickup_address: formData.pickup_address,
        special_instructions: `EMERGENCY PICKUP: ${formData.special_instructions}`,
        center_id: formData.center_id || undefined
      };

      await createPickup.mutateAsync(pickupData);

      toast({
        title: "Emergency Pickup Scheduled",
        description: "Your emergency pickup has been scheduled. We'll prioritize your request and contact you shortly."
      });

      // Reset form
      setFormData({
        pickup_date: '',
        pickup_time: '',
        waste_type: '',
        estimated_weight_kg: '',
        pickup_address: '',
        special_instructions: '',
        center_id: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule emergency pickup. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Set minimum date to today and maximum to tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-600">Emergency Pickup</h2>
            <p className="text-muted-foreground">Urgent waste removal within 24 hours</p>
          </div>
        </div>

        {/* Emergency Info Alert */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Emergency Pickup Service:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Available 24/7 for urgent waste removal needs</li>
              <li>• Additional fee: {EMERGENCY_FEE} points</li>
              <li>• Priority scheduling within next 24 hours</li>
              <li>• Dedicated emergency response team</li>
            </ul>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pickup Date * <span className="text-red-500">(Within 24 hours)</span>
              </label>
              <Input
                type="date"
                min={today}
                max={tomorrow}
                value={formData.pickup_date}
                onChange={(e) => setFormData(prev => ({ ...prev, pickup_date: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pickup Time *</label>
              <Select value={formData.pickup_time} onValueChange={(value) => setFormData(prev => ({ ...prev, pickup_time: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Waste Type *</label>
              <Select value={formData.waste_type} onValueChange={(value) => setFormData(prev => ({ ...prev, waste_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estimated Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={formData.estimated_weight_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_weight_kg: e.target.value }))}
                placeholder="Enter estimated weight"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pickup Address *</label>
            <Input
              value={formData.pickup_address}
              onChange={(e) => setFormData(prev => ({ ...prev, pickup_address: e.target.value }))}
              placeholder="Enter complete pickup address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred Recycling Center</label>
            <Select value={formData.center_id} onValueChange={(value) => setFormData(prev => ({ ...prev, center_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select recycling center (optional)" />
              </SelectTrigger>
              <SelectContent>
                {centers?.map(center => (
                  <SelectItem key={center.id} value={center.id}>
                    {center.name} - {center.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Emergency Details *</label>
            <Textarea
              value={formData.special_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
              placeholder="Please describe the emergency situation and any special requirements..."
              rows={4}
              required
            />
          </div>

          {/* Cost Summary */}
          <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-600" />
                <span className="font-medium">Emergency Service Fee</span>
              </div>
              <span className="text-lg font-bold text-red-600">{EMERGENCY_FEE} points</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your current balance: {profile?.total_points || 0} points
            </p>
          </Card>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={createPickup.isPending || (profile?.total_points || 0) < EMERGENCY_FEE}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {createPickup.isPending ? 'Scheduling Emergency Pickup...' : 'Schedule Emergency Pickup'}
          </Button>
        </form>
      </Card>

      {/* Emergency Contact Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">24/7 Emergency Support</h3>
        </div>
        <p className="text-blue-700 text-sm">
          For immediate assistance or to speak with our emergency response team, 
          call our hotline: <strong>+91-9999-EMERGENCY</strong>
        </p>
      </Card>
    </div>
  );
};