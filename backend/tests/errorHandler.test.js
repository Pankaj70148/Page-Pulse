const errorHandler = require('../src/utils/errorHandler');

describe('Error Handler Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  test('should handle validation errors (400)', () => {
    const error = new Error('Invalid URL format');
    
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid URL format'
    });
  });

  test('should handle timeout errors (408)', () => {
    const error = new Error('Request timed out');
    
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(408);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Request timeout'
    });
  });

  test('should handle domain not found (404)', () => {
    const error = new Error('Domain not found');
    
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Domain not found'
    });
  });

  test('should handle non-HTML response (400)', () => {
    const error = new Error('URL does not return HTML content');
    
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'URL does not return HTML content'
    });
  });

  test('should handle server errors (500)', () => {
    const error = new Error('Internal server error');
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error'
    });
  });

  test('should handle unknown errors (500)', () => {
    const error = new Error('Something unexpected');
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error'
    });
  });
});