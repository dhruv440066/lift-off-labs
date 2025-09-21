import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUtilities } from '@/hooks/useUtilities';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Package, Truck, Star, Coins } from 'lucide-react';

export const EcoStore: React.FC = () => {
  const { utilities, purchases, purchaseUtility } = useUtilities();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [selectedUtility, setSelectedUtility] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const categories = [
    { value: 'all', label: 'All Products', icon: Package },
    { value: 'recycling_tools', label: 'Recycling Tools', icon: Package },
    { value: 'eco_products', label: 'Eco Products', icon: Package },
    { value: 'energy_saving', label: 'Energy Saving', icon: Package },
    { value: 'water_saving', label: 'Water Saving', icon: Package },
    { value: 'composting', label: 'Composting', icon: Package }
  ];

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePurchase = async () => {
    if (!selectedUtility || !deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please provide delivery address.",
        variant: "destructive"
      });
      return;
    }

    const totalCost = selectedUtility.price_points * quantity;
    
    if ((profile?.total_points || 0) < totalCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${totalCost} points but only have ${profile?.total_points || 0}.`,
        variant: "destructive"
      });
      return;
    }

    try {
      await purchaseUtility.mutateAsync({
        purchaseData: {
          utility_id: selectedUtility.id,
          quantity,
          delivery_address: deliveryAddress
        },
        utility: selectedUtility
      });

      toast({
        title: "Purchase Successful",
        description: `${selectedUtility.name} has been ordered! Check your purchases for tracking.`
      });

      setSelectedUtility(null);
      setQuantity(1);
      setDeliveryAddress('');
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Unable to complete purchase. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-accent" />
            <div>
              <h2 className="text-2xl font-bold">EcoStore</h2>
              <p className="text-muted-foreground">Redeem your points for eco-friendly utilities and products</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Points</p>
            <div className="flex items-center gap-1 text-xl font-bold text-accent">
              <Coins className="w-5 h-5" />
              {profile?.total_points || 0}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="shop" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="space-y-6">
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilities?.map(utility => (
              <Card key={utility.id} className="p-4 hover:shadow-lg transition-shadow">
                {utility.image_url && (
                  <img 
                    src={utility.image_url} 
                    alt={utility.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{utility.name}</h3>
                    <Badge variant="secondary">{utility.category.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{utility.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-accent font-bold">
                      <Coins className="w-4 h-4" />
                      {utility.price_points}
                    </div>
                    <Badge 
                      variant={utility.availability_status === 'available' ? 'default' : 'secondary'}
                    >
                      {utility.availability_status}
                    </Badge>
                  </div>
                  {utility.vendor_name && (
                    <p className="text-xs text-muted-foreground">by {utility.vendor_name}</p>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        disabled={utility.availability_status !== 'available'}
                        onClick={() => setSelectedUtility(utility)}
                      >
                        {utility.availability_status === 'available' ? 'Purchase' : 'Out of Stock'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Purchase {utility.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Quantity</label>
                          <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Delivery Address</label>
                          <Input
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Enter your delivery address"
                          />
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between">
                            <span>Total Cost:</span>
                            <div className="flex items-center gap-1 font-bold text-accent">
                              <Coins className="w-4 h-4" />
                              {utility.price_points * quantity}
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={handlePurchase} 
                          className="w-full"
                          disabled={purchaseUtility.isPending}
                        >
                          {purchaseUtility.isPending ? 'Processing...' : 'Confirm Purchase'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {purchases?.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground">Start shopping to see your orders here!</p>
            </Card>
          ) : (
            purchases?.map(purchase => (
              <Card key={purchase.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{purchase.utilities?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {purchase.quantity} • {purchase.points_spent} points
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getDeliveryStatusColor(purchase.delivery_status)}>
                      {purchase.delivery_status.replace('_', ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {purchase.tracking_number && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>Tracking:</strong> {purchase.tracking_number}
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};