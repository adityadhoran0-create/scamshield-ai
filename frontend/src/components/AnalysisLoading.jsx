import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Activity, Search, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
  { text: "AI is analyzing message...", icon: Search },
  { text: "Checking language & Hinglish patterns...", icon: Sparkles },
  { text: "Running TF-IDF + Logistic Regression ML inference...", icon: Cpu },
  { text: "Detecting social-engineering & urgency signals...", icon: Activity },
  { text: "Evaluating non-visiting passive URL risk...", icon: ShieldCheck }
];

export default function AnalysisLoading() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-12 text-center">
      <div className="glass-panel p-8 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Animated Cyber Scan Line */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scan-bar"></div>

        {/* Outer Pulsing Orb */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl p-0.5 shadow-xl shadow-cyan-500/30">
            <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">Deep Cyber Security Audit in Progress</h3>
        <p className="text-xs text-slate-400 mb-6 font-mono">Evaluating textual features & threat heuristics</p>

        {/* Step-by-step list */}
        <div className="space-y-3 max-w-md mx-auto text-left">
          {LOADING_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 p-2.5 rounded-xl transition-all border ${
                  isCurrent
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-sm'
                    : isDone
                    ? 'bg-slate-900/60 border-slate-800/80 text-emerald-400'
                    : 'opacity-40 border-transparent text-slate-500'
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                      ✓
                    </div>
                  ) : isCurrent ? (
                    <Icon className="w-5 h-5 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium font-mono">{step.text}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
