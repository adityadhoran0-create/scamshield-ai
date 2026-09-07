import React from 'react';
import { ShieldCheck, Lock, Globe, Sparkles, AlertTriangle } from 'lucide-react';

export default function HeroSection({ onAnalyzeClick }) {
  return (
    <div className="relative pt-6 pb-10 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center px-4">
        
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Explainable AI Risk Engine • English, Hindi & Hinglish</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Don't Trust. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">Verify.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Instant explainable AI security audit for suspicious SMS, WhatsApp, Email, and social media messages. Detect social-engineering tactics before taking action.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onAnalyzeClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center space-x-2 border border-cyan-400/30 group"
          >
            <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Analyze a Message</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="glass-card p-3 rounded-xl border border-slate-800 text-left flex items-start space-x-2.5">
            <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Zero-Trust Analysis</p>
              <p className="text-[11px] text-slate-400 leading-tight">Passive inspection</p>
            </div>
          </div>

          <div className="glass-card p-3 rounded-xl border border-slate-800 text-left flex items-start space-x-2.5">
            <Globe className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Multilingual Support</p>
              <p className="text-[11px] text-slate-400 leading-tight">EN, HI & Hinglish</p>
            </div>
          </div>

          <div className="glass-card p-3 rounded-xl border border-slate-800 text-left flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Explainable AI (XAI)</p>
              <p className="text-[11px] text-slate-400 leading-tight">Transparent signals</p>
            </div>
          </div>

          <div className="glass-card p-3 rounded-xl border border-slate-800 text-left flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">URL Threat Inspector</p>
              <p className="text-[11px] text-slate-400 leading-tight">Non-visiting parser</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
