import { body } from 'express-validator';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';

const leaveValidators = [
  body('leaveType').isIn(['vacation', 'sick', 'personal', 'emergency']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
];

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const getLeaves = async (req, res) => {
  const { status, employeeId, leaveType, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (employeeId) filter.employeeId = employeeId;
  if (leaveType) filter.leaveType = leaveType;

  const skip = (Number(page) - 1) * Number(limit);
  const [records, total] = await Promise.all([
    Leave.find(filter)
      .populate('employeeId', 'firstName lastName employeeId department')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Leave.countDocuments(filter),
  ]);

  return res.json({
    data: records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

const getPendingLeaves = async (req, res) => {
  const leaves = await Leave.find({ status: 'pending' })
    .populate('employeeId', 'firstName lastName employeeId department')
    .sort({ createdAt: 1 });
  return res.json(leaves);
};

const getLeaveById = async (req, res) => {
  const leave = await Leave.findById(req.params.id)
    .populate('employeeId', 'firstName lastName employeeId')
    .populate('approvedBy', 'firstName lastName');
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  return res.json(leave);
};

const createLeave = async (req, res) => {
  const { startDate, endDate } = req.body;
  const numberOfDays = calculateDays(startDate, endDate);
  if (numberOfDays <= 0) return res.status(400).json({ message: 'Invalid leave date range' });

  const leave = await Leave.create({
    ...req.body,
    employeeId: req.user.role === 'employee' ? req.user._id : req.body.employeeId || req.user._id,
    numberOfDays,
  });

  return res.status(201).json({ message: 'Leave request submitted', data: leave });
};

const markLeaveAttendance = async (leave, approverId) => {
  const current = new Date(leave.startDate);
  const end = new Date(leave.endDate);

  while (current <= end) {
    const dateOnly = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    await Attendance.findOneAndUpdate(
      { employeeId: leave.employeeId, date: dateOnly },
      {
        employeeId: leave.employeeId,
        date: dateOnly,
        status: 'leave',
        markedBy: approverId,
        notes: `Auto-marked by approved leave (${leave.leaveType})`,
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
    current.setDate(current.getDate() + 1);
  }
};

const approveLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  if (leave.status !== 'pending') {
    return res.status(400).json({ message: `Cannot approve leave in ${leave.status} status` });
  }

  leave.status = 'approved';
  leave.approvedBy = req.user._id;
  leave.approvalDate = new Date();
  leave.rejectionReason = '';
  await leave.save();

  await markLeaveAttendance(leave, req.user._id);
  return res.json({ message: 'Leave approved', data: leave });
};

const rejectLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  if (leave.status !== 'pending') {
    return res.status(400).json({ message: `Cannot reject leave in ${leave.status} status` });
  }

  leave.status = 'rejected';
  leave.approvedBy = req.user._id;
  leave.approvalDate = new Date();
  leave.rejectionReason = req.body.rejectionReason || 'Not specified';
  await leave.save();

  return res.json({ message: 'Leave rejected', data: leave });
};

const deleteLeave = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });

  if (req.user.role === 'employee' && leave.employeeId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Cannot delete other employee leave request' });
  }

  await leave.deleteOne();
  return res.json({ message: 'Leave request deleted' });
};

const getEmployeeLeaveHistory = async (req, res) => {
  const leaves = await Leave.find({ employeeId: req.params.id })
    .populate('approvedBy', 'firstName lastName')
    .sort({ startDate: -1 });
  return res.json(leaves);
};

export {
  getLeaves,
  getPendingLeaves,
  getLeaveById,
  createLeave,
  approveLeave,
  rejectLeave,
  deleteLeave,
  getEmployeeLeaveHistory,
  leaveValidators,
};
