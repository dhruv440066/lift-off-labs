import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Camera,
  Truck,
  ShoppingCart,
  AlertTriangle,
  GraduationCap,
  Star,
  Recycle,
  TrendingUp,
  Users,
  Leaf,
  RefreshCw,
  Download,
  Settings,
  Bot,
  X
} from 'lucide-react';

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSectionChange }) => {
  const [showAIInsights, setShowAIInsights] = React.useState(true);

  const quickActions = [
    {
      icon: Camera,
      title: "Quick Report",
      description: "Report waste issues instantly",
      badge: "Fast",
      badgeVariant: "success" as const,
      onClick: () => onSectionChange('reporting')
    },
    {
      icon: Truck,
      title: "Track Vehicle",
      description: "See collection vehicle location",
      badge: "Live",
      badgeVariant: "info" as const,
      onClick: () => onSectionChange('tracking')
    },
    {
      icon: ShoppingCart,
      title: "Buy Utilities",
      description: "Order waste management tools",
      badge: "Sale",
      badgeVariant: "accent" as const,
      onClick: () => onSectionChange('shopping')
    },
    {
      icon: AlertTriangle,
      title: "Emergency Pickup",
      description: "Request immediate collection",
      badge: "Urgent",
      badgeVariant: "error" as const,
      onClick: () => {}
    }
  ];

  const stats = [
    {
      title: "Training Progress",
      value: "75%",
      description: "Eco Warrior Level",
      icon: GraduationCap,
      progress: 75,
      color: "bg-gradient-primary",
      button: "Continue",
      onClick: () => onSectionChange('training')
    },
    {
      title: "Waste Reduced",
      value: "245kg",
      description: "This month",
      icon: Recycle,
      progress: 82,
      color: "bg-gradient-eco",
      button: "View Details",
      onClick: () => onSectionChange('analytics')
    },
    {
      title: "Carbon Saved",
      value: "180kg",
      description: "CO₂ equivalent",
      icon: Leaf,
      progress: 68,
      color: "bg-success",
      button: "Track More",
      onClick: () => onSectionChange('analytics')
    },
    {
      title: "Rewards Earned",
      value: "₹1,250",
      description: "Green points value",
      icon: Star,
      progress: 90,
      color: "bg-gradient-accent",
      button: "Redeem",
      onClick: () => onSectionChange('rewards')
    }
  ];

  return (
    <div className="space-y-6 animate-fadeInScale">
      {/* Section Header */}
      <div className="flex justify-between items-center pb-4 border-b border-muted">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-eco rounded-lg flex items-center justify-center">
            <Recycle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="hover:shadow-medium">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="hover:shadow-medium">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="hover:shadow-medium">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAIInsights && (
        <Card className="bg-gradient-hero text-white border-0 shadow-glow animate-slideIn">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  🤖 AI Insights
                </h3>
                <p className="text-white/90 mb-4">
                  "Based on your waste patterns, you could save ₹250/month by optimizing organic waste composting. 
                  Would you like personalized recommendations?"
                </p>
                <div className="flex gap-3">
                  <Button variant="glass" className="border-white/30">
                    Show Recommendations
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Ask AI
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setShowAIInsights(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:shadow-strong hover:-translate-y-1 border-2 hover:border-primary/20"
              onClick={action.onClick}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-eco rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">{action.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                <Badge 
                  className={cn(
                    "px-3 py-1",
                    action.badgeVariant === 'success' && "bg-success text-white",
                    action.badgeVariant === 'info' && "bg-info text-white",
                    action.badgeVariant === 'accent' && "bg-accent text-white",
                    action.badgeVariant === 'error' && "bg-error text-white animate-pulse"
                  )}
                >
                  {action.badge}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="group hover:shadow-medium transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-medium`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-muted-foreground text-sm">{stat.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className="space-y-2">
                  <Progress value={stat.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{stat.progress}% Complete</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs"
                      onClick={stat.onClick}
                    >
                      {stat.button}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Community Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Community Rank</span>
                <span className="font-semibold">#23 in Mumbai</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Green Champions</span>
                <span className="font-semibold">1,247 members</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => onSectionChange('community')}
              >
                Join Community Events
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              This Week's Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Organic waste segregation</span>
                <Badge variant="outline">85%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Recycling participation</span>
                <Badge variant="outline">92%</Badge>
              </div>
              <Button 
                variant="eco" 
                className="w-full mt-4"
                onClick={() => onSectionChange('analytics')}
              >
                View Full Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}