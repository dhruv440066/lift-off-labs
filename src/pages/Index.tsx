import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { AIAssistant } from '@/components/sections/AIAssistant';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock user data
  const user = {
    name: "Priya Sharma",
    initials: "PS",
    level: "Eco Warrior",
    status: 'online' as const
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview onSectionChange={handleSectionChange} />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'analytics':
        return (
          <div className="space-y-6 animate-fadeInScale">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              📊 Analytics Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Waste Reduction</h3>
                  <p className="text-2xl font-bold text-success">245kg</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Carbon Footprint</h3>
                  <p className="text-2xl font-bold text-primary">-180kg CO₂</p>
                  <p className="text-sm text-muted-foreground">Reduced</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Community Rank</h3>
                  <p className="text-2xl font-bold text-accent">#23</p>
                  <p className="text-sm text-muted-foreground">In Mumbai</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6 animate-fadeInScale">
            <h2 className="text-3xl font-bold">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  This section will be implemented with full backend integration.
                </p>
                <Badge variant="outline">Feature in Development</Badge>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header user={user} notifications={3} messages={5} />
      <div className="flex">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          user={user}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
