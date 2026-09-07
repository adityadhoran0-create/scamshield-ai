import React from 'react';
import { Sparkles, Gift, Building2, Briefcase, Truck, CheckCircle, Languages } from 'lucide-react';

const DEMO_ICONS = {
  prize_scam: Gift,
  bank_kyc: Building2,
  job_wfh: Briefcase,
  delivery_parcel: Truck,
  hinglish_sbi: Languages,
  legit_otp: CheckCircle
};

export default function DemoSelector({ demos, onSelectDemo }) {
  const safeDemos = Array.isArray(demos) ? demos : [];

  if (safeDemos.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Try Demo Messages (Instant Judge Presets)</span>
        </span>
        <span className="text-[11px] text-slate-500 font-mono">1-click test fill</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {safeDemos.map((demo) => {
          const Icon = (demo && demo.id && DEMO_ICONS[demo.id]) ? DEMO_ICONS[demo.id] : Sparkles;

          return (
            <button
              key={demo?.id || Math.random()}
              onClick={() => onSelectDemo(demo?.message || '')}
              className="glass-card p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-500/5 text-left transition-all group"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-300">
                  {demo?.title || 'Demo Message'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                {demo?.description || ''}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
