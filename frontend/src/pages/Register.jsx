import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Plane, Eye, EyeOff, ArrowRight, User, Mail, Lock, Phone, CreditCard } from 'lucide-react';
import { validateEmail, validatePassword, validatePhone, validatePassport } from '../utils/validators';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    passport: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';
    if (!validatePassport(formData.passport)) newErrors.passport = 'Valid passport number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    
    // Split name into first and last name
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const result = await register({
      username: formData.email, // Use email as username
      email: formData.email,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      first_name: firstName,
      last_name: lastName,
      phone: formData.phone,
      passport: formData.passport,
    });

    if (result.success) {
      navigate('/');
    } else {
      const backendErrors = result.error || {};
      const newErrors = { ...backendErrors };
      
      // DRF returns username error for duplicate emails since username=email
      if (backendErrors.username) {
        newErrors.email = backendErrors.username;
      }
      
      // Provide a generic error string for the top of the form, 
      // otherwise user might be stuck on Step 2 with errors rendered in Step 1
      const errorValues = Object.values(newErrors).flat();
      if (errorValues.length > 0) {
        newErrors.general = Array.isArray(errorValues[0]) ? errorValues[0][0] : String(errorValues[0]);
      } else {
        newErrors.general = 'Registration failed. Please try again.';
      }
      
      setErrors(newErrors);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-lg">
              <Plane className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold gradient-text">SkyBooker</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join millions of travelers and start your journey
            </CardDescription>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">
                  {errors.general}
                </div>
              )}
              {step === 1 ? (
                <>
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    leftIcon={<User className="w-5 h-5" />}
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      leftIcon={<Lock className="w-5 h-5" />}
                      error={errors.password}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <Input
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    leftIcon={<Lock className="w-5 h-5" />}
                    error={errors.confirmPassword}
                    required
                  />

                  <Button
                    type="button"
                    className="w-full"
                    size="lg"
                    onClick={handleNext}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1-555-0123"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    leftIcon={<Phone className="w-5 h-5" />}
                    error={errors.phone}
                    required
                  />

                  <Input
                    label="Passport Number"
                    placeholder="Enter your passport number"
                    value={formData.passport}
                    onChange={(e) => setFormData({ ...formData, passport: e.target.value })}
                    leftIcon={<CreditCard className="w-5 h-5" />}
                    error={errors.passport}
                    required
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      size="lg"
                      loading={isLoading}
                    >
                      Create Account
                    </Button>
                  </div>
                </>
              )}
            </form>

            <p className="mt-6 text-xs text-center text-slate-500">
              By creating an account, you agree to our{' '}
              <Link to="#" className="text-primary-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
