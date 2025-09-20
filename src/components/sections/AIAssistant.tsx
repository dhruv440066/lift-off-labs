import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Lightbulb, TrendingUp, Leaf, Recycle } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Suggestion {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your WasteWise AI assistant. I can help you optimize waste management, track your environmental impact, and provide personalized recommendations. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = [
    {
      icon: <Recycle className="w-5 h-5 text-success" />,
      title: "Optimize Organic Waste",
      description: "Start composting to reduce waste by 40%",
      impact: "Save ₹250/month"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-info" />,
      title: "Improve Segregation",
      description: "Better sorting can increase recycling efficiency",
      impact: "Reduce carbon footprint by 25%"
    },
    {
      icon: <Leaf className="w-5 h-5 text-success" />,
      title: "Green Points Boost",
      description: "3 simple actions to earn more rewards",
      impact: "Earn 500 extra points"
    }
  ];

  const quickActions = [
    "How can I reduce food waste?",
    "What's my carbon footprint?",
    "Show my waste analytics",
    "Tips for better recycling",
    "Nearest collection center",
    "Track my green goals"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('food waste') || input.includes('reduce waste')) {
      return "Great question! Here are 3 effective ways to reduce food waste:\n\n1. **Plan your meals**: Create weekly meal plans and shopping lists\n2. **Store properly**: Use airtight containers and understand expiry dates\n3. **Compost scraps**: Turn unavoidable waste into nutrient-rich soil\n\nImplementing these could reduce your food waste by 40% and save you ₹200-300 monthly!";
    }
    
    if (input.includes('carbon') || input.includes('footprint')) {
      return "Your current carbon footprint from waste: **1.2 tons CO₂/year** 🌱\n\nComparison:\n• Mumbai average: 1.8 tons\n• You're 33% below average! 🎉\n\nTo improve further:\n✅ Increase composting (+15% reduction)\n✅ Use public transport for waste drops (+10%)\n✅ Choose products with less packaging (+8%)";
    }
    
    if (input.includes('analytics') || input.includes('data')) {
      return "📊 **Your Waste Analytics Summary:**\n\n**This Month:**\n• Total waste: 45kg (↓15% from last month)\n• Recycled: 28kg (62% recycling rate)\n• Composted: 12kg (27%)\n• Landfill: 5kg (11%)\n\n🏆 **Achievement:** Top 20% in your area!\n\nWould you like detailed breakdowns by waste type?";
    }
    
    if (input.includes('recycling') || input.includes('tips')) {
      return "♻️ **Smart Recycling Tips:**\n\n**Clean before recycling:**\n• Rinse containers to remove food residue\n• Remove labels when possible\n\n**Know your materials:**\n✅ Paper, cardboard, glass, metals\n❌ Plastic bags, styrofoam, electronics\n\n**Local tip:** Your area has a 92% acceptance rate for mixed recyclables!\n\nNeed help finding the nearest recycling center?";
    }
    
    return "I understand you're asking about waste management! I'm here to help with:\n\n🔍 **Waste tracking & analytics**\n♻️ **Recycling guidance**\n🌱 **Sustainability tips**\n📍 **Local facility information**\n🎯 **Goal setting & achievements**\n\nCould you be more specific about what you'd like to know? I have access to your waste data and local information to provide personalized advice!";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="space-y-6 animate-fadeInScale">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-muted">
        <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Your personal waste management advisor</p>
        </div>
        <Badge className="ml-auto bg-gradient-primary text-white">
          Powered by AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-4 rounded-lg whitespace-pre-line ${
                          message.type === 'user'
                            ? 'bg-gradient-primary text-white'
                            : 'bg-muted/50 text-foreground'
                        }`}
                      >
                        {message.content}
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gradient-eco rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              <div className="p-6 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about waste management, recycling tips, analytics..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    variant="eco" 
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {quickActions.slice(0, 3).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(action)}
                      disabled={isTyping}
                      className="text-xs"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Suggestions */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Smart Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border hover:shadow-medium transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{suggestion.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {suggestion.impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.slice(3).map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto py-3"
                  onClick={() => handleSendMessage(action)}
                  disabled={isTyping}
                >
                  {action}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};