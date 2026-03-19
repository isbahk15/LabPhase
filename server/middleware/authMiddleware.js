const jwt = require('jsonwebtoken');

/**
 * AUTH MIDDLEWARE
 * This function sits between the incoming request and your route handler.
 * It follows the Express (req, res, next) pattern.
 */
module.exports = function (req, res, next) {
  // 1. Extract the 'Authorization' header from the incoming request
  const authHeader = req.header('Authorization');
  
  /**
   * CHECK FOR HEADER PRESENCE & FORMAT
   * We look for the "Bearer <token>" pattern. 
   * If the header is missing or doesn't start with 'Bearer ', we block the request.
   */
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  /**
   * EXTRACT THE TOKEN
   * Since the header looks like "Bearer eyJhbGci...", we split by the space
   * and take the second element (the actual encrypted string).
   */
  const token = authHeader.split(' ')[1];

  try {
    /**
     * TOKEN VERIFICATION
     * jwt.verify compares the token against your JWT_SECRET (defined in .env).
     * If the token was tampered with or expired, this will throw an error.
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    /**
     * ATTACH USER TO REQUEST
     * We pull the user ID/data out of the decoded payload and attach it to 'req'.
     * This allows subsequent routes to know exactly WHO is making the request
     * (e.g., req.user.id).
     */
    req.user = decoded.user;
    
    // Pass control to the next function in the route chain
    next();
  } catch (err) {
    /**
     * ERROR HANDLING
     * If the token is invalid, malformed, or expired, we return a 401 status.
     */
    res.status(401).json({ message: 'Token is not valid' });
  }
};