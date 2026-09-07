import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 py-8 bg-[#080C14]/80">
      <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:items-center sm:justify-between">
        
        <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-0">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">ScamShield AI</span>
          <span className="text-xs text-slate-500 font-mono">v1.0.0</span>
        </div>

        <p className="text-xs text-slate-400 font-mono">
          AI-assisted message security risk analyzer. Designed for explainability & zero-trust verification.
        </p>

      </div>
    </footer>
  );
}
