import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: {
      type: String,
      enum: ['vacation', 'sick', 'personal', 'emergency'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    reason: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    approvalDate: { type: Date },
    rejectionReason: { type: String, trim: true },
  },
  { timestamps: true }
);

leaveSchema.index({ employeeId: 1, status: 1 });
leaveSchema.index({ status: 1, startDate: -1 });

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
