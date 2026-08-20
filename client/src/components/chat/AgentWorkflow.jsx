import { motion } from 'framer-motion';
import { Brain, Search, BarChart3, Sparkles, ShoppingCart, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';

export default function AgentWorkflow({ currentStep = 0, statusText = '', isProcessing = false }) {
  const steps = [
    { id: 1, title: 'Understand', desc: 'Extract category & budget', icon: Brain },
    { id: 2, title: 'Search', desc: 'Scan product catalog', icon: Search },
    { id: 3, title: 'Compare', desc: 'Rank by score & value', icon: BarChart3 },
    { id: 4, title: 'Recommend', desc: 'Generate AI reasoning', icon: Sparkles },
    { id: 5, title: 'Cart', desc: 'Budget & item management', icon: ShoppingCart },
    { id: 6, title: 'Checkout', desc: 'Seamless Razorpay flow', icon: CreditCard },
  ];

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-surface-800/80 mb-5">
        <div>
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Agentic Pipeline
          </h3>
          <p className="text-xs text-surface-400 mt-0.5">Real-time autonomous decision workflow</p>
        </div>
        {isProcessing && (
          <span className="badge-primary flex items-center gap-1.5 py-1 px-2.5 text-xs">
            <Loader2 size={12} className="animate-spin" />
            Processing
          </span>
        )}
      </div>

      <div className="space-y-3.5 relative flex-1">
        {/* Connecting line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-surface-800 -z-0" />

        {steps.map((step, idx) => {
          const isCompleted = currentStep > idx + 1;
          const isActive = currentStep === idx + 1;
          const isPending = currentStep < idx + 1;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative z-10 flex items-start gap-3.5 p-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-primary-500/10 border border-primary-500/30 shadow-md shadow-primary-500/5'
                  : isCompleted
                  ? 'bg-surface-900/40 border border-surface-800/60'
                  : 'opacity-50'
              }`}
            >
              {/* Step indicator node */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isActive
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30 animate-pulse-soft'
                    : 'bg-surface-800 text-surface-500 border border-surface-700'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-semibold uppercase tracking-wider ${
                    isActive ? 'text-primary-300' : isCompleted ? 'text-surface-200' : 'text-surface-400'
                  }`}>
                    {step.title}
                  </h4>
                  <span className="text-[10px] text-surface-500 font-mono">0{step.id}</span>
                </div>
                <p className="text-xs text-surface-400 truncate mt-0.5">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {statusText && (
        <div className="mt-4 p-3 rounded-xl bg-surface-900/80 border border-surface-800 text-xs text-surface-300 font-mono flex items-center gap-2">
          <span className="text-primary-400">&gt;</span>
          <span className="truncate">{statusText}</span>
        </div>
      )}
    </div>
  );
}
