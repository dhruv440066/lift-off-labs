import React, { useState } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Recycle, 
  Bell, 
  MessageCircle, 
  Moon, 
  Sun, 
  HelpCircle, 
  User, 
  Settings, 
  CreditCard, 
  LogOut,
  Search,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  user?: {
    name: string;
    initials: string;
    level: string;
  };
  notifications?: number;
  messages?: number;
}

export const Header: React.FC<HeaderProps> = ({
  user = { name: "Welcome, User", initials: "W", level: "Eco Warrior" },
  notifications = 3,
  messages = 5
}) => {
  const { signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-eco rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">WasteWise India</span>
              <Badge variant="secondary" className="text-xs bg-gradient-primary text-white">
                v2.0
              </Badge>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Navigation Icons & User */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-error text-white">
                    {notifications}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <MessageCircle className="w-5 h-5" />
                {messages > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-error text-white">
                    {messages}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {user.initials}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.level}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {/* User Menu */}
              {showUserMenu && (
                <Card className="absolute right-0 top-12 w-56 p-2 shadow-strong animate-slideIn">
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </Button>
                    <hr className="my-1" />
                    <Button variant="ghost" className="w-full justify-start gap-3 text-error hover:text-error" onClick={signOut}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};