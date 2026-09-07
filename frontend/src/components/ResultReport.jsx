import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Cpu, CheckCircle2, 
  Copy, Check, RefreshCw, FileText, ExternalLink, Info 
} from 'lucide-react';
import RiskGauge from './RiskGauge';

export default function ResultReport({ result, originalMessage, onReset }) {
  const [copied, setCopied] = useState(false);

  const signals = Array.isArray(result?.signals) ? result.signals : [];
  const recommendations = Array.isArray(result?.recommendations) ? result.recommendations : [];
  const extractedUrls = Array.isArray(result?.extracted_urls) ? result.extracted_urls : [];
  const urlThreats = Array.isArray(result?.url_threats) ? result.url_threats : [];

  const handleCopyReport = () => {
    const reportText = `[ScamShield AI Security Report]\n` +
      `Risk Score: ${result?.risk_score || 0}/100 (${result?.risk_level || 'UNKNOWN'})\n` +
      `Category: ${result?.category || 'Unknown'}\n` +
      `Signals: ${signals.join(', ') || 'None'}\n` +
      `Explanation: ${result?.explanation || ''}\n` +
      `Recommended Action: ${recommendations.join(' ')}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      
      {/* Security Report Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden mb-6">
        
        {/* Status Bar Top Line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          result?.risk_level === 'CRITICAL' ? 'bg-rose-500' :
          result?.risk_level === 'HIGH' ? 'bg-amber-500' :
          result?.risk_level === 'MEDIUM' ? 'bg-yellow-400' : 'bg-emerald-500'
        }`}></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Security Assessment Report</span>
              <span className="text-xs font-mono text-slate-400">• {result?.timestamp ? new Date(result.timestamp).toLocaleTimeString() : 'Just now'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
              <span>{result?.category || 'Suspicious Message'}</span>
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center space-x-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
            </button>

            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center space-x-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Analyze Another</span>
            </button>
          </div>
        </div>

        {/* Risk Score Gauge Component */}
        <RiskGauge score={result?.risk_score || 0} riskLevel={result?.risk_level || 'LOW'} />

        {/* 3-Column Breakdown Grid (ML, Rules, URL) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* ML Score Card */}
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>ML Model Probability</span>
              </span>
            </div>
            <p className="text-2xl font-bold font-mono text-white">{result?.ml_probability ?? 0}%</p>
            <p className="text-[11px] text-slate-400 mt-1">TF-IDF + Logistic Regression inference</p>
          </div>

          {/* Rule Signals Card */}
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Rule Signal Score</span>
              </span>
            </div>
            <p className="text-2xl font-bold font-mono text-white">{result?.rule_score ?? 0}%</p>
            <p className="text-[11px] text-slate-400 mt-1">12 heuristic threat patterns matched</p>
          </div>

          {/* URL Threat Card */}
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                <span>URL Threat Score</span>
              </span>
            </div>
            <p className="text-2xl font-bold font-mono text-white">{result?.url_score ?? 0}%</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {extractedUrls.length > 0 ? `${extractedUrls.length} link(s) passively inspected` : 'No URLs detected'}
            </p>
          </div>

        </div>

        {/* Detected Threat Indicators Section */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Detected Risk Indicators ({signals.length})</span>
          </h3>

          {signals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {signals.map((sig, idx) => (
                <div
                  key={idx}
                  className="glass-card px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-medium flex items-center space-x-2.5"
                >
                  <span className="text-amber-400">⚠️</span>
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-3.5 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No explicit social engineering flags or URL threat indicators detected.</span>
            </div>
          )}
        </div>

        {/* AI Explanation Box */}
        <div className="mb-6 glass-card p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Explainable AI Analysis</span>
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            "{result?.explanation || 'No detailed explanation available.'}"
          </p>
        </div>

        {/* Safe Recommended Actions */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Recommended Safe Actions</span>
          </h3>

          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="glass-card p-3 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start space-x-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <span className="leading-normal">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyzed Raw Message Display */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <h3 className="text-xs font-mono text-slate-400 mb-2 flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Analyzed Message Content</span>
          </h3>
          <div className="bg-[#080C14] p-3.5 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
            {originalMessage}
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 transition-all inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Analyze Another Message</span>
          </button>
        </div>

      </div>
    </div>
  );
}
