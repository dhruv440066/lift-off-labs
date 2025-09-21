import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Gift, Award, Star, ShoppingBag } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';

const RewardsCenter = () => {
  const { rewards, userRewards, redeemReward } = useRewards();
  const { profile } = useProfile();

  const handleRedeem = async (rewardId: string, pointsRequired: number) => {
    if (!profile) return;
    
    if (profile.total_points < pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: `You need ${pointsRequired - profile.total_points} more points to redeem this reward.`,
        variant: "destructive"
      });
      return;
    }

    try {
      await redeemReward.mutateAsync(rewardId);
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been added to your account."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'voucher': return '🎫';
      case 'product': return '🎁';
      case 'cashback': return '💰';
      case 'discount': return '🏷️';
      default: return '🎁';
    }
  };

  return (
    <div className="space-y-6 animate-fadeInScale">
      <div className="flex items-center gap-3">
        <Gift className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">Rewards Center</h2>
      </div>

      {/* Points Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Points</h3>
              <p className="text-3xl font-bold text-primary">
                {profile?.total_points || 0}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold">Level</h3>
              <Badge variant="outline" className="text-sm">
                {profile?.level || 'Eco Starter'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Available Rewards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards?.map((reward) => (
            <Card key={reward.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getRewardIcon(reward.reward_type)}</span>
                    <div>
                      <CardTitle className="text-base">{reward.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{reward.vendor_name}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {reward.points_required} pts
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm">{reward.description}</p>
                
                {reward.value_amount && reward.value_amount > 0 && (
                  <p className="text-lg font-semibold text-primary">
                    ₹{reward.value_amount}
                  </p>
                )}

                {reward.terms_conditions && (
                  <p className="text-xs text-muted-foreground">
                    {reward.terms_conditions}
                  </p>
                )}

                <Button 
                  className="w-full" 
                  size="sm"
                  disabled={
                    !profile || 
                    profile.total_points < reward.points_required || 
                    redeemReward.isPending ||
                    (reward.max_redemptions && reward.current_redemptions >= reward.max_redemptions)
                  }
                  onClick={() => handleRedeem(reward.id, reward.points_required)}
                >
                  {redeemReward.isPending ? 'Redeeming...' : 
                   !profile || profile.total_points < reward.points_required ? 
                   `Need ${reward.points_required - (profile?.total_points || 0)} more pts` : 
                   'Redeem'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* My Rewards */}
      {userRewards && userRewards.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            My Rewards
          </h3>
          <div className="grid gap-4">
            {userRewards.map((userReward) => (
              <Card key={userReward.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getRewardIcon(userReward.rewards.reward_type)}</span>
                      <div>
                        <h4 className="font-semibold">{userReward.rewards.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Redeemed on {new Date(userReward.redeemed_at).toLocaleDateString()}
                        </p>
                        {userReward.redemption_code && (
                          <p className="text-sm font-mono bg-muted px-2 py-1 rounded w-fit">
                            Code: {userReward.redemption_code}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={userReward.status === 'active' ? 'default' : 'secondary'}
                    >
                      {userReward.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsCenter;