import React, { useState } from 'react';
import HealthForm from './components/HealthForm';
import ScoreCard  from './components/ScoreCard';
import History    from './components/History';
import { submitHealthData } from './services/api';
import './App.css';

export default function App() {
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [refresh,  setRefresh]  = useState(0);
  const [activeTab, setActiveTab] = useState('form');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitHealthData(data);
      setResult(res);
      setRefresh((r) => r + 1);
      setActiveTab('result');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Something went wrong. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">❤️</span>
            <span className="logo-text">HealthScore</span>
          </div>
          <p className="tagline">Wearable data → personalized insights</p>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          {/* Left panel */}
          <section className="panel panel-left">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >Enter Data</button>
              <button
                className={`tab ${activeTab === 'result' ? 'active' : ''}`}
                onClick={() => setActiveTab('result')}
                disabled={!result}
              >Results</button>
            </div>

            {activeTab === 'form' && (
              <>
                {error && <div className="alert alert-error">{error}</div>}
                <HealthForm onSubmit={handleSubmit} loading={loading} />
              </>
            )}

            {activeTab === 'result' && result && (
              <>
                <ScoreCard result={result} />
                <button
                  className="btn btn-outline"
                  style={{ marginTop: '1.5rem', width: '100%' }}
                  onClick={() => setActiveTab('form')}
                >
                  ← Check Again
                </button>
              </>
            )}
          </section>

          {/* Right panel */}
          <section className="panel panel-right">
            <History refreshTrigger={refresh} />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>For demonstration only — not a substitute for medical advice.</p>
      </footer>
    </div>
  );
}
