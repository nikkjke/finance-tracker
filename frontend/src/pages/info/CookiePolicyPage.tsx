import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

export default function CookiePolicyPage() {
  const sections = [
    {
      title: '1. What Are Cookies?',
      content: [
        'Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and understand how you interact with the service.',
        'FinTrack uses cookies and similar technologies (such as local storage) to provide a seamless experience.',
      ],
    },
    {
      title: '2. Essential Cookies',
      content: [
        'Authentication cookies keep you logged in as you navigate between pages.',
        'Session cookies store your current application state and preferences.',
        'Security cookies help protect your account from unauthorized access.',
        'These cookies are strictly necessary and cannot be disabled without breaking core functionality.',
      ],
    },
    {
      title: '3. Preference Cookies',
      content: [
        'Theme preference (light/dark mode) is stored locally so your visual preference persists across sessions.',
        'Language and locale settings are stored to provide a consistent experience.',
        'Dashboard layout preferences and filter settings are remembered for convenience.',
      ],
    },
    {
      title: '4. Analytics Cookies',
      content: [
        'We use analytics cookies to understand how users interact with FinTrack, such as which features are most popular and where users encounter issues.',
        'Analytics data is aggregated and anonymized — we cannot identify individual users from this data.',
        'You can opt out of analytics cookies through your browser settings without affecting core functionality.',
      ],
    },
    {
      title: '5. Third-Party Cookies',
      content: [
        'FinTrack does not use third-party advertising cookies.',
        'We do not allow third-party tracking on our platform.',
        'Any third-party services we integrate with (such as error monitoring) use cookies that are strictly functional.',
      ],
    },
    {
      title: '6. Managing Cookies',
      content: [
        'Most browsers allow you to view, manage, and delete cookies through their settings.',
        'Blocking essential cookies will prevent you from logging in and using FinTrack.',
        'You can clear all cookies at any time, but you will need to log in again and reconfigure preferences.',
        'For specific browser instructions, consult your browser\'s help documentation.',
      ],
    },
    {
      title: '7. Updates to This Policy',
      content: [
        'We may update this Cookie Policy as our service evolves. Changes will be posted on this page with an updated revision date.',
        'We will notify users of significant changes via email or in-app notification.',
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
            <Cookie size={14} />
            Cookie Policy
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
            How we use{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              cookies
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            We believe in being transparent about how we collect and use data. This policy explains what cookies FinTrack uses and why.
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
          {/* Cookie summary table */}
          <motion.div variants={itemVariants} className="mb-12 overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50">
                  <th className="px-4 py-3 text-left font-semibold text-surface-900 dark:text-white">Cookie Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-900 dark:text-white">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-surface-900 dark:text-white">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {[
                  { type: 'Essential', purpose: 'Authentication, security, session management', required: 'Yes' },
                  { type: 'Preference', purpose: 'Theme, language, layout settings', required: 'No' },
                  { type: 'Analytics', purpose: 'Usage statistics, feature adoption', required: 'No' },
                ].map((row) => (
                  <tr key={row.type} className="bg-white dark:bg-surface-900/50">
                    <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">{row.type}</td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{row.purpose}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.required === 'Yes'
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                          : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                      }`}>
                        {row.required}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

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
              Questions about our cookie practices? Contact us at{' '}
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
