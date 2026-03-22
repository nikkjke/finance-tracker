import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'We collect information you provide when creating an account, including your name, email address, and password (stored as a secure hash).',
        'When you use our QR receipt scanning feature, we process receipt data such as store name, purchase amount, date, and item details. This data is stored solely for your expense tracking purposes.',
        'We automatically collect usage data such as pages visited, features used, and device information to improve our service.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To provide and maintain the FinTrack service, including expense tracking, budgeting, and analytics features.',
        'To process and categorize your scanned receipts and transactions.',
        'To send notifications about budget limits, monthly summaries, and important account updates.',
        'To improve our service through aggregated, anonymized usage analytics.',
      ],
    },
    {
      title: '3. Data Storage & Security',
      content: [
        'All personal and financial data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
        'Your data is stored on secure servers with strict access controls and regular security audits.',
        'We do not store actual payment card numbers or banking credentials.',
      ],
    },
    {
      title: '4. Data Sharing',
      content: [
        'We do not sell, rent, or trade your personal information to third parties.',
        'We do not share your financial data with advertisers or marketing companies.',
        'We may share anonymized, aggregated statistics for research purposes only.',
        'We may disclose information if required by law or to protect our legal rights.',
      ],
    },
    {
      title: '5. Your Rights',
      content: [
        'You can access, update, or delete your personal data at any time through your Profile settings.',
        'You can export all your data in CSV or PDF format from the Reports page.',
        'You can request complete account deletion, which will permanently remove all associated data.',
        'You can opt out of non-essential communications at any time.',
      ],
    },
    {
      title: '6. Cookies',
      content: [
        'We use essential cookies to maintain your login session and remember your preferences (such as theme selection).',
        'We use analytics cookies to understand how our service is used. You can disable these in your browser settings.',
        'For detailed information, please refer to our Cookie Policy.',
      ],
    },
    {
      title: '7. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification.',
        'Continued use of FinTrack after changes constitutes acceptance of the updated policy.',
      ],
    },
  ];

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
        <motion.div 
          className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400">
            <Shield size={14} />
            Privacy Policy
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
            Your privacy{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              matters to us
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            We are committed to protecting your personal information and being transparent about how we handle your data.
          </motion.p>
          <motion.p variants={itemVariants} className="mt-3 text-sm text-surface-400 dark:text-surface-500">
            Last updated: March 15, 2026
          </motion.p>
        </motion.div>
      </section>

      {/* Content */}
      <section>
        <motion.div 
          className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="space-y-10">
            {sections.map((section) => (
              <motion.div variants={itemVariants} key={section.title}>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">{section.title}</h2>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-12 rounded-xl border border-surface-200 bg-surface-50 p-6 dark:border-surface-700 dark:bg-surface-800/50">
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@fintrack.com" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                privacy@fintrack.com
              </a>
              .
            </p>
          </motion.div>
        </motion.div>
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
