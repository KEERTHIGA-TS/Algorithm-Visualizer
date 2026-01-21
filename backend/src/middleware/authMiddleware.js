// backend/src/middleware/authMiddleware.js - FIXED JWT ID
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ CRITICAL FIX: Use decoded.id (matches generateToken)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired, please login again' 
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token' 
        });
      }

      return res.status(401).json({ 
        message: 'Not authorized, token verification failed' 
      });
    }
  } else {
    return res.status(401).json({ 
      message: 'Not authorized, no token provided' 
    });
  }
};

export default authMiddleware;