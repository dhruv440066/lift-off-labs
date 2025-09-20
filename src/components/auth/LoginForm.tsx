import React, { useState } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Recycle, Mail, Lock, Eye, EyeOff, User, Phone, Calendar } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    dob: '',
    address: '',
    city: '',
    pincode: '',
    userType: 'citizen'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just call onLogin
    onLogin();
  };

  const userTypes = [
    { value: 'citizen', label: '🏠 Citizen', desc: 'Individual waste management' },
    { value: 'worker', label: '🚛 Waste Worker', desc: 'Collection & processing' },
    { value: 'green-champion', label: '🌟 Green Champion', desc: 'Community leader' },
    { value: 'business', label: '🏢 Business User', desc: 'Commercial waste management' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      
      <Card className="w-full max-w-md shadow-strong relative z-10 bg-white/95 backdrop-blur-sm border-0">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-eco rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Recycle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isRegister ? 'Join WasteWise' : 'Welcome Back'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isRegister 
              ? 'Create your account to start making a difference'
              : 'Sign in to your WasteWise account'
            }
          </p>
          <Badge variant="outline" className="w-fit mx-auto">
            Smart Waste Management v2.0
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                {/* Name and Email Row */}
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
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label>User Type</Label>
                  <div className="grid grid-cols-2 gap-2">
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

            <Button type="submit" variant="eco" className="w-full">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary"
            >
              {isRegister 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Connect Supabase for full authentication features
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};