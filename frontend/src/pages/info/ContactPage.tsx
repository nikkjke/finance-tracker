import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Clock, Send } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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
            <Mail size={14} />
            Get in Touch
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
            Contact{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              our team
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or partnership inquiry? We'd love to hear from you.
          </motion.p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="border-b border-surface-200 dark:border-surface-800">
        <motion.div 
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-surface-900 dark:text-white mb-8">Reach Us Directly</motion.h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: 'Email',
                    detail: 'support@fintrack.com',
                    sub: 'We reply within 24 hours on business days.',
                  },
                  {
                    icon: MapPin,
                    title: 'Address',
                    detail: 'Chișinău, Republic of Moldova',
                    sub: 'Our headquarters and development center.',
                  },
                  {
                    icon: Clock,
                    title: 'Business Hours',
                    detail: 'Mon – Fri, 9:00 AM – 6:00 PM (EET)',
                    sub: 'Emergency email support available 24/7.',
                  },
                ].map((item) => (
                  <motion.div variants={itemVariants} key={item.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10">
                      <item.icon size={20} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-surface-700 dark:text-surface-300">{item.detail}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="card">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-6">Send a Message</h3>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
                    <Send size={24} className="text-success-600 dark:text-success-400" />
                  </div>
                  <h4 className="text-base font-semibold text-surface-900 dark:text-white mb-2">Message Sent!</h4>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        First Name
                      </label>
                      <input type="text" required className="input text-sm w-full" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Last Name
                      </label>
                      <input type="text" required className="input text-sm w-full" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Email
                    </label>
                    <input type="email" required className="input text-sm w-full" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Subject
                    </label>
                    <input type="text" required className="input text-sm w-full" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="input text-sm w-full resize-none"
                      placeholder="Tell us more about your question or feedback..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full text-sm">
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
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
