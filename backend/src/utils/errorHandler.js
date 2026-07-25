module.exports = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Determine status code
  let statusCode = 500;
  let errorMessage = 'Internal server error';
  
  if (err.message.includes('Invalid URL') || err.message.includes('URL must')) {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.message.includes('timed out')) {
    statusCode = 408;
    errorMessage = 'Request timeout';
  } else if (err.message.includes('Non-HTML')) {
    statusCode = 400;
    errorMessage = 'URL does not return HTML content';
  } else if (err.message.includes('domain not found')) {
    statusCode = 404;
    errorMessage = 'Domain not found';
  } else if (err.message.includes('status')) {
    statusCode = 400;
    errorMessage = err.message;
  }
  
  res.status(statusCode).json({
    success: false,
    error: errorMessage
  });
};