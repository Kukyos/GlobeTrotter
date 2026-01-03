import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Globe, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { User, UserRole } from '@/types';
import { signIn } from '@/services/supabaseService';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

/**
 * LoginScreen Component
 * 
 * Entry point for user authentication. Features:
 * - Email/username and password inputs
 * - Show/hide password toggle
 * - Form validation
 * - Animated background effects
 * - Link to registration
 * - Forgot password option
 */
const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Call Supabase Auth
      const { user, error } = await signIn(formData.email, formData.password);
      
      setIsLoading(false);
      
      if (user && !error) {
        const mappedUser: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
          role: (user.user_metadata?.role as UserRole) || 'user',
          avatar: user.user_metadata?.avatar || undefined
        };
        onLogin(mappedUser);
        navigate('/dashboard');
      } else {
        setErrors({ 
          email: error || 'Login failed. Please check your credentials.' 
        });
      }
    } catch (err) {
      setIsLoading(false);
      setErrors({ 
        email: 'An unexpected error occurred. Please try again.' 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-mesh relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-white/5 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/3 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/2 rounded-full blur-[150px]" />
      </div>

      {/* Login Card */}
      <div 
        className={`w-full max-w-md transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="glass rounded-3xl p-8 md:p-10 glow-border relative">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-3xl" />
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10 relative">
            {/* Animated Globe Icon */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 
                            flex items-center justify-center border border-white/20 
                            shadow-[0_0_40px_rgba(255,255,255,0.1)] animate-float">
                <Globe className="w-12 h-12 text-white/80" strokeWidth={1.5} />
              </div>
              {/* Sparkle accent */}
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-white/60 animate-pulse" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white glow-text">
              Welcome Back
            </h1>
            <p className="text-white/50 mt-2 text-center">
              Sign in to continue your journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-12 ${errors.email ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/30">New to GlobeTrotter?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="btn-secondary w-full flex items-center justify-center gap-2 group"
          >
            <span>Create an Account</span>
            <Sparkles className="w-4 h-4 text-white/60 group-hover:scale-110 transition-transform" />
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-sm mt-6">
          By signing in, you agree to our{' '}
          <button className="text-white/50 hover:text-white transition-colors underline underline-offset-2">
            Terms of Service
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
