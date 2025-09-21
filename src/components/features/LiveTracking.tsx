import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWastePickups } from '@/hooks/useWastePickups';
import { useToast } from '@/hooks/use-toast';
import { 
  Truck, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Star,
  Route
} from 'lucide-react';

interface TrackingData {
  id: string;
  pickupId: string;
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  vehicleNumber: string;
  currentLocation: string;
  estimatedArrival: string;
  status: 'dispatched' | 'en_route' | 'nearby' | 'arrived' | 'in_progress' | 'completed';
  progress: number;
  lastUpdate: string;
  route: {
    totalDistance: string;
    estimatedTime: string;
    currentStep: string;
  };
}

export const LiveTracking: React.FC = () => {
  const { pickups } = useWastePickups();
  const { toast } = useToast();
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<TrackingData | null>(null);

  // Simulate real-time tracking data
  useEffect(() => {
    // Sample tracking data
    const sampleTracking: TrackingData[] = [
      {
        id: 'track_001',
        pickupId: 'pickup_123',
        driverName: 'Rajesh Kumar',
        driverPhone: '+91-9876543210',
        driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        vehicleNumber: 'MH 01 AB 1234',
        currentLocation: 'Bandra West, Mumbai',
        estimatedArrival: '10:30 AM',
        status: 'en_route',
        progress: 65,
        lastUpdate: new Date().toISOString(),
        route: {
          totalDistance: '8.5 km',
          estimatedTime: '15 mins',
          currentStep: 'Turning left on SV Road'
        }
      },
      {
        id: 'track_002',
        pickupId: 'pickup_124',
        driverName: 'Priya Sharma',
        driverPhone: '+91-9876543211',
        driverPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        vehicleNumber: 'MH 02 CD 5678',
        currentLocation: 'Andheri East, Mumbai',
        estimatedArrival: '11:00 AM',
        status: 'nearby',
        progress: 85,
        lastUpdate: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        route: {
          totalDistance: '12.2 km',
          estimatedTime: '8 mins',
          currentStep: 'Approaching your location'
        }
      }
    ];

    setTrackingData(sampleTracking);
    setSelectedTracking(sampleTracking[0]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTrackingData(prev => prev.map(tracking => ({
        ...tracking,
        progress: Math.min(100, tracking.progress + Math.random() * 5),
        lastUpdate: new Date().toISOString(),
        status: tracking.progress > 95 ? 'arrived' : tracking.status
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched': return 'bg-blue-500';
      case 'en_route': return 'bg-yellow-500';
      case 'nearby': return 'bg-orange-500';
      case 'arrived': return 'bg-green-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'dispatched': return <Truck className="w-4 h-4" />;
      case 'en_route': return <Navigation className="w-4 h-4" />;
      case 'nearby': return <MapPin className="w-4 h-4" />;
      case 'arrived': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleCallDriver = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleMessageDriver = (phone: string) => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the driver."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Route className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-2xl font-bold">Live Pickup Tracking</h2>
            <p className="text-muted-foreground">Track your waste pickup in real-time</p>
          </div>
        </div>

        {/* Active Trackings List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trackingData.map((tracking) => (
            <Card 
              key={tracking.id} 
              className={`p-4 cursor-pointer transition-all border-2 ${
                selectedTracking?.id === tracking.id 
                  ? 'border-accent bg-accent/5' 
                  : 'border-transparent hover:border-accent/50'
              }`}
              onClick={() => setSelectedTracking(tracking)}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge className={`${getStatusColor(tracking.status)} text-white flex items-center gap-1`}>
                  {getStatusIcon(tracking.status)}
                  {tracking.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm font-medium">{tracking.estimatedArrival}</span>
              </div>
              <div className="space-y-2">
                <p className="font-medium">{tracking.vehicleNumber}</p>
                <p className="text-sm text-muted-foreground">{tracking.currentLocation}</p>
                <Progress value={tracking.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{tracking.progress}% Complete</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Detailed Tracking View */}
      {selectedTracking && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Driver Information</h3>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={selectedTracking.driverPhoto} />
                <AvatarFallback>{selectedTracking.driverName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{selectedTracking.driverName}</h4>
                <p className="text-muted-foreground">{selectedTracking.vehicleNumber}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                  <span className="text-sm ml-1">4.8 (127 reviews)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleCallDriver(selectedTracking.driverPhone)}
              >
                <Phone className="w-4 h-4" />
                Call Driver
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleMessageDriver(selectedTracking.driverPhone)}
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            </div>
          </Card>

          {/* Pickup Progress */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Pickup Progress</h3>
            
            <div className="space-y-4">
              {/* Status Timeline */}
              <div className="space-y-3">
                {[
                  { status: 'dispatched', label: 'Pickup Dispatched', time: '09:00 AM', completed: true },
                  { status: 'en_route', label: 'Driver En Route', time: '09:15 AM', completed: true },
                  { status: 'nearby', label: 'Driver Nearby', time: '10:20 AM', completed: selectedTracking.status !== 'dispatched' && selectedTracking.status !== 'en_route' },
                  { status: 'arrived', label: 'Driver Arrived', time: selectedTracking.estimatedArrival, completed: selectedTracking.status === 'arrived' || selectedTracking.status === 'in_progress' || selectedTracking.status === 'completed' },
                  { status: 'completed', label: 'Pickup Complete', time: 'Pending', completed: selectedTracking.status === 'completed' }
                ].map((step, index) => (
                  <div key={step.status} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-sm">{selectedTracking.progress}%</span>
                </div>
                <Progress value={selectedTracking.progress} className="h-3" />
              </div>
            </div>
          </Card>

          {/* Route Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Route Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium">Current Location</p>
                  <p className="text-sm text-muted-foreground">{selectedTracking.currentLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Route className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium">Next Step</p>
                  <p className="text-sm text-muted-foreground">{selectedTracking.route.currentStep}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-semibold">{selectedTracking.route.totalDistance}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ETA</p>
                  <p className="font-semibold">{selectedTracking.route.estimatedTime}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(selectedTracking.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Pickup Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup ID:</span>
                <span className="font-medium">{selectedTracking.pickupId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle Number:</span>
                <span className="font-medium">{selectedTracking.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Arrival:</span>
                <span className="font-medium">{selectedTracking.estimatedArrival}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Driver Contact:</span>
                <span className="font-medium">{selectedTracking.driverPhone}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Pickup Instructions</span>
              </div>
              <p className="text-sm text-blue-700">
                Please keep your waste ready for collection. The driver will call you 10 minutes before arrival.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {trackingData.length === 0 && (
        <Card className="p-8 text-center">
          <Truck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Active Pickups</h3>
          <p className="text-muted-foreground">
            You don't have any active pickups to track right now. Schedule a pickup to see live tracking here.
          </p>
        </Card>
      )}
    </div>
  );
};