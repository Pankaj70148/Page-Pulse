const auditService = require('../services/auditService');
const { validateUrl } = require('../utils/validators');

exports.auditUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    // Validate URL
    const validationError = validateUrl(url);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError
      });
    }

    // Perform audit
    const report = await auditService.audit(url);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};