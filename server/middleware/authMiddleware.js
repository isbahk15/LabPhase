const jwt = require('jsonwebtoken');
// verifies the JWT token so that unauthorised users are prevented acccess

module.exports = function(req, res, next) {
    // extracts token from header
    const authHeader = req.header('Authorization');
    
    // Check if no token, then returns a 401 status code
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // this logic splits the string to retrieve only the needed token string
        const token = authHeader.split(' ')[1] || authHeader;
        // if the token has been altered it shows an error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (err) {
        // if the verification fails, a 401 status code is displayed
        res.status(401).json({ message: 'Token is not valid' });
    }
};