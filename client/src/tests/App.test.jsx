import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { auditUrl } from '../services/api';

// Mock the API
jest.mock('../services/api');

describe('App Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the application header', () => {
    render(<App />);
    expect(screen.getByText('🔍 Page Pulse')).toBeInTheDocument();
    expect(screen.getByText('Audit any webpage for SEO and accessibility metrics')).toBeInTheDocument();
  });

  test('should render the input form', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Audit URL')).toBeInTheDocument();
  });

  test('should show loading spinner when auditing', async () => {
    // Mock API to delay response
    auditUrl.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<App />);
    
    const input = screen.getByPlaceholderText('https://example.com');
    const button = screen.getByText('Audit URL');

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    // Check for loading spinner
    await waitFor(() => {
      expect(screen.getByText('Auditing URL...')).toBeInTheDocument();
    });
  });

  test('should display report when audit succeeds', async () => {
    const mockReport = {
      url: 'https://example.com',
      status: 200,
      statusText: 'OK',
      responseTime: '234ms',
      pageTitle: 'Example Domain',
      metaDescription: 'Test description',
      h1Count: 1,
      imagesMissingAlt: 0,
      wordCount: 17,
      contentType: 'text/html',
      timestamp: '2026-07-25T05:59:32.657Z'
    };

    auditUrl.mockResolvedValue(mockReport);

    render(<App />);
    
    const input = screen.getByPlaceholderText('https://example.com');
    const button = screen.getByText('Audit URL');

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    // Wait for report to display
    await waitFor(() => {
      expect(screen.getByText('📋 Audit Report')).toBeInTheDocument();
      expect(screen.getByText('Example Domain')).toBeInTheDocument();
      expect(screen.getByText('234ms')).toBeInTheDocument();
    });
  });

  test('should display error when audit fails', async () => {
    const errorMessage = 'Domain not found';
    auditUrl.mockRejectedValue(new Error(errorMessage));

    render(<App />);
    
    const input = screen.getByPlaceholderText('https://example.com');
    const button = screen.getByText('Audit URL');

    fireEvent.change(input, { target: { value: 'https://nonexistent.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('should show validation error for empty URL', async () => {
    render(<App />);
    
    const button = screen.getByText('Audit URL');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a URL')).toBeInTheDocument();
    });
  });

  test('should show validation error for invalid URL', async () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText('https://example.com');
    const button = screen.getByText('Audit URL');

    fireEvent.change(input, { target: { value: 'not-a-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid URL (e.g., https://example.com)')).toBeInTheDocument();
    });
  });
});