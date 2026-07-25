import React, { useState } from 'react';
import './AuditForm.css';

function AuditForm({ onAudit, loading, onReset }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol || !['http:', 'https:'].includes(urlObj.protocol)) {
        setError('URL must start with http:// or https://');
        return;
      }
      onAudit(url);
    } catch (err) {
      setError('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  const handleReset = () => {
    setUrl('');
    setError('');
    onReset();
  };

  return (

    <>
   
    <div className="audit-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Enter URL to Audit</label>
          <div className="input-group">
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
              className={error ? 'error' : ''}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Auditing...' : 'Audit URL'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      </form>
    </div>

     </>
  );
}

export default AuditForm;