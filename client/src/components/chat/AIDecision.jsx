import { CheckCircle2, ShieldCheck, Sparkles, TrendingDown, Target } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export default function AIDecision({ budget, detectedCategory, preferences = [], decisionFactors = [], reasoning, savings }) {
  return (
    <div className="rounded-2xl bg-surface-900/90 border border-primary-500/25 p-4 sm:p-5 mt-3 shadow-lg shadow-primary-950/40">
      <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-surface-800">
        <div className="w-7 h-7 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center">
          <Sparkles size={16} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            AI Decision Matrix
            <span className="badge-primary text-[10px] py-0.5">Internship Showcase</span>
          </h4>
          <p className="text-[11px] text-surface-400">Autonomous evaluation criteria & score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
        <div className="p-2.5 rounded-xl bg-surface-800/60 border border-surface-700/50">
          <span className="text-[10px] uppercase font-semibold text-surface-400 block tracking-wider mb-1 flex items-center gap-1">
            <Target size={12} className="text-primary-400" /> Target Requirement
          </span>
          <p className="text-xs font-medium text-surface-200">
            {detectedCategory || 'Smart Query'}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-800/60 border border-surface-700/50">
          <span className="text-[10px] uppercase font-semibold text-surface-400 block tracking-wider mb-1 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" /> Budget Envelope
          </span>
          <p className="text-xs font-medium text-surface-200">
            {budget ? formatCurrency(budget) : 'No upper limit set'}
          </p>
        </div>
      </div>

      {decisionFactors && decisionFactors.length > 0 && (
        <div className="mb-3">
          <span className="text-[11px] font-semibold text-surface-300 block mb-2">Key Value Factors:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {decisionFactors.map((factor, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-surface-300 bg-surface-800/40 px-2.5 py-1.5 rounded-lg">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {reasoning && (
        <div className="text-xs text-surface-300 bg-surface-950/60 p-3 rounded-xl border border-surface-800/80 leading-relaxed font-sans">
          <span className="text-primary-400 font-semibold mr-1">Agent Strategy:</span>
          {reasoning}
        </div>
      )}

      {savings && savings > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <TrendingDown size={14} />
          <span>Estimated savings from maximum budget: <strong>{formatCurrency(savings)}</strong></span>
        </div>
      )}
    </div>
  );
}
