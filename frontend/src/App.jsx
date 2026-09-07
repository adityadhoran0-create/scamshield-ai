import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AnalyzerForm from './components/AnalyzerForm';
import AnalysisLoading from './components/AnalysisLoading';
import ResultReport from './components/ResultReport';
import DemoSelector from './components/DemoSelector';
import ArchitectureView from './components/ArchitectureView';
import Footer from './components/Footer';
import { analyzeMessageApi, checkHealthApi, getDemoMessagesApi } from './services/api';
import { FALLBACK_DEMO_MESSAGES } from './data/demoMessages';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [modelStatus, setModelStatus] = useState({ model_loaded: true });
  const [demos, setDemos] = useState(FALLBACK_DEMO_MESSAGES);

  useEffect(() => {
    // Check Backend status & fetch demo presets on mount
    const initApp = async () => {
      const health = await checkHealthApi();
      if (health && typeof health === 'object') {
        setModelStatus(health);
      }

      const serverDemos = await getDemoMessagesApi();
      if (Array.isArray(serverDemos) && serverDemos.length > 0) {
        setDemos(serverDemos);
      }
    };
    initApp();
  }, []);

  const handleAnalyze = async () => {
    if (!messageText.trim()) return;

    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      // Simulate minimum loading duration for visual smoothness
      const [data] = await Promise.all([
        analyzeMessageApi(messageText),
        new Promise((resolve) => setTimeout(resolve, 2200))
      ]);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Security analysis request failed. Please check backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (msg) => {
    setMessageText(msg);
    setResult(null);
    setError(null);
    setActiveTab('analyzer');

    // Scroll to input box
    const card = document.getElementById('analyzer-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setResult(null);
    setMessageText('');
    setError(null);
  };

  const handleScrollToAnalyzer = () => {
    setActiveTab('analyzer');
    const card = document.getElementById('analyzer-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        modelStatus={modelStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'analyzer' && (
          <>
            {/* Hero Banner (Shown when no result present) */}
            {!result && !isLoading && (
              <HeroSection onAnalyzeClick={handleScrollToAnalyzer} />
            )}

            {/* Input Form */}
            {!result && !isLoading && (
              <>
                <AnalyzerForm
                  messageText={messageText}
                  setMessageText={setMessageText}
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  error={error}
                />

                {/* Judge Demo Selector */}
                <DemoSelector
                  demos={demos}
                  onSelectDemo={handleSelectDemo}
                />
              </>
            )}

            {/* Loading Indicator State */}
            {isLoading && <AnalysisLoading />}

            {/* Assessment Security Report Result */}
            {result && !isLoading && (
              <ResultReport
                result={result}
                originalMessage={messageText}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {/* Architecture & Judge Breakdown View */}
        {activeTab === 'architecture' && (
          <ArchitectureView modelMetrics={modelStatus?.model_metrics} />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
