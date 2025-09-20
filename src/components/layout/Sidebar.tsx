import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Home,
  Bot,
  BarChart3,
  GraduationCap,
  Truck,
  ShoppingCart,
  Camera,
  Trophy,
  Users,
  Newspaper,
  Star
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user?: {
    name: string;
    initials: string;
    status: 'online' | 'offline';
  };
}

const navigationItems = [
  {
    section: 'MAIN',
    items: [
      { id: 'overview', icon: Home, label: 'Dashboard', badge: '5' },
      { id: 'ai-assistant', icon: Bot, label: 'AI Assistant', badge: 'NEW', badgeType: 'new' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    ]
  },
  {
    section: 'SERVICES',
    items: [
      { id: 'training', icon: GraduationCap, label: 'Training Hub' },
      { id: 'tracking', icon: Truck, label: 'Live Tracking' },
      { id: 'shopping', icon: ShoppingCart, label: 'EcoStore' },
      { id: 'reporting', icon: Camera, label: 'Report Issues' },
    ]
  },
  {
    section: 'REWARDS & SOCIAL',
    items: [
      { id: 'rewards', icon: Trophy, label: 'Rewards' },
      { id: 'community', icon: Users, label: 'Community' },
    ]
  },
  {
    section: 'INFORMATION',
    items: [
      { id: 'news', icon: Newspaper, label: 'News & Updates' },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  user = { name: "John Doe", initials: "JD", status: 'online' }
}) => {
  return (
    <div className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-strong">
      {/* User Info Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold shadow-medium">
            {user.initials}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{user.name}</h4>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className={cn(
                "w-2 h-2 rounded-full",
                user.status === 'online' ? "bg-success animate-pulse" : "bg-muted"
              )} />
              <span className="capitalize">{user.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-y-auto">
        {navigationItems.map((section, sectionIndex) => (
          <div key={section.section} className={cn("mb-6", sectionIndex > 0 && "mt-8")}>
            <div className="px-6 mb-3">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
                {section.section}
              </h3>
            </div>
            <div className="space-y-1 px-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-12 rounded-lg transition-all duration-300 group",
                      isActive 
                        ? "bg-gradient-primary shadow-glow text-white transform translate-x-1" 
                        : "text-white/80 hover:bg-white/10 hover:text-white hover:transform hover:translate-x-1"
                    )}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        className={cn(
                          "ml-auto text-xs px-2 py-1",
                          item.badgeType === 'new' 
                            ? "bg-success text-white animate-pulse" 
                            : "bg-accent text-white"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Card */}
      <div className="p-6 border-t border-white/10">
        <Card className="bg-gradient-accent p-6 text-center text-white border-0">
          <Star className="w-8 h-8 mx-auto mb-3" />
          <h4 className="font-semibold mb-2">Upgrade to Pro</h4>
          <p className="text-sm text-white/90 mb-4">
            Unlock advanced features and analytics
          </p>
          <Button 
            variant="glass" 
            className="w-full bg-white/20 hover:bg-white/30 border-white/30"
          >
            Upgrade Now
          </Button>
        </Card>
      </div>
    </div>
  );
};