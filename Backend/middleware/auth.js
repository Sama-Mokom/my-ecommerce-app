import { verifyAccessToken, extractTokenFromHeader } from "../utils/jwt.js";

// middleware function to verify javascript tokens
export const authenticateToken = (req, res, next) =>{
    try{
        const token = extractTokenFromHeader(req.headers.authorization);
        const decoded = verifyAccessToken(token);

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name 
        };
        next();
    } catch (error) {
        console.error('Authentication error: ', error.message);
        return res.status(401).json({
            error: 'Access denied',
            message: error.message
        });
    }
};


// Optional authentication middleware for routes that do not require authentication
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      const decoded = verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name
      };
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};