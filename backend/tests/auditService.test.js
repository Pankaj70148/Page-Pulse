const auditService = require('../src/services/auditService');
const axios = require('axios');
const cheerio = require('cheerio');

// Mock axios and cheerio
jest.mock('axios');
jest.mock('cheerio');

describe('Audit Service - URL Audit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== HAPPY PATH TESTS ====================

  describe('Happy Path - Successful URL Audits', () => {
    test('should successfully audit a valid HTML page', async () => {
      // Mock HTML response
      const mockHtml = `
        <html>
          <head>
            <title>Test Page Title</title>
            <meta name="description" content="Test meta description">
          </head>
          <body>
            <h1>Main Heading</h1>
            <h1>Second Heading</h1>
            <img src="image1.jpg" alt="Valid alt text">
            <img src="image2.jpg" alt="">
            <img src="image3.jpg">
            <p>Test content with some words for word count calculation.</p>
          </body>
        </html>
      `;

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: mockHtml
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await auditService.audit('https://example.com');

      // Assertions
      expect(result).toBeDefined();
      expect(result.url).toBe('https://example.com');
      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.responseTime).toMatch(/^\d+ms$/);
      expect(result.pageTitle).toBe('Test Page Title');
      expect(result.metaDescription).toBe('Test meta description');
      expect(result.h1Count).toBe(2);
      expect(result.imagesMissingAlt).toBe(2);
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.contentType).toBe('text/html');
      expect(result.timestamp).toBeDefined();
    });

    test('should handle pages without meta description', async () => {
      const mockHtml = `
        <html>
          <head>
            <title>No Meta Page</title>
          </head>
          <body>
            <h1>Heading</h1>
            <p>Some content</p>
          </body>
        </html>
      `;

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: mockHtml
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await auditService.audit('https://example.com');

      expect(result.metaDescription).toBe('No meta description found');
      expect(result.pageTitle).toBe('No Meta Page');
    });

    test('should handle pages with no H1 tags', async () => {
      const mockHtml = `
        <html>
          <head>
            <title>No H1 Page</title>
          </head>
          <body>
            <p>No headings here</p>
          </body>
        </html>
      `;

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: mockHtml
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await auditService.audit('https://example.com');

      expect(result.h1Count).toBe(0);
    });
  });

  // ==================== FAILURE CASE TESTS ====================

  describe('Failure Cases - Error Handling', () => {
    test('should handle invalid URL format', async () => {
      const invalidUrl = 'not-a-valid-url';

      await expect(auditService.audit(invalidUrl)).rejects.toThrow(
        'Failed to fetch URL'
      );
    });

    test('should handle domain not found (ENOTFOUND)', async () => {
      const error = new Error('getaddrinfo ENOTFOUND example.com');
      error.code = 'ENOTFOUND';
      
      axios.get.mockRejectedValue(error);

      await expect(auditService.audit('https://nonexistent-domain.com')).rejects.toThrow(
        'Invalid URL or domain not found'
      );
    });

    test('should handle request timeout (ETIMEDOUT)', async () => {
      const error = new Error('timeout of 10000ms exceeded');
      error.code = 'ETIMEDOUT';
      
      axios.get.mockRejectedValue(error);

      await expect(auditService.audit('https://slow-website.com')).rejects.toThrow(
        'Request timed out'
      );
    });

    test('should handle non-HTML responses (JSON)', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        },
        data: '{"key": "value"}'
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(auditService.audit('https://api.example.com')).rejects.toThrow(
        'Non-HTML response received'
      );
    });

    test('should handle non-HTML responses (Image)', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'image/jpeg'
        },
        data: Buffer.from('image data')
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(auditService.audit('https://example.com/image.jpg')).rejects.toThrow(
        'Non-HTML response received'
      );
    });

    test('should handle server error responses (500)', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'content-type': 'text/html'
        },
        data: '<html><body>Server Error</body></html>'
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(auditService.audit('https://error-server.com')).rejects.toThrow(
        'Server responded with status 500: Internal Server Error'
      );
    });

    test('should handle 404 responses', async () => {
      const mockResponse = {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'content-type': 'text/html'
        },
        data: '<html><body>404 Not Found</body></html>'
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(auditService.audit('https://example.com/not-found')).rejects.toThrow(
        'Server responded with status 404: Not Found'
      );
    });

    test('should handle network errors', async () => {
      const error = new Error('Network error');
      error.code = 'ECONNREFUSED';
      
      axios.get.mockRejectedValue(error);

      await expect(auditService.audit('https://localhost:9999')).rejects.toThrow(
        'Failed to fetch URL'
      );
    });
  });

  // ==================== EDGE CASE TESTS ====================

  describe('Edge Cases', () => {
    test('should handle empty page content', async () => {
      const mockHtml = `
        <html>
          <head>
            <title></title>
          </head>
          <body></body>
        </html>
      `;

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: mockHtml
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await auditService.audit('https://empty-page.com');

      expect(result.pageTitle).toBe('No title found');
      expect(result.metaDescription).toBe('No meta description found');
      expect(result.h1Count).toBe(0);
      expect(result.imagesMissingAlt).toBe(0);
      expect(result.wordCount).toBe(0);
    });

    test('should handle pages with special characters', async () => {
      const mockHtml = `
        <html>
          <head>
            <title>Special &lt;chars&gt; &amp; symbols</title>
            <meta name="description" content="Description with © and ™">
          </head>
          <body>
            <h1>Heading with émoji 🎉</h1>
            <p>Content with special characters: ñ, ü, 你好</p>
          </body>
        </html>
      `;

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: mockHtml
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await auditService.audit('https://special-chars.com');

      expect(result.pageTitle).toContain('Special');
      expect(result.metaDescription).toContain('©');
      expect(result.wordCount).toBeGreaterThan(0);
    });

    test('should handle large HTML pages', async () => {
      // Generate large HTML
      let largeContent = '<html><head><title>Large Page</title></head><body>';
      for (let i = 0; i < 1000; i++) {
        largeContent += `<p>Paragraph ${i} with some content for testing.</p>`;
      }
      largeContent += '</body></html>';

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: largeContent
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await auditService.audit('https://large-page.com');

      expect(result.wordCount).toBeGreaterThan(5000);
      expect(result.pageTitle).toBe('Large Page');
    });

    test('should handle HTTPS URLs correctly', async () => {
      const mockHtml = `
        <html>
          <head><title>HTTPS Page</title></head>
          <body><p>Secure page</p></body>
        </html>
      `;

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: mockHtml
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await auditService.audit('https://secure.example.com');

      expect(result.url).toBe('https://secure.example.com');
      expect(result.status).toBe(200);
    });
  });

  // ==================== PERFORMANCE TESTS ====================

  describe('Performance Tests', () => {
    test('should measure response time accurately', async () => {
      const mockHtml = `
        <html>
          <head><title>Performance Test</title></head>
          <body><p>Testing response time</p></body>
        </html>
      `;

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'text/html'
        },
        data: mockHtml
      };

      // Simulate response delay
      axios.get.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockResponse), 100);
        });
      });

      const startTime = Date.now();
      const result = await auditService.audit('https://delay-test.com');
      const endTime = Date.now();
      const actualTime = endTime - startTime;

      // Parse response time
      const responseTimeMs = parseInt(result.responseTime);
      
      expect(responseTimeMs).toBeGreaterThanOrEqual(100);
      expect(responseTimeMs).toBeLessThanOrEqual(actualTime);
      expect(result.responseTime).toMatch(/^\d+ms$/);
    });
  });
});