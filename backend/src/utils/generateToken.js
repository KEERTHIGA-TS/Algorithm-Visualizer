import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign(
    { id },  // ✅ Changed from { userId: id }
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};