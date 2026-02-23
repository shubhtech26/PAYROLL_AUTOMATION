import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
    department: {
      type: String,
      enum: ['Chemistry', 'Microbiology', 'Quality', 'Operations'],
      default: 'Operations',
    },
    position: { type: String, trim: true },
    employeeId: { type: String, unique: true, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    hireDate: { type: Date, default: Date.now },
    leaveBalance: {
      vacation: { type: Number, default: 12 },
      sick: { type: Number, default: 8 },
      personal: { type: Number, default: 5 },
      emergency: { type: Number, default: 3 },
    },
  },
  { timestamps: true }
);

employeeSchema.index({ email: 1 }, { unique: true });
employeeSchema.index({ employeeId: 1 }, { unique: true });
employeeSchema.index({ department: 1, status: 1 });

employeeSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

employeeSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`;
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
