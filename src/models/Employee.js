import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  mobile: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date },
  basicSalary: { type: Number, default: 0 },
  panNumber: { type: String, trim: true },
  aadhaarNumber: { type: String, trim: true },
  bankName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  ifscCode: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
