const { validateUrl } = require('../src/utils/validators');

describe('URL Validator Tests', () => {
  describe('Valid URLs', () => {
    test('should accept valid HTTP URL', () => {
      const result = validateUrl('http://example.com');
      expect(result).toBeNull();
    });

    test('should accept valid HTTPS URL', () => {
      const result = validateUrl('https://example.com');
      expect(result).toBeNull();
    });

    test('should accept URL with subdomain', () => {
      const result = validateUrl('https://sub.example.com');
      expect(result).toBeNull();
    });

    test('should accept URL with path', () => {
      const result = validateUrl('https://example.com/path/to/page');
      expect(result).toBeNull();
    });

    test('should accept URL with query parameters', () => {
      const result = validateUrl('https://example.com?q=test&page=1');
      expect(result).toBeNull();
    });

    test('should accept URL with port', () => {
      const result = validateUrl('http://localhost:3000');
      expect(result).toBeNull();
    });
  });

  describe('Invalid URLs', () => {
    test('should reject empty URL', () => {
      const result = validateUrl('');
      expect(result).toBe('URL is required');
    });

    test('should reject null URL', () => {
      const result = validateUrl(null);
      expect(result).toBe('URL is required');
    });

    test('should reject undefined URL', () => {
      const result = validateUrl(undefined);
      expect(result).toBe('URL is required');
    });

    test('should reject URL without protocol', () => {
      const result = validateUrl('example.com');
      expect(result).toBe('Invalid URL format. Please enter a valid URL including http:// or https://');
    });

    test('should reject URL with FTP protocol', () => {
      const result = validateUrl('ftp://example.com');
      expect(result).toBe('URL must use HTTP or HTTPS protocol');
    });

    test('should reject URL with file protocol', () => {
      const result = validateUrl('file:///C:/test.html');
      expect(result).toBe('URL must use HTTP or HTTPS protocol');
    });

    test('should reject invalid format', () => {
      const result = validateUrl('not-a-url');
      expect(result).toBe('Invalid URL format. Please enter a valid URL including http:// or https://');
    });

    test('should reject URL with spaces', () => {
      const result = validateUrl('https://example .com');
      expect(result).toBe('Invalid URL format. Please enter a valid URL including http:// or https://');
    });
  });

  describe('Edge Cases', () => {
    test('should handle URL with trailing slash', () => {
      const result = validateUrl('https://example.com/');
      expect(result).toBeNull();
    });

    test('should handle URL with www', () => {
      const result = validateUrl('https://www.example.com');
      expect(result).toBeNull();
    });

    test('should handle localhost URL', () => {
      const result = validateUrl('http://localhost:5000');
      expect(result).toBeNull();
    });

    test('should handle IP address URL', () => {
      const result = validateUrl('http://127.0.0.1:3000');
      expect(result).toBeNull();
    });
  });
});