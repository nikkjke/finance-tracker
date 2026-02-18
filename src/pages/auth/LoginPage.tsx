import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, BarChart3, Shield, Wallet } from 'lucide-react';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    const success = login(email, password);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (role: 'user' | 'admin') => {
    const credentials = role === 'admin'
      ? { email: 'admin@fintrack.com', password: 'admin123' }
      : { email: 'mariana@example.com', password: 'user123' };
    setEmail(credentials.email);
    setPassword(credentials.password);
    login(credentials.email, credentials.password);
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-600 via-surface-700 to-surface-900" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-white/5" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <img src={fintrackLogo} alt="FinTrack" className="h-20 w-20" />
            <span className="text-2xl font-bold text-white">FinTrack</span>
          </Link>

          {/* Center content */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Welcome back to your
              <br />financial dashboard
            </h2>
            <p className="text-lg text-primary-100/90 max-w-sm">
              Track expenses, scan receipts, and stay on top of your budget with real-time analytics.
            </p>

            {/* Feature cards */}
            <div className="mt-10 space-y-3">
              {[
                { icon: BarChart3, text: 'Real-time spending analytics' },
                { icon: Shield, text: 'Bank-level security for your data' },
                { icon: Wallet, text: 'Smart budget tracking & alerts' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3"
                >
                  <item.icon size={18} className="text-white/60" />
                  <span className="text-sm text-white/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Users', value: '12.4K' },
              { label: 'Receipts Scanned', value: '1.2M' },
              { label: 'Money Tracked', value: '$48M' },
              { label: 'Budgets Met', value: '94%' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 p-3">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex lg:w-1/2 w-full items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-1 mb-8">
            <img src={fintrackLogo} alt="FinTrack" className="h-16 w-16" />
            <span className="text-lg font-bold text-surface-900 dark:text-white">FinTrack</span>
          </Link>

          <div className="rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-8 shadow-xl shadow-surface-900/5 dark:shadow-none">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              Don&#39;t have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Create one free
              </Link>
            </p>

          {/* Quick login buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="btn-secondary text-xs"
            >
              Demo User Login
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="btn-secondary text-xs"
            >
              Demo Admin Login
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
            <span className="text-xs text-surface-400">or continue with email</span>
            <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                placeholder="you@example.com"
                className={`input ${errors.email ? 'border-danger-500 focus:ring-danger-500/20' : ''}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-danger-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                  placeholder="••••••••"
                  className={`input pr-10 ${errors.password ? 'border-danger-500 focus:ring-danger-500/20' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-danger-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-surface-600 dark:text-surface-400">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
