import React, { useState } from 'react';
import AuditForm from './components/AuditForm';
import AuditReport from './components/AuditReport';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { auditUrl } from './services/api';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleAudit = async (url) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await auditUrl(url);
      setReport(result);
    } catch (err) {
      setError(err.message || 'Failed to audit URL');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔍 Page Pulse</h1>
        <p>Audit any webpage for SEO and accessibility metrics</p>
      </header>

      <main className="app-main">
        <div className="container">
          <AuditForm 
            onAudit={handleAudit} 
            loading={loading}
            onReset={handleReset}
          />

          {loading && <LoadingSpinner />}
          
          {error && <ErrorDisplay error={error} />}
          
          {report && <AuditReport report={report} />}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built for{' '}
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Digital Heroes Training Task
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;