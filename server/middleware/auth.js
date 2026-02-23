import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Employee from '../models/Employee.js';

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const employee = await Employee.findById(decoded.id).select('-password');
    if (!employee) {
      return res.status(401).json({ message: 'Invalid token user' });
    }
    req.user = employee;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

export default protect;
