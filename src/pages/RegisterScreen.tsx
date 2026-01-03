import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText,
  ArrowRight,
  ArrowLeft,
  Camera,
  Check,
  Sparkles
} from 'lucide-react';
import { User, UserRole } from '@/types';
import { authService } from '@/services/authService';

interface RegisterScreenProps {
  onLogin: (user: User) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  country: string;
  bio: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * RegisterScreen Component
 * 
 * User registration form with:
 * - Profile photo upload placeholder
 * - Personal information fields
 * - Location information
 * - Password with confirmation
 * - Additional info/bio
 * - Form validation
 * - Animated design
 */
const RegisterScreen: React.FC<RegisterScreenProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    country: '',
    bio: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Call backend API
    const response = await authService.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      city: formData.city || undefined,
      country: formData.country || undefined,
      bio: formData.bio || undefined,
    });
    
    setIsLoading(false);
    
    if (response.success && response.data) {
      onLogin(response.data.user);
      navigate('/dashboard');
    } else {
      setErrors({ 
        email: response.error || 'Registration failed. Please try again.' 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (): { strength: number; label: string; color: string } => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 1) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 2) return { strength, label: 'Fair', color: 'bg-orange-500' };
    if (strength <= 3) return { strength, label: 'Good', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Strong', color: 'bg-white/70' };
    return { strength, label: 'Very Strong', color: 'bg-white' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 gradient-mesh relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-white/4 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-white/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/2 rounded-full blur-[150px]" />
      </div>

      {/* Registration Card */}
      <div 
        className={`w-full max-w-2xl transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="glass rounded-3xl p-8 md:p-10 glow-border relative">
          {/* Decorative corner accent */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-br-3xl" />
          
          {/* Back to Login */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Login</span>
          </Link>

          {/* Header */}
          <div className="flex flex-col items-center mb-8 relative">
            {/* Photo Upload */}
            <div className="relative mb-6 group">
              <div className={`w-28 h-28 rounded-full border-2 border-dashed 
                            ${photoPreview ? 'border-white/30' : 'border-white/20'} 
                            flex items-center justify-center overflow-hidden
                            bg-white/5 transition-all duration-300
                            group-hover:border-white/40 group-hover:bg-white/10`}>
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-white/30" />
                )}
              </div>
              <label 
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full 
                         flex items-center justify-center cursor-pointer
                         hover:bg-white/90 transition-colors shadow-lg shadow-white/20"
              >
                <Camera className="w-4 h-4 text-black" />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white glow-text">
              Join GlobeTrotter
            </h1>
            <p className="text-white/50 mt-2 text-center">
              Start planning your next adventure today
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="input-label">
                  First Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field pl-12 ${errors.firstName ? 'border-red-500/50' : ''}`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-sm">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="input-label">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? 'border-red-500/50' : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="input-label">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-12 ${errors.email ? 'border-red-500/50' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="input-label">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field pl-12 ${errors.phone ? 'border-red-500/50' : ''}`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="input-label">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${errors.password ? 'border-red-500/50' : ''}`}
                  placeholder="••••••••"
                />
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.strength 
                              ? passwordStrength.color 
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-white/40">
                      Strength: <span className="text-white/60">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="input-label">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
                    placeholder="••••••••"
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-2">
                <label htmlFor="city" className="input-label">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="Your city"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label htmlFor="country" className="input-label">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="Your country"
                  />
                </div>
              </div>
            </div>

            {/* Bio/Additional Info */}
            <div className="space-y-2">
              <label htmlFor="bio" className="input-label flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Information
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell us about yourself, your travel interests, or anything else you'd like to share..."
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 
                         text-white focus:ring-white/50"
              />
              <label htmlFor="terms" className="text-sm text-white/50">
                I agree to the{' '}
                <button type="button" className="text-white hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-white hover:underline">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 group py-4"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-white/50 mt-8">
            Already have an account?{' '}
            <Link 
              to="/"
              className="text-white hover:text-white/80 font-medium transition-colors underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
