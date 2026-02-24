import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Zap, Globe, Smartphone } from 'lucide-react';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ email: result.error || 'Registration failed' });
    }
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-700 via-surface-800 to-surface-900" />
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-white/5" />
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <img src={fintrackLogo} alt="FinTrack" className="h-12 w-12" />
            <span className="text-xl font-bold text-white">FinTrack</span>
          </Link>

          {/* Center content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Start your financial
              <br />journey today
            </h2>
            <p className="text-base text-primary-100/90 max-w-sm">
              Create a free account and start tracking your expenses in under a minute.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-3">
              {[
                { icon: Zap, title: 'Instant Setup', desc: 'Get started in seconds, no setup required' },
                { icon: Smartphone, title: 'QR Scanning', desc: 'Scan receipts with your phone camera' },
                { icon: Globe, title: 'Access Anywhere', desc: 'Works on all your devices seamlessly' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <item.icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-5">
            <p className="text-base text-white/90 italic">
              "FinTrack made it so easy to track where my money goes. The QR scanning is a game changer!"
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                MP
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Mariana P.</p>
                <p className="text-xs text-white/60">FinTrack user since 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex lg:w-1/2 w-full items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-1 mb-8">
            <img src={fintrackLogo} alt="FinTrack" className="h-12 w-12" />
            <span className="text-xl font-bold text-surface-900 dark:text-white">FinTrack</span>
          </Link>

          <div className="rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 p-8 shadow-xl shadow-surface-900/5 dark:shadow-none">
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-2 text-base text-surface-500 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError('name'); }}
                placeholder="John Doe"
                className={`input ${errors.name ? 'border-danger-500 focus:ring-danger-500/20' : ''}`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-danger-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                placeholder="you@example.com"
                className={`input ${errors.email ? 'border-danger-500 focus:ring-danger-500/20' : ''}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-danger-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
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
              {errors.password && <p className="mt-1.5 text-xs text-danger-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirm-password" className="label">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                placeholder="••••••••"
                className={`input ${errors.confirmPassword ? 'border-danger-500 focus:ring-danger-500/20' : ''}`}
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-danger-500">{errors.confirmPassword}</p>}
            </div>

            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-surface-500 dark:text-surface-400">
                I agree to the{' '}
                <button type="button" className="font-medium text-primary-600 hover:text-primary-500">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="font-medium text-primary-600 hover:text-primary-500">Privacy Policy</button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
