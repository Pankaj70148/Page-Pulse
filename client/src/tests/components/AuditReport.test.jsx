import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import AuditReport from '../../components/AuditReport';

describe('AuditReport Component Tests', () => {
  const mockReport = {
    url: 'https://example.com',
    status: 200,
    statusText: 'OK',
    responseTime: '234ms',
    pageTitle: 'Example Domain',
    metaDescription: 'Test meta description',
    h1Count: 3,
    imagesMissingAlt: 2,
    wordCount: 1234,
    contentType: 'text/html',
    timestamp: '2026-07-25T05:59:32.657Z'
  };

  test('should render all metrics', () => {
    render(<AuditReport report={mockReport} />);

    expect(screen.getByText('📋 Audit Report')).toBeInTheDocument();
    expect(screen.getByText('HTTP Status')).toBeInTheDocument();
    expect(screen.getByText('200 OK')).toBeInTheDocument();
    expect(screen.getByText('Response Time')).toBeInTheDocument();
    expect(screen.getByText('234ms')).toBeInTheDocument();
    expect(screen.getByText('Page Title')).toBeInTheDocument();
    expect(screen.getByText('Example Domain')).toBeInTheDocument();
    expect(screen.getByText('H1 Tags')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Images Missing Alt Text')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Word Count')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  test('should display the URL as a link', () => {
    render(<AuditReport report={mockReport} />);
    
    const link = screen.getByText('https://example.com');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  test('should render action buttons', () => {
    render(<AuditReport report={mockReport} />);
    
    expect(screen.getByText('🖨️ Print Report')).toBeInTheDocument();
    expect(screen.getByText('📋 Copy JSON')).toBeInTheDocument();
  });

  test('should handle missing meta description', () => {
    const reportWithoutMeta = {
      ...mockReport,
      metaDescription: 'No meta description found'
    };

    render(<AuditReport report={reportWithoutMeta} />);
    expect(screen.getByText('No meta description found')).toBeInTheDocument();
  });
});