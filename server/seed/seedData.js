import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDb from '../config/db.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';

dotenv.config();

const departments = ['Chemistry', 'Microbiology', 'Quality', 'Operations'];

const seed = async () => {
  await connectDb();
  await Promise.all([Employee.deleteMany({}), Attendance.deleteMany({}), Leave.deleteMany({})]);

  const admin = await Employee.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@waterlab.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'Operations',
    position: 'System Administrator',
    employeeId: 'WLAB-ADMIN-001',
    hireDate: new Date('2024-01-01'),
  });

  const employeesPayload = Array.from({ length: 25 }).map((_, index) => ({
    firstName: `Emp${index + 1}`,
    lastName: 'Staff',
    email: `emp${index + 1}@waterlab.com`,
    password: 'Password@123',
    role: index < 3 ? 'manager' : 'employee',
    department: departments[index % departments.length],
    position: 'Lab Analyst',
    employeeId: `WLAB-${String(index + 1).padStart(3, '0')}`,
    hireDate: new Date(2024, 0, (index % 28) + 1),
  }));

  const employees = await Employee.insertMany(employeesPayload);

  const today = new Date();
  const attendancePayload = employees.slice(0, 20).map((employee, index) => ({
    employeeId: employee._id,
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    status: index % 7 === 0 ? 'absent' : 'present',
    clockIn: index % 7 === 0 ? '' : '09:00',
    clockOut: index % 7 === 0 ? '' : '17:30',
    hoursWorked: index % 7 === 0 ? 0 : 8.5,
    notes: '',
    markedBy: admin._id,
  }));

  await Attendance.insertMany(attendancePayload);

  await Leave.insertMany([
    {
      employeeId: employees[0]._id,
      leaveType: 'vacation',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      numberOfDays: 3,
      reason: 'Family trip',
      status: 'pending',
    },
    {
      employeeId: employees[1]._id,
      leaveType: 'sick',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      numberOfDays: 2,
      reason: 'Medical leave',
      status: 'approved',
      approvedBy: admin._id,
      approvalDate: new Date(),
    },
  ]);

  console.log('Seed complete');
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
