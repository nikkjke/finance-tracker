import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import fintrackLogo from '../../assets/fintrack-logo.svg';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../lib/animations';

export default function AboutUsPage() {
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
        <motion.div 
          className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400">
            <Users size={14} />
            About FinTrack
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl lg:text-5xl">
            Building a smarter way to{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              manage money
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-base text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
            FinTrack was born from a simple idea: managing personal finances shouldn't be complicated.
            We're a passionate team building tools that make expense tracking effortless and insightful.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission & Values */}
      <section className="border-b border-surface-200 dark:border-surface-800">
        <motion.div 
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl mb-6">Our Mission</motion.h2>
              <motion.p variants={itemVariants} className="text-base text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
                We believe everyone deserves clear visibility into their finances. Our mission is to empower
                individuals to take control of their spending, save smarter, and achieve their financial goals
                through intuitive technology.
              </motion.p>
              <motion.p variants={itemVariants} className="text-base text-surface-600 dark:text-surface-400 leading-relaxed">
                Since launching in 2024, FinTrack has helped over 10,000 users track more than $2 million
                in monthly expenses, making personal finance management accessible to everyone.
              </motion.p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, title: 'Focused', desc: 'We build features that solve real financial challenges.' },
                { icon: Heart, title: 'User-First', desc: 'Every decision starts with what helps our users most.' },
                { icon: Sparkles, title: 'Innovative', desc: 'We leverage QR scanning and smart categorization.' },
                { icon: Users, title: 'Inclusive', desc: 'Financial tools for everyone, regardless of expertise.' },
              ].map((v) => (
                <motion.div variants={itemVariants} key={v.title} className="card text-center group hover:shadow-md transition-shadow">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 group-hover:bg-primary-100 dark:group-hover:bg-primary-500/20 transition-colors">
                    <v.icon size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{v.title}</h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="bg-surface-50 dark:bg-surface-900/50">
        <motion.div 
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl mb-6">Our Story</motion.h2>
            <div className="space-y-4 text-base text-surface-600 dark:text-surface-400 leading-relaxed text-left">
              <motion.p variants={itemVariants}>
                FinTrack started as a university project when our founders realized that existing expense
                trackers were either too complex for everyday use or too simplistic to provide real insights.
              </motion.p>
              <motion.p variants={itemVariants}>
                We set out to build something different — a tool that combines the simplicity of scanning
                a receipt with the power of real-time analytics. Using QR code technology, FinTrack eliminates
                the tedious manual entry that makes most people give up on tracking expenses within the first week.
              </motion.p>
              <motion.p variants={itemVariants}>
                Today, FinTrack is used by thousands of people to manage their daily finances, set budgets,
                and understand their spending habits. We're committed to continuous improvement and listen
                closely to our community to shape the future of the product.
              </motion.p>
            </div>
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
