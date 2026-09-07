import React, { useRef } from 'react';
import { Search, Trash2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function AnalyzerForm({ messageText, setMessageText, onAnalyze, isLoading, error }) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (messageText.trim() && !isLoading) {
        onAnalyze();
      }
    }
  };

  return (
    <div id="analyzer-card" className="w-full max-w-3xl mx-auto mb-10">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600"></div>

        <div className="flex items-center justify-between mb-3">
          <label htmlFor="message-input" className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Message Content Security Scanner</span>
          </label>
          <div className="flex items-center space-x-3">
            {messageText && (
              <button
                onClick={() => setMessageText('')}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors"
                title="Clear input text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-800">
              {messageText.length} / 5000
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            id="message-input"
            ref={textareaRef}
            rows={5}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your suspicious SMS, WhatsApp message, email, or social media text here..."
            className="w-full bg-[#080C14] text-slate-100 placeholder-slate-500 text-sm sm:text-base rounded-xl p-4 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all resize-y font-mono leading-relaxed"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit & Controls Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400 font-mono hidden sm:block">
            Tip: Press <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] border border-slate-700">Ctrl + Enter</kbd> to analyze
          </p>

          <button
            onClick={onAnalyze}
            disabled={!messageText.trim() || isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center space-x-2.5 shadow-lg ${
              !messageText.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-cyan-400/30 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Message...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Message</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
