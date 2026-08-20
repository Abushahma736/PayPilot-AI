import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Brain, ShieldCheck, ShoppingCart, TrendingUp, CreditCard, Zap, ArrowRight, Search, BarChart3, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  { icon: Brain, title: 'AI-Powered Recommendations', desc: 'Natural language understanding to find exactly what you need within your budget.' },
  { icon: TrendingUp, title: 'Smart Budget Tracking', desc: 'Real-time budget monitoring with warnings and cheaper alternative suggestions.' },
  { icon: Zap, title: 'Agentic Shopping Flow', desc: 'Watch the AI think — understand, search, compare, and recommend step by step.' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Razorpay-powered secure checkout with multiple payment options.' },
  { icon: ShoppingCart, title: 'Intelligent Cart', desc: 'Smart cart that respects your budget and suggests savings opportunities.' },
  { icon: BarChart3, title: 'AI Insights', desc: 'Track money saved, purchase patterns, and personalized shopping analytics.' },
];

const steps = [
  { num: '01', label: 'Understand', desc: 'AI parses your natural language request', icon: Brain },
  { num: '02', label: 'Search', desc: 'Filters products matching your criteria', icon: Search },
  { num: '03', label: 'Compare', desc: 'Evaluates options on price, rating, features', icon: BarChart3 },
  { num: '04', label: 'Recommend', desc: 'Suggests best products with reasoning', icon: CheckCircle2 },
  { num: '05', label: 'Cart', desc: 'Add selections with budget tracking', icon: ShoppingCart },
  { num: '06', label: 'Checkout', desc: 'Secure payment via Razorpay', icon: CreditCard },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <Zap size={14} />
              Razorpay AI Builder Internship 2026
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Your AI-Powered{' '}
            <span className="gradient-text">Shopping</span>{' '}
            Assistant
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 text-balance"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Tell PayPilot what you need in plain English. Our AI understands your budget,
            finds the best products, explains why, and handles checkout — all in one seamless flow.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Link to="/register" className="btn-primary text-base flex items-center gap-2">
              Try AI Assistant <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn-secondary text-base">
              Browse Products
            </Link>
          </motion.div>

          {/* Demo prompt */}
          <motion.div
            className="mt-16 max-w-2xl mx-auto glass-card p-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-surface-500 mb-1">Try saying something like:</p>
                <p className="text-surface-200 font-medium">
                  "I need wireless headphones under ₹3000 with good battery life"
                </p>
              </div>
            </div>
            <div className="h-px bg-surface-800 my-4" />
            <div className="flex flex-wrap gap-2">
              {['Electronics', 'Gaming', 'Under ₹2000', 'Top Rated'].map(tag => (
                <span key={tag} className="badge-primary text-xs">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Intelligent Features for <span className="gradient-text">Smart Shopping</span>
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              Everything you need for a seamless AI-assisted shopping experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card p-6 group hover:border-primary-500/30 transition-all duration-300"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <div className="w-11 h-11 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <f.icon size={22} className="text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              How <span className="gradient-text-accent">PayPilot AI</span> Works
            </h2>
            <p className="text-surface-400 max-w-xl mx-auto">
              A transparent, agentic workflow you can follow step by step.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative glass-card-light p-6 group"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <span className="text-5xl font-extrabold text-surface-800 absolute top-4 right-5 select-none">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4">
                  <step.icon size={20} className="text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{step.label}</h3>
                <p className="text-sm text-surface-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center glass-card p-10 sm:p-14 relative overflow-hidden"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-500/10 rounded-full blur-[60px]" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 relative">
            Ready to Shop <span className="gradient-text">Smarter</span>?
          </h2>
          <p className="text-surface-400 mb-8 max-w-md mx-auto relative">
            Let AI handle the research. You just tell it what you need.
          </p>
          <Link to="/register" className="btn-primary text-base inline-flex items-center gap-2 relative">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
