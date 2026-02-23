import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const generateToken = (employee) =>
  jwt.sign({ id: employee._id, role: employee.role }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });

export default generateToken;
