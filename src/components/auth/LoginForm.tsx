import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Recycle, Mail, Lock, Eye, EyeOff, User, Phone, Truck, Bird, Cloud } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ecoTrackLogo from '@/assets/eco-track-logo-new.png';

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
      {/* Main Green Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-green-400 to-emerald-500">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H14v-2h6V8h2v8h6v2h-6v2.5z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Clouds */}
        <div className="absolute top-16 right-1/4 w-20 h-12 bg-white/20 rounded-full"></div>
        <div className="absolute top-16 right-1/4 w-16 h-10 bg-white/15 rounded-full translate-x-6"></div>
        <div className="absolute top-24 left-1/3 w-24 h-14 bg-white/20 rounded-full"></div>
        <div className="absolute top-24 left-1/3 w-18 h-12 bg-white/15 rounded-full translate-x-8"></div>
        
        {/* Birds */}
        <div className="absolute top-20 right-16">
          <Bird className="w-6 h-6 text-gray-600/60" />
        </div>
        <div className="absolute top-32 right-32">
          <Bird className="w-5 h-5 text-gray-600/40 rotate-12" />
        </div>

        {/* City Skyline */}
        <div className="absolute bottom-0 left-0 right-0 h-80">
          {/* Buildings with varying heights and green tones */}
          <div className="absolute bottom-20 left-1/4 w-16 h-48 bg-green-600/80 rounded-t-md"></div>
          <div className="absolute bottom-20 left-1/4 translate-x-12 w-12 h-32 bg-green-500/70 rounded-t-md"></div>
          <div className="absolute bottom-20 left-1/4 translate-x-20 w-20 h-56 bg-green-700/90 rounded-t-md"></div>
          <div className="absolute bottom-20 left-1/4 translate-x-36 w-14 h-40 bg-green-600/75 rounded-t-md"></div>
          <div className="absolute bottom-20 left-1/4 translate-x-46 w-18 h-52 bg-green-500/80 rounded-t-md"></div>
          <div className="absolute bottom-20 left-1/4 translate-x-60 w-12 h-36 bg-green-600/70 rounded-t-md"></div>
          
          {/* Central prominent building */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-8 w-16 h-64 bg-green-800/90 rounded-t-lg"></div>
          
          {/* Green Tree */}
          <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-green-700 rounded-full"></div>
          <div className="absolute bottom-16 right-1/3 translate-x-1 w-2 h-8 bg-green-800"></div>
        </div>

        {/* Waste Collection Trucks */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-400/20">
          {/* Road stripes */}
          <div className="absolute bottom-8 left-0 right-0 h-1 bg-white/60"></div>
          <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-white/40" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, white 10px, white 20px)'
          }}></div>
          
          {/* Truck illustrations */}
          <div className="absolute bottom-4 left-16">
            <div className="w-16 h-8 bg-white rounded-sm border border-gray-300 relative">
              <div className="absolute -left-2 top-1 w-6 h-6 bg-gray-200 rounded-sm"></div>
              <div className="absolute right-1 top-1 w-8 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                <Recycle className="w-3 h-3 text-white" />
              </div>
              <div className="absolute -bottom-2 left-1 w-3 h-3 bg-gray-800 rounded-full"></div>
              <div className="absolute -bottom-2 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-20">
            <div className="w-20 h-10 bg-green-600 rounded-sm relative">
              <div className="absolute -left-3 top-1 w-8 h-8 bg-white rounded-sm border border-gray-300"></div>
              <div className="absolute -bottom-2 left-1 w-3 h-3 bg-gray-800 rounded-full"></div>
              <div className="absolute -bottom-2 left-6 w-3 h-3 bg-gray-800 rounded-full"></div>
              <div className="absolute -bottom-2 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
              <div className="absolute -bottom-2 right-6 w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Left Logo and Brand */}
      <div className="absolute top-8 left-8 flex items-center space-x-3 z-20">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
          <Recycle className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">WasteWise</span>
      </div>

      {/* Left Side Content */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white z-10 max-w-lg">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Revolutionizing Waste<br />
          Management<br />
          with AI & IoT
        </h1>
        <p className="text-lg opacity-90 mb-8 leading-relaxed">
          Join India's smartest waste management ecosystem. Track, 
          optimize, and automate your waste collection with real-time 
          analytics and AI-powered insights.
        </p>
      </div>

      {/* Right Side Login Card */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
        <Card className="w-96 shadow-2xl bg-white border-0 rounded-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isRegister ? 'Join WasteWise' : 'Welcome Back'}
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {isRegister 
                ? 'Create your account to start making a difference'
                : 'Sign in to your WasteWise dashboard!'
              }
            </p>
          </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                {/* Name and Phone Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Phone number"
                        className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-700">User Type</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {userTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`
                          flex flex-col p-3 border rounded-lg cursor-pointer transition-all
                          ${formData.userType === type.value 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300'
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
                        <span className="text-sm font-medium text-gray-800">{type.label}</span>
                        <span className="text-xs text-gray-600">{type.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc.xyz.aaa55555@gmail.com"
                  className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Gty321111"
                  className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {isRegister && (
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-green-600 hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-green-600 hover:underline">
                    Privacy Policy
                  </button>
                </Label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all h-12" 
              disabled={loading}
            >
              {loading ? (isRegister ? 'Creating Account...' : 'Signing In...') : (isRegister ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          {!isRegister && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50 py-2">
                Demo Admin
              </Button>
              <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50 py-2">
                Demo Operator
              </Button>
            </div>
          )}

          <div className="text-center mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-600 hover:text-green-700 text-sm"
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