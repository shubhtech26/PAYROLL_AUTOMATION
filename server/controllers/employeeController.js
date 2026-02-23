import { body } from 'express-validator';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';

const createEmployeeValidators = [
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('employeeId').notEmpty().withMessage('Employee ID required'),
];

const updateEmployeeValidators = [
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
];

const getEmployees = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    department,
    status,
    role,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const filter = {};
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [employees, total] = await Promise.all([
    Employee.find(filter).select('-password').sort(sort).skip(skip).limit(Number(limit)),
    Employee.countDocuments(filter),
  ]);

  return res.json({
    data: employees,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

const getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id).select('-password');
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  return res.json(employee);
};

const createEmployee = async (req, res) => {
  const payload = { ...req.body };

  if (req.user.role === 'manager') {
    if (payload.role && payload.role !== 'employee') {
      return res.status(403).json({ message: 'Managers can only create employee accounts' });
    }
    payload.role = 'employee';
  }

  const existing = await Employee.findOne({
    $or: [{ email: payload.email }, { employeeId: payload.employeeId }],
  });
  if (existing) return res.status(409).json({ message: 'Email or Employee ID already exists' });

  const employee = await Employee.create(payload);
  return res.status(201).json({ message: 'Employee created', data: { ...employee.toObject(), password: undefined } });
};

const updateEmployee = async (req, res) => {
  const updates = { ...req.body };
  delete updates.password;

  const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  return res.json({ message: 'Employee updated', data: employee });
};

const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  return res.json({ message: 'Employee deleted' });
};

const getEmployeeStats = async (req, res) => {
  const { id } = req.params;
  const [presentCount, absentCount, leaveCount, approvedLeaves] = await Promise.all([
    Attendance.countDocuments({ employeeId: id, status: 'present' }),
    Attendance.countDocuments({ employeeId: id, status: 'absent' }),
    Attendance.countDocuments({ employeeId: id, status: 'leave' }),
    Leave.countDocuments({ employeeId: id, status: 'approved' }),
  ]);

  return res.json({
    employeeId: id,
    attendance: { present: presentCount, absent: absentCount, leave: leaveCount },
    approvedLeaves,
  });
};

export {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  createEmployeeValidators,
  updateEmployeeValidators,
};
