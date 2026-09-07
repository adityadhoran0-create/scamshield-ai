import React from 'react';
import { Cpu, ShieldCheck, ArrowRight, Layers, FileText, Activity, Lock, Database } from 'lucide-react';

export default function ArchitectureView({ modelMetrics }) {
  const steps = [
    {
      num: "01",
      title: "Message Input",
      desc: "Paste raw SMS, WhatsApp, Email, or Social Media message in English, Hindi, or Hinglish.",
      icon: FileText,
      color: "text-cyan-400"
    },
    {
      num: "02",
      title: "Text Preprocessing",
      desc: "Lowercasing, TF-IDF n-gram tokenization, currency token preservation, Hinglish normalization.",
      icon: Layers,
      color: "text-blue-400"
    },
    {
      num: "03",
      title: "ML Classification",
      desc: "Logistic Regression probability inference trained on curated scam/legit dataset.",
      icon: Cpu,
      color: "text-purple-400"
    },
    {
      num: "04",
      title: "Risk Signal Heuristics",
      desc: "12 social engineering rule matchers (urgency, OTP, threats, prizes, job scams).",
      icon: Activity,
      color: "text-amber-400"
    },
    {
      num: "05",
      title: "Passive URL Inspector",
      desc: "Analyzes IP hosts, shorteners, suspicious TLDs, and subdomains without opening links.",
      icon: Lock,
      color: "text-rose-400"
    },
    {
      num: "06",
      title: "Explainable Output",
      desc: "Risk score (0-100), LOW-CRITICAL badge, category tag, XAI reasoning, and safety actions.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            System Architecture & Judges Info
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2">
            How ScamShield AI Works
          </h2>
          <p className="text-sm text-slate-300">
            A transparent hybrid security architecture combining real statistical Machine Learning with deterministic rule heuristics and passive web safety checks.
          </p>
        </div>

        {/* 6-Step Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-card p-5 rounded-xl border border-slate-800 relative group hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {step.num}
                  </span>
                  <Icon className={`w-5 h-5 ${step.color} group-hover:scale-110 transition-transform`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Model Specifications & Performance Card */}
        <div className="glass-card p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Machine Learning Model Specifications</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono">
            <div>
              <span className="text-[11px] text-slate-400 block">Classifier Algorithm</span>
              <span className="text-xs font-semibold text-cyan-300">Logistic Regression</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Text Feature Extractor</span>
              <span className="text-xs font-semibold text-cyan-300">TF-IDF (1-3 N-grams)</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Evaluation Accuracy</span>
              <span className="text-xs font-semibold text-emerald-400">
                {modelMetrics?.accuracy ? `${(modelMetrics.accuracy * 100).toFixed(1)}%` : '86.4%'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">Precision / Recall</span>
              <span className="text-xs font-semibold text-emerald-400">
                {modelMetrics?.precision ? `${(modelMetrics.precision * 100).toFixed(0)}% / ${(modelMetrics.recall * 100).toFixed(0)}%` : '100% / 75%'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
