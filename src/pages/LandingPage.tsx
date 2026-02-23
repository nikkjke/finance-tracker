import { Link } from 'react-router-dom';
import {
  ScanLine,
  BarChart3,
  Wallet,
  Shield,
  ArrowRight,
  Moon,
  Sun,
  Smartphone,
  Zap,
  Globe,
  Mail,
  Heart,
} from 'lucide-react';

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
import { useTheme } from '../contexts/ThemeContext';
import fintrackLogo from '../assets/fintrack-logo.svg';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-surface-200/60 bg-white/80 backdrop-blur-lg dark:border-surface-800 dark:bg-surface-950/80">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-1">
            <img src={fintrackLogo} alt="FinTrack" className="h-12 w-12" />
            <span className="text-xl font-bold text-surface-900 dark:text-white">
              FinTrack
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[
              { label: 'How it Works', anchor: 'how-it-works' },
              { label: 'Features', anchor: 'features' },
              { label: 'Security', anchor: 'security' },
              { label: 'Contact', anchor: 'contact' },
            ].map((item) => (
              <a
                key={item.anchor}
                href={`#${item.anchor}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.anchor)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="btn-ghost hidden sm:inline-flex">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-white dark:from-surface-950 dark:via-surface-900 dark:to-surface-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.06),transparent)]" />

        {/* Subtle radiating lines from card area */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="absolute right-0 top-0 h-full w-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMaxYMid slice">
            <defs>
              <radialGradient id="linesFade" cx="75%" cy="45%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Radiating curves from the card cluster */}
            {[0,1,2,3,4,5,6,7].map(i => (
              <path
                key={i}
                d={`M${900 + i * 15} ${300 + i * 20} Q${1100 + i * 30} ${100 - i * 40} ${1500} ${200 + i * 60}`}
                stroke="url(#linesFade)"
                strokeWidth="1"
                fill="none"
                className="text-primary-500 dark:text-primary-400"
              />
            ))}
            {/* Also some going left/down */}
            {[0,1,2,3,4].map(i => (
              <path
                key={`b${i}`}
                d={`M${900 - i * 10} ${350 + i * 15} Q${700 - i * 50} ${500 + i * 30} ${400 - i * 80} ${700 + i * 20}`}
                stroke="url(#linesFade)"
                strokeWidth="0.8"
                fill="none"
                className="text-primary-400 dark:text-primary-500"
              />
            ))}
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Text Content */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400">
                <Zap size={14} />
                Smart receipt scanning powered by QR technology
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
                Take control of your{' '}
                <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  finances
                </span>
              </h1>

              <p className="mt-6 text-base text-surface-600 dark:text-surface-400 leading-relaxed">
                Track expenses, scan receipts with QR codes, manage budgets, and get powerful
                analytics — all in one beautiful dashboard.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="btn-primary px-8 py-3 text-sm">
                  Get Started
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-3 text-sm">
                  Sign in to Dashboard
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-xl font-bold text-surface-900 dark:text-white">10K+</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Active Users</p>
                </div>
                <div className="h-10 w-px bg-surface-200 dark:bg-surface-700" />
                <div>
                  <p className="text-xl font-bold text-surface-900 dark:text-white">$2M+</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Tracked Monthly</p>
                </div>
                <div className="h-10 w-px bg-surface-200 dark:bg-surface-700 hidden sm:block" />
                <div className="hidden sm:block">
                  <p className="text-xl font-bold text-surface-900 dark:text-white">50K+</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Receipts Scanned</p>
                </div>
              </div>
            </div>

            {/* Right — Credit Card Visuals */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg h-[420px] sm:h-[480px]">

                {/* ═══ White/Light Card — back, tilted left ═══ */}
                <div className="absolute top-0 left-0 sm:left-4 transition-transform duration-700 hover:-translate-y-2 hover:rotate-[-7deg] rotate-[-6deg] z-10">
                  <div className="w-[300px] sm:w-[340px] h-[190px] sm:h-[214px] rounded-2xl bg-white border border-surface-200/80 shadow-2xl shadow-surface-900/10 dark:bg-surface-800 dark:border-surface-700 dark:shadow-surface-950/40 p-5 sm:p-6 relative overflow-hidden">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-50/50 via-transparent to-primary-50/30 dark:from-surface-700/20 dark:to-primary-500/5" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Top row: chip + contactless + brand */}
                      <div className="flex items-start justify-between">
                        {/* EMV Chip */}
                        <div className="relative">
                          <svg width="46" height="34" viewBox="0 0 46 34" fill="none">
                            <rect x="1" y="1" width="44" height="32" rx="6" fill="url(#chipGold1)" stroke="#D4A843" strokeWidth="1.2" />
                            <line x1="23" y1="1" x2="23" y2="33" stroke="#C49A3C" strokeWidth="0.7" opacity="0.5" />
                            <line x1="1" y1="17" x2="45" y2="17" stroke="#C49A3C" strokeWidth="0.7" opacity="0.5" />
                            <line x1="12" y1="7" x2="12" y2="27" stroke="#C49A3C" strokeWidth="0.4" opacity="0.3" />
                            <line x1="34" y1="7" x2="34" y2="27" stroke="#C49A3C" strokeWidth="0.4" opacity="0.3" />
                            <rect x="4" y="4" width="14" height="10" rx="2" fill="#D4A843" opacity="0.15" />
                            <rect x="28" y="20" width="14" height="10" rx="2" fill="#D4A843" opacity="0.15" />
                            <defs>
                              <linearGradient id="chipGold1" x1="0" y1="0" x2="46" y2="34">
                                <stop stopColor="#F2D87A" />
                                <stop offset="0.5" stopColor="#D4A843" />
                                <stop offset="1" stopColor="#E8C65A" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>

                        {/* Contactless + Logo */}
                        <div className="flex items-center gap-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-surface-400 dark:text-surface-500">
                            <path d="M6.2 19.8C3.5 17.1 3.5 12.7 6.2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M9.5 16.5C8.1 15.1 8.1 12.9 9.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12.8 13.2A1 1 0 0112.8 12.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          <span className="text-xl font-extrabold italic tracking-tight text-primary-600 dark:text-primary-400">VISA</span>
                        </div>
                      </div>

                      {/* Card Number */}
                      <div className="flex items-center gap-4 text-surface-700 dark:text-surface-300">
                        {['••••', '••••', '••••'].map((group, i) => (
                          <span key={i} className="text-lg tracking-[0.25em] font-medium opacity-60">{group}</span>
                        ))}
                        <span className="text-lg tracking-[0.2em] font-semibold">4821</span>
                      </div>

                      {/* Bottom: name + expiry */}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-0.5">Card Holder</p>
                          <p className="text-sm font-semibold tracking-wider text-surface-700 dark:text-surface-200 uppercase">Sarah Johnson</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-0.5">Expires</p>
                          <p className="text-sm font-semibold text-surface-700 dark:text-surface-200">09/28</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══ Dark Card — front, overlapping ═══ */}
                <div className="absolute bottom-4 right-0 sm:right-4 transition-transform duration-700 hover:-translate-y-2 hover:rotate-[5deg] rotate-[6deg] z-20">
                  <div className="w-[300px] sm:w-[340px] h-[190px] sm:h-[214px] rounded-2xl bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950 dark:from-surface-700 dark:via-surface-800 dark:to-surface-900 shadow-2xl shadow-surface-900/30 dark:shadow-surface-950/50 p-5 sm:p-6 relative overflow-hidden border border-surface-700/50 dark:border-surface-600/30">
                    {/* Decorative gradient blobs */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-500/10 blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-primary-600/8 blur-3xl" />
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        {/* EMV Chip */}
                        <svg width="46" height="34" viewBox="0 0 46 34" fill="none">
                          <rect x="1" y="1" width="44" height="32" rx="6" fill="url(#chipGold2)" stroke="#B8922E" strokeWidth="1.2" />
                          <line x1="23" y1="1" x2="23" y2="33" stroke="#A07E28" strokeWidth="0.7" opacity="0.5" />
                          <line x1="1" y1="17" x2="45" y2="17" stroke="#A07E28" strokeWidth="0.7" opacity="0.5" />
                          <line x1="12" y1="7" x2="12" y2="27" stroke="#A07E28" strokeWidth="0.4" opacity="0.3" />
                          <line x1="34" y1="7" x2="34" y2="27" stroke="#A07E28" strokeWidth="0.4" opacity="0.3" />
                          <rect x="4" y="4" width="14" height="10" rx="2" fill="#C49A3C" opacity="0.15" />
                          <rect x="28" y="20" width="14" height="10" rx="2" fill="#C49A3C" opacity="0.15" />
                          <defs>
                            <linearGradient id="chipGold2" x1="0" y1="0" x2="46" y2="34">
                              <stop stopColor="#E8C65A" />
                              <stop offset="0.5" stopColor="#C49A3C" />
                              <stop offset="1" stopColor="#D4A843" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Brand + contactless */}
                        <div className="flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/40">
                            <path d="M6.2 19.8C3.5 17.1 3.5 12.7 6.2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M9.5 16.5C8.1 15.1 8.1 12.9 9.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12.8 13.2A1 1 0 0112.8 12.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          {/* Mastercard circles */}
                          <div className="flex items-center -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-red-500/80" />
                            <div className="w-8 h-8 rounded-full bg-amber-400/80" />
                          </div>
                        </div>
                      </div>

                      {/* Card Number */}
                      <div className="flex items-center gap-4">
                        {['••••', '••••', '••••'].map((group, i) => (
                          <span key={i} className="text-lg tracking-[0.25em] font-medium text-white/40">{group}</span>
                        ))}
                        <span className="text-lg tracking-[0.2em] font-semibold text-white/90">7392</span>
                      </div>

                      {/* Bottom: name + expiry */}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-0.5">Card Holder</p>
                          <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">Alex Morgan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-white/30 mb-0.5">Expires</p>
                          <p className="text-sm font-semibold text-white/80">12/27</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="rounded-xl border border-surface-200 bg-white/60 p-2 shadow-2xl shadow-surface-900/5 backdrop-blur-sm dark:border-surface-700 dark:bg-surface-800/60">
              <div className="rounded-lg bg-surface-100 dark:bg-surface-900 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-danger-500" />
                  <div className="h-3 w-3 rounded-full bg-warning-500" />
                  <div className="h-3 w-3 rounded-full bg-success-500" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Today's Spending", value: '$127.50' },
                    { label: 'Monthly Total', value: '$1,636' },
                    { label: 'Receipts Scanned', value: '12' },
                    { label: 'Budget Left', value: '$3,363' },
                  ].map((card) => (
                    <div key={card.label} className="rounded-lg bg-white dark:bg-surface-800 p-4 shadow-sm">
                      <p className="text-sm text-surface-400 mb-1">{card.label}</p>
                      <p className="text-base font-bold text-surface-900 dark:text-white">{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-32 rounded-lg bg-gradient-to-r from-primary-500/10 to-primary-500/5 dark:from-primary-500/5 dark:to-transparent border border-primary-200/30 dark:border-primary-500/10" />
                  <div className="h-32 rounded-lg bg-surface-200/50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Scanning Section */}
      <section id="how-it-works" className="border-t border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
              How QR Receipt Scanning Works
            </h2>
            <p className="mt-4 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Stop entering expenses manually. Just scan and go.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: Smartphone,
                title: 'Scan the QR Code',
                description: 'Point your camera at the QR code on your receipt. Our scanner works with all standard receipt formats.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'Auto-Extract Data',
                description: 'Store name, total amount, date, and items are automatically extracted and categorized.',
              },
              {
                step: '03',
                icon: BarChart3,
                title: 'Track & Analyze',
                description: 'Your expense is instantly added to your dashboard with full analytics and budget tracking.',
              },
            ].map((item) => (
              <div key={item.step} className="card text-center group hover:shadow-md transition-shadow">
                <div className="mb-4 text-sm font-bold text-primary-500">{item.step}</div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                  <item.icon size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-surface-200 dark:border-surface-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
              Everything you need to manage your money
            </h2>
            <p className="mt-4 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Powerful features designed for modern personal finance management.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ScanLine,
                title: 'QR Receipt Scanning',
                description: 'Scan any receipt QR code and have your expenses logged automatically. No manual entry needed.',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Visual charts and reports to understand your spending patterns over any time period.',
              },
              {
                icon: Wallet,
                title: 'Budget Management',
                description: 'Set monthly budgets per category and receive alerts when you are close to the limit.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your financial data is encrypted and never shared with third parties.',
              },
              {
                icon: Globe,
                title: 'Multi-Currency',
                description: 'Support for multiple currencies with automatic conversion rates.',
              },
              {
                icon: Smartphone,
                title: 'Mobile Ready',
                description: 'Full responsive design. Track expenses on the go from any device.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card group hover:shadow-md hover:border-primary-200 dark:hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                  <feature.icon size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="border-t border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
              Your data is safe with us
            </h2>
            <p className="mt-4 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              We take security seriously. Your financial data is protected with industry-leading practices.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: 'End-to-End Encryption',
                description: 'All data is encrypted in transit and at rest using AES-256.',
              },
              {
                icon: Globe,
                title: 'GDPR Compliant',
                description: 'Full compliance with international data protection regulations.',
              },
              {
                icon: Zap,
                title: '99.9% Uptime',
                description: 'Reliable infrastructure ensures your data is always accessible.',
              },
              {
                icon: Shield,
                title: 'No Third-Party Sharing',
                description: 'Your financial information is never sold or shared with advertisers.',
              },
            ].map((item) => (
              <div key={item.title} className="card text-center group hover:shadow-md transition-shadow">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                  <item.icon size={22} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-surface-200 dark:border-surface-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary-500/30 bg-surface-50 dark:border-primary-500/20 dark:bg-surface-800/50 p-8 sm:p-12 text-center backdrop-blur-sm">
            {/* Yellow accent line at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary-500 rounded-full" />
            
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
              Ready to take control of your finances?
            </h2>
            <p className="mt-4 text-base text-surface-600 dark:text-surface-400 max-w-xl mx-auto">
              Join thousands of users who have simplified their expense tracking with FinTrack.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-8 py-3 text-sm font-semibold text-surface-900 shadow-md hover:bg-primary-600 transition-colors"
              >
                Create Free Account
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-500 px-8 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-900/50">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
          {/* Top section */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-1">
                <img src={fintrackLogo} alt="FinTrack" className="h-12 w-12" />
                <span className="text-xl font-bold text-surface-900 dark:text-white">
                  FinTrack
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                The smart way to track expenses, scan receipts, and manage your budget. Take
                control of your finances with powerful analytics and intuitive tools.
              </p>
              <div className="mt-6 flex items-center gap-3">
                {[
                  { icon: XIcon, href: 'https://x.com', label: 'X' },
                  { icon: GitHubIcon, href: 'https://github.com/nikkjke/finance-tracker', label: 'GitHub' },
                  { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:support@fintrack.com', label: 'Email' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 text-surface-400 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 dark:border-surface-700 dark:hover:border-primary-500/30 dark:hover:bg-primary-500/10 dark:hover:text-primary-400"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-base font-semibold text-surface-900 dark:text-white">Product</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'How it Works', anchor: 'how-it-works' },
                  { label: 'Features', anchor: 'features' },
                  { label: 'QR Scanning', anchor: 'how-it-works' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.anchor}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(link.anchor)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-sm text-surface-500 transition-colors hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {[
                  { label: 'Dashboard', to: '/login' },
                  { label: 'Analytics', to: '/login' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-surface-500 transition-colors hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-base font-semibold text-surface-900 dark:text-white">Company</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: 'About Us' },
                  { label: 'Blog' },
                  { label: 'Careers' },
                  { label: 'Contact', href: 'mailto:support@fintrack.com' },
                  { label: 'Partners' },
                ].map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        className="text-sm text-surface-500 transition-colors hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span
                        className="cursor-default text-sm text-surface-500 transition-colors hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400"
                      >
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-base font-semibold text-surface-900 dark:text-white">Legal</h4>
              <ul className="mt-4 space-y-3">
                {[
                  'Privacy Policy',
                  'Terms of Service',
                  'Cookie Policy',
                  'GDPR',
                  'Security',
                ].map((label) => (
                  <li key={label}>
                    <span
                      className="cursor-default text-sm text-surface-500 transition-colors hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400"
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div id="contact" className="mt-12 rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800/50 sm:flex sm:items-center sm:justify-between sm:p-8">
            <div>
              <h4 className="text-base font-semibold text-surface-900 dark:text-white">
                Stay up to date
              </h4>
              <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                Get the latest tips on personal finance and product updates.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex gap-2 sm:mt-0 sm:min-w-[320px]"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1 text-sm"
              />
              <button type="submit" className="btn-primary shrink-0 text-sm">
                Subscribe
              </button>
            </form>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-200 pt-8 dark:border-surface-800 sm:flex-row">
            <p className="text-xs text-surface-400">
              &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-xs text-surface-400">
              Made with <Heart size={12} className="text-danger-500" fill="currentColor" /> for better financial health
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
