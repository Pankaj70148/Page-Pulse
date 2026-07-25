import React from 'react';
import './AuditReport.css';

function AuditReport({ report }) {
  const metrics = [
    { label: 'HTTP Status', value: `${report.status} ${report.statusText}`, icon: '📊' },
    { label: 'Response Time', value: report.responseTime, icon: '⏱️' },
    { label: 'Page Title', value: report.pageTitle, icon: '📝' },
    { label: 'Meta Description', value: report.metaDescription, icon: '📄' },
    { label: 'H1 Tags', value: report.h1Count, icon: '🔤' },
    { label: 'Images Missing Alt Text', value: report.imagesMissingAlt, icon: '🖼️' },
    { label: 'Word Count', value: report.wordCount.toLocaleString(), icon: '📖' }
  ];

  return (
       <>   
    <div className="audit-report">
      <div className="report-header">
        <h2>📋 Audit Report</h2>
        <div className="report-url">
          <span className="label">URL:</span>
          <a href={report.url} target="_blank" rel="noopener noreferrer">
            {report.url}
          </a>
        </div>
        <div className="report-timestamp">
          <span className="label">Audited at:</span>
          <span>{new Date(report.timestamp).toLocaleString()}</span>
        </div>
        <div className="report-content-type">
          <span className="label">Content Type:</span>
          <span className="badge">{report.contentType}</span>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="report-actions">
        
        <button onClick={() => window.print()} className="btn-secondary">
          🖨️ Print Report
        </button>
        <button onClick={() => navigator.clipboard.writeText(JSON.stringify(report, null, 2))} 
                className="btn-secondary">
          📋 Copy JSON
        </button>
      </div>
    </div>
    </> 
  );
}

export default AuditReport;