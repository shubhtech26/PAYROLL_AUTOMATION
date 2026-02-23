import { body } from 'express-validator';
import Employee from '../models/Employee.js';
import generateToken from '../utils/generateToken.js';

const registerValidators = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
];

const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = async (req, res) => {
  const existing = await Employee.findOne({
    $or: [{ email: req.body.email }, { employeeId: req.body.employeeId }],
  });
  if (existing) {
    return res.status(409).json({ message: 'Employee with same email or employeeId already exists' });
  }

  const employee = await Employee.create(req.body);
  return res.status(201).json({
    message: 'Employee registered',
    employee: {
      id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role,
      email: employee.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const employee = await Employee.findOne({ email }).select('+password');

  if (!employee || !(await employee.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(employee);
  return res.json({
    token,
    user: {
      id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role,
      email: employee.email,
      department: employee.department,
    },
  });
};

const me = async (req, res) => {
  return res.json({ user: req.user });
};

const logout = async (req, res) => {
  return res.json({ message: 'Logout successful. Discard token client-side.' });
};

const changePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 chars'),
];

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const employee = await Employee.findById(req.user._id).select('+password');

  if (!(await employee.comparePassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  employee.password = newPassword;
  await employee.save();
  return res.json({ message: 'Password updated successfully' });
};

export {
  register,
  login,
  me,
  logout,
  changePassword,
  registerValidators,
  loginValidators,
  changePasswordValidators,
};
