import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Auditing URL...</p>
    </div>
  );
}

export default LoadingSpinner;