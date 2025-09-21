import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Truck } from 'lucide-react';
import { useWastePickups } from '@/hooks/useWastePickups';
import { useRecyclingCenters } from '@/hooks/useRecyclingCenters';
import { toast } from '@/hooks/use-toast';

const SchedulePickup = () => {
  const [formData, setFormData] = useState({
    pickup_date: '',
    pickup_time: '',
    waste_type: '',
    estimated_weight_kg: '',
    pickup_address: '',
    special_instructions: '',
    center_id: ''
  });

  const { createPickup } = useWastePickups();
  const { centers } = useRecyclingCenters();

  const wasteTypes = [
    { value: 'plastic', label: '♻️ Plastic', points: '10 pts/kg' },
    { value: 'paper', label: '📄 Paper', points: '5 pts/kg' },
    { value: 'glass', label: '🥛 Glass', points: '8 pts/kg' },
    { value: 'metal', label: '🔩 Metal', points: '15 pts/kg' },
    { value: 'electronic', label: '📱 Electronic', points: '25 pts/kg' },
    { value: 'organic', label: '🌿 Organic', points: '3 pts/kg' },
    { value: 'mixed', label: '📦 Mixed', points: '5 pts/kg' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pickup_date || !formData.pickup_time || !formData.waste_type || !formData.pickup_address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createPickup.mutateAsync({
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        waste_type: formData.waste_type,
        estimated_weight_kg: formData.estimated_weight_kg ? parseFloat(formData.estimated_weight_kg) : undefined,
        pickup_address: formData.pickup_address,
        special_instructions: formData.special_instructions || undefined,
        center_id: formData.center_id || undefined
      });

      toast({
        title: "Pickup Scheduled!",
        description: "Your waste pickup has been scheduled successfully."
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
        description: "Failed to schedule pickup. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeInScale">
      <div className="flex items-center gap-3">
        <Truck className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">Schedule Pickup</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Waste Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup_date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Pickup Date
                </Label>
                <Input
                  id="pickup_date"
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup_time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pickup Time
                </Label>
                <Input
                  id="pickup_time"
                  type="time"
                  value={formData.pickup_time}
                  onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Waste Type */}
            <div className="space-y-2">
              <Label>Waste Type</Label>
              <Select value={formData.waste_type} onValueChange={(value) => setFormData({ ...formData, waste_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{type.points}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Weight and Center */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_weight_kg">Estimated Weight (kg)</Label>
                <Input
                  id="estimated_weight_kg"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 5.5"
                  value={formData.estimated_weight_kg}
                  onChange={(e) => setFormData({ ...formData, estimated_weight_kg: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Center (Optional)</Label>
                <Select value={formData.center_id} onValueChange={(value) => setFormData({ ...formData, center_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recycling center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers?.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name} - {center.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="pickup_address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Address
              </Label>
              <Input
                id="pickup_address"
                placeholder="Enter your full address"
                value={formData.pickup_address}
                onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                required
              />
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="special_instructions">Special Instructions</Label>
              <Textarea
                id="special_instructions"
                placeholder="Any special instructions for the pickup team..."
                value={formData.special_instructions}
                onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={createPickup.isPending}
            >
              {createPickup.isPending ? 'Scheduling...' : 'Schedule Pickup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePickup;