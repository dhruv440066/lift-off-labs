import React, { useState } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Recycle, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const LoginForm: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    userType: 'individual'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (isRegister && !formData.name) {
      toast({
        title: "Error", 
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account."
          });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in."
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const userTypes = [
    { value: 'individual', label: '🏠 Individual', desc: 'Personal waste management' },
    { value: 'business', label: '🏢 Business', desc: 'Commercial waste management' },
    { value: 'organization', label: '🌟 Organization', desc: 'Community leader' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Eco-friendly Cityscape Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* City Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-800/40 to-transparent">
          {/* Building Silhouettes */}
          <div className="absolute bottom-0 left-0 w-full h-48 flex items-end justify-center space-x-2">
            {/* Buildings */}
            <div className="bg-green-700/60 w-12 h-32 rounded-t-lg"></div>
            <div className="bg-green-600/60 w-8 h-24 rounded-t-lg"></div>
            <div className="bg-green-700/60 w-16 h-40 rounded-t-lg"></div>
            <div className="bg-green-600/60 w-10 h-28 rounded-t-lg"></div>
            <div className="bg-green-700/60 w-14 h-36 rounded-t-lg"></div>
            <div className="bg-green-600/60 w-12 h-30 rounded-t-lg"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full opacity-60"></div>
        <div className="absolute top-32 right-32 w-12 h-12 bg-white/15 rounded-full opacity-70"></div>
        <div className="absolute top-40 left-1/3 w-8 h-8 bg-white/20 rounded-full opacity-50"></div>
      </div>

      {/* Left Side Content */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white z-10 max-w-lg">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Revolutionizing Waste<br />
          Management<br />
          with AI & IoT
        </h1>
        <p className="text-lg opacity-90 mb-8 leading-relaxed">
          Join India's smartest waste management ecosystem. Track, 
          optimize, and automate your waste collection with real-time 
          analytics and AI-powered insights.
        </p>
        
        {/* Waste Truck Illustration */}
        <div className="flex items-center space-x-4 mt-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Recycle className="w-8 h-8 text-white" />
          </div>
          <div className="text-sm opacity-80">
            <div className="font-semibold">Smart Collection Routes</div>
            <div>AI-optimized pickup schedules</div>
          </div>
        </div>
      </div>

      {/* Right Side Login Card */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
        <Card className="w-96 shadow-2xl bg-white/95 backdrop-blur-sm border-0 rounded-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isRegister ? 'Join Eco Tracker' : 'Welcome Back'}
            </CardTitle>
            <p className="text-gray-600">
              {isRegister 
                ? 'Create your account to start making a difference'
                : 'Sign in to your Eco Tracker dashboard!'
              }
            </p>
          </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                {/* Name and Phone Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Phone number"
                        className="pl-10"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label>User Type</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {userTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`
                          flex flex-col p-3 border rounded-lg cursor-pointer transition-all
                          ${formData.userType === type.value 
                            ? 'border-primary bg-primary/5 shadow-soft' 
                            : 'border-muted hover:border-primary/50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={type.value}
                          checked={formData.userType === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {isRegister && (
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <button type="button" className="text-primary hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary hover:underline">
                    Privacy Policy
                  </button>
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all" disabled={loading}>
              {loading ? (isRegister ? 'Creating Account...' : 'Signing In...') : (isRegister ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          {!isRegister && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                Demo Admin
              </Button>
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                Demo Operator
              </Button>
            </div>
          )}

          <div className="text-center mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-600 hover:text-green-700"
              disabled={loading}
            >
              {isRegister 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};