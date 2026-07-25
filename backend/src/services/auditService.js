const axios = require('axios');
const cheerio = require('cheerio');

class AuditService {
  async audit(url) {
    try {
      // Start timing the request

      const startTime = Date.now();

      // Fetch the page with timeout

      const response = await axios.get(url, {
        timeout: parseInt(process.env.TIMEOUT) || 10000,
        maxContentLength: parseInt(process.env.MAX_RESPONSE_SIZE) || 5242880,
        headers: {
          'User-Agent': 'PagePulse-AuditBot/1.0'
        },
        validateStatus: null // Don't throw on any status
      });

      // Calculate response time in milliseconds
      const responseTime = Date.now() - startTime;

      // Check if response is HTML

      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        throw new Error('Non-HTML response received');
      }

      // Parse HTML

      const $ = cheerio.load(response.data);
      
      // Extract data

      const title = $('title').text().trim() || 'No title found';
      const metaDescription = $('meta[name="description"]').attr('content') || 'No meta description found';
      const h1Count = $('h1').length;
      
      // Count images without alt text

      let imagesMissingAlt = 0;
      $('img').each((i, el) => {
        const alt = $(el).attr('alt');
        if (!alt || alt.trim() === '') {
          imagesMissingAlt++;
        }
      });

      // Approximate word count

      const text = $('body').text().replace(/\s+/g, ' ').trim();
      const wordCount = text ? text.split(/\s+/).length : 0;

      return {
        url: url,
        status: response.status,
        statusText: response.statusText || 'OK',
        responseTime: `${responseTime}ms`, 
        pageTitle: title,
        metaDescription: metaDescription,
        h1Count: h1Count,
        imagesMissingAlt: imagesMissingAlt,
        wordCount: wordCount,
        contentType: contentType,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
     

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. The server took too long to respond.');
      } else if (error.code === 'ENOTFOUND') {
        throw new Error('Invalid URL or domain not found.');
      } else if (error.response) {
        throw new Error(`Server responded with status ${error.response.status}: ${error.response.statusText}`);
      } else if (error.message && error.message.includes('Non-HTML')) {
        throw error;
      } else {
        throw new Error(`Failed to fetch URL: ${error.message}`);
      }
    }
  }
}

module.exports = new AuditService();