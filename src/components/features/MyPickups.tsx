import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Package, Calendar, Clock, MapPin, Award, Phone } from 'lucide-react';
import { useWastePickups } from '@/hooks/useWastePickups';
import { format } from 'date-fns';

const MyPickups = () => {
  const { pickups, isLoading } = useWastePickups();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWasteTypeIcon = (type: string) => {
    switch (type) {
      case 'plastic': return '♻️';
      case 'paper': return '📄';
      case 'glass': return '🥛';
      case 'metal': return '🔩';
      case 'electronic': return '📱';
      case 'organic': return '🌿';
      default: return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeInScale">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">My Pickups</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInScale">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">My Pickups</h2>
      </div>

      {pickups && pickups.length > 0 ? (
        <div className="grid gap-4">
          {pickups.map((pickup) => (
            <Card key={pickup.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getWasteTypeIcon(pickup.waste_type)}</span>
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {pickup.waste_type.replace('_', ' ')} Waste
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(pickup.pickup_date), 'MMM dd, yyyy')}
                        <Clock className="w-4 h-4 ml-2" />
                        {pickup.pickup_time}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(pickup.status)}>
                    {pickup.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{pickup.pickup_address}</span>
                </div>

                {pickup.estimated_weight_kg && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>Estimated Weight:</span>
                    <span className="font-medium">{pickup.estimated_weight_kg} kg</span>
                  </div>
                )}

                {pickup.actual_weight_kg && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>Actual Weight:</span>
                    <span className="font-medium">{pickup.actual_weight_kg} kg</span>
                  </div>
                )}

                {pickup.points_awarded > 0 && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {pickup.points_awarded} points earned
                    </span>
                  </div>
                )}

                {pickup.special_instructions && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm"><strong>Instructions:</strong> {pickup.special_instructions}</p>
                  </div>
                )}

                {pickup.driver_notes && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm"><strong>Driver Notes:</strong> {pickup.driver_notes}</p>
                  </div>
                )}

                {(pickup as any).recycling_centers && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{(pickup as any).recycling_centers.name}</span>
                    {(pickup as any).recycling_centers.phone && (
                      <span className="text-muted-foreground">
                        • {(pickup as any).recycling_centers.phone}
                      </span>
                    )}
                  </div>
                )}

                {pickup.status === 'scheduled' && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pickups scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Schedule your first waste pickup to start earning points and helping the environment.
            </p>
            <Button>Schedule Pickup</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyPickups;