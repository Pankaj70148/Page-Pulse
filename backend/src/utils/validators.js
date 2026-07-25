exports.validateUrl = (url) => {
  if (!url) {
    return 'URL is required';
  }
  
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.protocol || !['http:', 'https:'].includes(parsedUrl.protocol)) {
      return 'URL must use HTTP or HTTPS protocol';
    }
    return null; // Valid
  } catch (error) {
    return 'Invalid URL format. Please enter a valid URL including http:// or https://';
  }
};