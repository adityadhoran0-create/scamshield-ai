import React, { useEffect, useState } from 'react';

export default function RiskGauge({ score, riskLevel }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color mappings
  const getRiskColors = (level) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-400',
          border: 'border-rose-500/40',
          badgeBg: 'bg-rose-500/10',
          glow: 'shadow-rose-500/30'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-400',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500/10',
          glow: 'shadow-amber-500/30'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-400',
          text: 'text-yellow-300',
          border: 'border-yellow-400/40',
          badgeBg: 'bg-yellow-400/10',
          glow: 'shadow-yellow-400/20'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-400',
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500/10',
          glow: 'shadow-emerald-500/30'
        };
    }
  };

  const style = getRiskColors(riskLevel);

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-6 rounded-2xl glass-card border border-slate-800 text-center">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Overall Message Risk Score</span>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold font-mono uppercase tracking-wider ${style.badgeBg} ${style.border} ${style.text}`}>
          {riskLevel} RISK
        </div>
      </div>

      {/* Main Big Score */}
      <div className="my-3">
        <div className="inline-flex items-baseline space-x-1">
          <span className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight ${style.text}`}>
            {animatedScore}
          </span>
          <span className="text-2xl font-bold text-slate-500 font-mono">/ 100</span>
        </div>
      </div>

      {/* Horizontal Visual Meter Bar */}
      <div className="relative mt-6 mb-3">
        {/* Background Track */}
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-amber-500 to-rose-600 opacity-20"></div>
        </div>

        {/* Animated Filled Track */}
        <div
          className="absolute top-0 left-0 h-4 rounded-full overflow-hidden transition-all duration-1000 ease-out"
          style={{ width: `${animatedScore}%` }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-amber-500 to-rose-600 shadow-lg"></div>
        </div>

        {/* Pointer Pin */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out pointer-events-none"
          style={{ left: `${animatedScore}%` }}
        >
          <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-900 shadow-xl shadow-cyan-500/50"></div>
        </div>
      </div>

      {/* Ticks & Labels */}
      <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-1">
        <div className="flex flex-col items-start">
          <span className="text-emerald-400 font-semibold">0</span>
          <span>LOW</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-yellow-300 font-semibold">25</span>
          <span>MEDIUM</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-amber-400 font-semibold">50</span>
          <span>HIGH</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-rose-400 font-semibold">100</span>
          <span>CRITICAL</span>
        </div>
      </div>

    </div>
  );
}
