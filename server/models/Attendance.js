import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
    clockIn: { type: String },
    clockOut: { type: String },
    hoursWorked: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    auditTrail: [
      {
        editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
        editedAt: { type: Date, default: Date.now },
        changes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: -1 });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
