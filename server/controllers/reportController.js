import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';

const buildDateFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  return filter;
};

const getAttendanceReport = async (req, res) => {
  const { startDate, endDate, department } = req.query;
  const dateFilter = buildDateFilter(startDate, endDate);

  const match = { ...dateFilter };
  const records = await Attendance.find(match).populate('employeeId', 'department firstName lastName');

  const summary = records.reduce(
    (acc, record) => {
      acc.total += 1;
      acc[record.status] += 1;
      return acc;
    },
    { total: 0, present: 0, absent: 0, leave: 0 }
  );

  const filtered = department
    ? records.filter((record) => record.employeeId?.department === department)
    : records;

  return res.json({ summary, count: filtered.length, data: filtered });
};

const getLeaveReport = async (req, res) => {
  const { status, leaveType } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (leaveType) filter.leaveType = leaveType;

  const records = await Leave.find(filter)
    .populate('employeeId', 'firstName lastName department')
    .sort({ createdAt: -1 });

  const summary = records.reduce((acc, record) => {
    acc.total += 1;
    acc.byStatus[record.status] = (acc.byStatus[record.status] || 0) + 1;
    acc.byType[record.leaveType] = (acc.byType[record.leaveType] || 0) + 1;
    return acc;
  }, { total: 0, byStatus: {}, byType: {} });

  return res.json({ summary, data: records });
};

const getDashboardStats = async (req, res) => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const [employeesTotal, activeEmployees, todayAttendance, pendingLeaves, approvedLeaves] =
    await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'active' }),
      Attendance.find({ date: { $gte: start, $lt: end } }),
      Leave.countDocuments({ status: 'pending' }),
      Leave.countDocuments({ status: 'approved' }),
    ]);

  const attendanceSummary = todayAttendance.reduce(
    (acc, record) => {
      acc[record.status] += 1;
      return acc;
    },
    { present: 0, absent: 0, leave: 0 }
  );

  return res.json({
    employeesTotal,
    activeEmployees,
    pendingLeaves,
    approvedLeaves,
    todayAttendance: attendanceSummary,
  });
};

const exportReport = async (req, res) => {
  const { type = 'attendance' } = req.body;
  if (!['attendance', 'leave'].includes(type)) {
    return res.status(400).json({ message: 'Invalid export type' });
  }

  if (type === 'attendance') {
    const records = await Attendance.find({}).populate('employeeId', 'employeeId firstName lastName');
    const csv = ['date,employeeId,name,status,hoursWorked'];
    records.forEach((record) => {
      csv.push(
        [
          new Date(record.date).toISOString().slice(0, 10),
          record.employeeId?.employeeId || '',
          `${record.employeeId?.firstName || ''} ${record.employeeId?.lastName || ''}`.trim(),
          record.status,
          record.hoursWorked,
        ].join(',')
      );
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-export.csv');
    return res.send(csv.join('\n'));
  }

  const leaves = await Leave.find({}).populate('employeeId', 'employeeId firstName lastName');
  const csv = ['startDate,endDate,employeeId,name,type,status,days'];
  leaves.forEach((leave) => {
    csv.push(
      [
        new Date(leave.startDate).toISOString().slice(0, 10),
        new Date(leave.endDate).toISOString().slice(0, 10),
        leave.employeeId?.employeeId || '',
        `${leave.employeeId?.firstName || ''} ${leave.employeeId?.lastName || ''}`.trim(),
        leave.leaveType,
        leave.status,
        leave.numberOfDays,
      ].join(',')
    );
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leave-export.csv');
  return res.send(csv.join('\n'));
};

export { getAttendanceReport, getLeaveReport, getDashboardStats, exportReport };
