import React from 'react';
import { Shield, ShieldAlert, Cpu, Activity, Info } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, modelStatus }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('analyzer')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">ScamShield</span>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded border border-cyan-500/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider font-mono uppercase">Explainable Risk Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center space-x-2 ${
              activeTab === 'analyzer'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Analyze Message</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center space-x-2 ${
              activeTab === 'architecture'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </button>
        </nav>

        {/* System Status Pill */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${modelStatus?.model_loaded ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${modelStatus?.model_loaded ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-mono text-slate-300 text-[11px]">
              {modelStatus?.model_loaded ? 'TF-IDF ML Active' : 'Fallback Engine Active'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
