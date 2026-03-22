import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

export default function TermsOfServicePage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By creating an account or using FinTrack, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.',
        'We may update these terms from time to time. Continued use of FinTrack after changes constitutes acceptance of the revised terms.',
      ],
    },
    {
      title: '2. Description of Service',
      content: [
        'FinTrack is a personal finance management platform that provides expense tracking, receipt scanning via QR codes, budget management, and financial analytics.',
        'The service is provided "as is" and we continually work to improve features and fix issues.',
      ],
    },
    {
      title: '3. User Accounts',
      content: [
        'You must provide accurate and complete information when creating an account.',
        'You are responsible for maintaining the confidentiality of your login credentials.',
        'You must be at least 16 years old to use the service.',
        'One person may not maintain more than one account.',
      ],
    },
    {
      title: '4. Acceptable Use',
      content: [
        'You agree to use FinTrack only for lawful, personal finance management purposes.',
        'You may not attempt to gain unauthorized access to other users\' accounts or our systems.',
        'You may not use the service for commercial purposes without our prior written consent.',
        'You may not upload malicious content or attempt to exploit vulnerabilities in the platform.',
      ],
    },
    {
      title: '5. Data and Content',
      content: [
        'You retain ownership of all data you enter into FinTrack, including transaction records and receipt data.',
        'You grant us a limited license to process and store your data solely for the purpose of providing the service.',
        'You can export or delete your data at any time through the platform.',
      ],
    },
    {
      title: '6. Service Availability',
      content: [
        'We aim for 99.9% uptime but do not guarantee uninterrupted access to the service.',
        'We may perform scheduled maintenance with advance notice via email or in-app notification.',
        'We reserve the right to modify, suspend, or discontinue features with reasonable notice.',
      ],
    },
    {
      title: '7. Limitation of Liability',
      content: [
        'FinTrack is a tracking and analytics tool and does not provide financial advice.',
        'We are not liable for financial decisions made based on data or analytics provided by the service.',
        'Our liability is limited to the amount you have paid for the service in the 12 months preceding any claim.',
      ],
    },
    {
      title: '8. Account Termination',
      content: [
        'You may delete your account at any time from your Profile settings.',
        'We may suspend or terminate accounts that violate these terms after providing notice.',
        'Upon termination, your data will be permanently deleted within 30 days unless legally required to retain it.',
      ],
    },
    {
      title: '9. Governing Law',
      content: [
        'These terms are governed by the laws of the Republic of Moldova.',
        'Any disputes will be resolved through binding arbitration in Chișinău, Moldova.',
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
            <FileText size={14} />
            Terms of Service
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
            Terms of{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Service
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using FinTrack.
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
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@fintrack.com" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                legal@fintrack.com
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
