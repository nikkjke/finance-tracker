import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, BookOpen, Mail, Clock, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { useState } from 'react';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-surface-900 dark:text-white">{question}</span>
        <ChevronDown
          size={18}
          className={`text-surface-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const faqs = [
    {
      question: 'How do I scan a receipt?',
      answer: 'Navigate to the "Add Expense" page and click "Scan QR Code". Point your camera at the QR code on your receipt. The data will be automatically extracted and pre-filled in the expense form.',
    },
    {
      question: 'Can I edit an expense after adding it?',
      answer: 'Yes! Go to your Dashboard, find the transaction you want to edit, and click the edit icon. You can modify the amount, category, date, and description.',
    },
    {
      question: 'How do budgets work?',
      answer: 'You can set monthly budgets for each spending category. FinTrack will track your spending against these budgets and notify you when you\'re approaching your limit.',
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Absolutely. All data is encrypted in transit and at rest using AES-256 encryption. We never share your data with third parties. Read our Security page for more details.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export your transactions and reports from the Reports page. We support CSV and PDF formats for easy record-keeping.',
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to Profile > Settings and select "Delete Account". This will permanently remove all your data from our servers. Please note this action cannot be undone.',
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
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400">
            <HelpCircle size={14} />
            Help Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
            How can we{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              help you?
            </span>
          </h1>
          <p className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions, explore our guides, or reach out to our support team directly.
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="border-b border-surface-200 dark:border-surface-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: 'Live Chat',
                desc: 'Chat with our support team in real-time during business hours.',
                action: 'Start Chat',
              },
              {
                icon: Mail,
                title: 'Email Support',
                desc: 'Send us a detailed message and we\'ll respond within 24 hours.',
                action: 'support@fintrack.com',
              },
              {
                icon: BookOpen,
                title: 'Documentation',
                desc: 'Browse our comprehensive guides and tutorials.',
                action: 'View Docs',
              },
            ].map((option) => (
              <div key={option.title} className="card text-center group hover:shadow-md transition-shadow">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                  <option.icon size={22} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2">{option.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{option.desc}</p>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{option.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface-50 dark:bg-surface-900/50">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-base text-surface-600 dark:text-surface-400">
              Quick answers to the most common questions about FinTrack.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="border-t border-surface-200 dark:border-surface-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-surface-500 dark:text-surface-400 mb-4">
            <Clock size={18} />
            <span className="text-sm font-medium">Support Hours</span>
          </div>
          <p className="text-base text-surface-900 dark:text-white font-semibold">
            Monday – Friday: 9:00 AM – 6:00 PM (EET)
          </p>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Email support is monitored 24/7 for urgent issues.
          </p>
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
