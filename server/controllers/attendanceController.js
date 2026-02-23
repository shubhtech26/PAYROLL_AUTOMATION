import { body } from 'express-validator';
import Attendance from '../models/Attendance.js';

const attendanceValidators = [
  body('employeeId').notEmpty().withMessage('employeeId required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('status').isIn(['present', 'absent', 'leave']).withMessage('Invalid status'),
];

const toMinutes = (hhmm) => {
  if (!hhmm) return null;
  const [hours, minutes] = hhmm.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const calcHoursWorked = (clockIn, clockOut) => {
  const inMinutes = toMinutes(clockIn);
  const outMinutes = toMinutes(clockOut);
  if (inMinutes === null || outMinutes === null || outMinutes < inMinutes) return 0;
  return Number(((outMinutes - inMinutes) / 60).toFixed(2));
};

const getAttendance = async (req, res) => {
  const { employeeId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (employeeId) filter.employeeId = employeeId;
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [records, total] = await Promise.all([
    Attendance.find(filter)
      .populate('employeeId', 'firstName lastName employeeId department')
      .populate('markedBy', 'firstName lastName')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Attendance.countDocuments(filter),
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

const getTodayAttendance = async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const records = await Attendance.find({ date: { $gte: start, $lt: end } }).populate(
    'employeeId',
    'firstName lastName department employeeId'
  );

  const summary = records.reduce(
    (acc, record) => {
      acc[record.status] += 1;
      return acc;
    },
    { present: 0, absent: 0, leave: 0 }
  );

  return res.json({ summary, data: records });
};

const getAttendanceById = async (req, res) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('employeeId', 'firstName lastName employeeId')
    .populate('markedBy', 'firstName lastName');
  if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
  return res.json(attendance);
};

const markAttendance = async (req, res) => {
  const payload = {
    ...req.body,
    date: new Date(req.body.date),
    markedBy: req.user._id,
  };

  payload.hoursWorked = calcHoursWorked(payload.clockIn, payload.clockOut);

  const attendance = await Attendance.findOneAndUpdate(
    {
      employeeId: payload.employeeId,
      date: new Date(payload.date.getFullYear(), payload.date.getMonth(), payload.date.getDate()),
    },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  return res.status(201).json({ message: 'Attendance saved', data: attendance });
};

const updateAttendance = async (req, res) => {
  const existing = await Attendance.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Attendance not found' });

  const updates = { ...req.body };
  if (updates.clockIn || updates.clockOut) {
    updates.hoursWorked = calcHoursWorked(updates.clockIn || existing.clockIn, updates.clockOut || existing.clockOut);
  }

  existing.auditTrail.push({
    editedBy: req.user._id,
    changes: `Updated by ${req.user.firstName} ${req.user.lastName}`,
  });

  Object.assign(existing, updates);
  await existing.save();
  return res.json({ message: 'Attendance updated', data: existing });
};

const deleteAttendance = async (req, res) => {
  const attendance = await Attendance.findByIdAndDelete(req.params.id);
  if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
  return res.json({ message: 'Attendance deleted' });
};

const exportAttendance = async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {};
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const records = await Attendance.find(filter)
    .populate('employeeId', 'employeeId firstName lastName department')
    .sort({ date: -1 });

  const header = 'date,employeeId,name,department,status,clockIn,clockOut,hoursWorked,notes';
  const rows = records.map((record) => {
    const date = new Date(record.date).toISOString().slice(0, 10);
    const employee = record.employeeId || {};
    return [
      date,
      employee.employeeId || '',
      `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
      employee.department || '',
      record.status,
      record.clockIn || '',
      record.clockOut || '',
      record.hoursWorked || 0,
      `"${(record.notes || '').replaceAll('"', '""')}"`,
    ].join(',');
  });

  const csv = [header, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.csv');
  return res.send(csv);
};

export {
  getAttendance,
  getTodayAttendance,
  getAttendanceById,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  exportAttendance,
  attendanceValidators,
};
