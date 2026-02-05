import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET);
}
