import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Server, KeyRound, Bug, RefreshCw } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import fintrackLogo from '../../assets/fintrack-logo.svg';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-surface-200/60 bg-white/80 backdrop-blur-lg dark:border-surface-800 dark:bg-surface-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-1">
            <img src={fintrackLogo} alt="FinTrack" className="h-12 w-12" />
            <span className="text-xl font-bold text-surface-900 dark:text-white">FinTrack</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="ghost" />
            <Link to="/" className="btn-ghost text-sm">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-200 dark:border-surface-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-white dark:from-surface-950 dark:via-surface-900 dark:to-surface-950" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl dark:bg-primary-500/[0.03]" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-primary-400/5 blur-3xl dark:bg-primary-400/[0.03]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400">
            <Shield size={14} />
            Security
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
            Your data is{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              safe with us
            </span>
          </h1>
          <p className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            Security isn't an afterthought at FinTrack — it's at the core of everything we build. Here's how we protect your financial data.
          </p>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="border-b border-surface-200 dark:border-surface-800">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Lock,
                title: 'End-to-End Encryption',
                desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your financial information is unreadable without proper authorization.',
              },
              {
                icon: KeyRound,
                title: 'Secure Authentication',
                desc: 'Passwords are hashed using bcrypt with unique salts. We support session-based authentication with automatic timeouts for your protection.',
              },
              {
                icon: Eye,
                title: 'Zero Third-Party Sharing',
                desc: 'Your financial data is never sold, shared with advertisers, or used for any purpose other than providing you with the FinTrack service.',
              },
              {
                icon: Server,
                title: 'Infrastructure Security',
                desc: 'Our servers are hosted in secure data centers with 24/7 monitoring, automated backups, and strict physical access controls.',
              },
              {
                icon: Bug,
                title: 'Vulnerability Management',
                desc: 'We conduct regular security assessments and keep all dependencies up to date to prevent known vulnerabilities from being exploited.',
              },
              {
                icon: RefreshCw,
                title: 'Regular Backups',
                desc: 'Your data is automatically backed up daily with encrypted snapshots, ensuring recovery in case of any unforeseen events.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card group hover:shadow-md hover:border-primary-200 dark:hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                  <feature.icon size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="bg-surface-50 dark:bg-surface-900/50">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl text-center mb-12">
            Security Best Practices for Users
          </h2>
          <div className="space-y-6">
            {[
              {
                title: 'Use a strong, unique password',
                desc: 'Choose a password at least 12 characters long with a mix of letters, numbers, and symbols. Don\'t reuse passwords from other services.',
              },
              {
                title: 'Keep your email secure',
                desc: 'Your email is used for account recovery. Ensure your email account also has a strong password and two-factor authentication enabled.',
              },
              {
                title: 'Log out on shared devices',
                desc: 'Always log out when using FinTrack on public or shared computers to prevent unauthorized access.',
              },
              {
                title: 'Review your activity regularly',
                desc: 'Check your transaction history and notification preferences periodically to ensure all activity is expected.',
              },
              {
                title: 'Report suspicious activity',
                desc: 'If you notice any unauthorized transactions or believe your account has been compromised, contact us immediately at security@fintrack.com.',
              },
            ].map((tip, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/10 text-sm font-bold text-primary-600 dark:text-primary-400">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{tip.title}</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section className="border-t border-surface-200 dark:border-surface-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary-500/30 bg-surface-50 dark:border-primary-500/20 dark:bg-surface-800/50 p-8 sm:p-12 text-center">
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-3">
              Found a vulnerability?
            </h3>
            <p className="text-sm text-surface-600 dark:text-surface-400 max-w-lg mx-auto mb-6">
              We take security reports seriously and appreciate responsible disclosure. Please report
              any security concerns to our dedicated team.
            </p>
            <a
              href="mailto:security@fintrack.com"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-surface-900 shadow-md hover:bg-primary-600 transition-colors"
            >
              <Shield size={16} />
              security@fintrack.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-surface-400">
            &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
