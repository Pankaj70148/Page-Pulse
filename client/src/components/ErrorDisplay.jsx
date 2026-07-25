import React from 'react';
import './ErrorDisplay.css';

function ErrorDisplay({ error }) {
  return (
    <div className="error-display">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>Error</h3>
        <p>{error}</p>
        <p className="error-hint">
          Make sure the URL is valid and accessible from the internet.
        </p>
      </div>
    </div>
  );
}

export default ErrorDisplay;