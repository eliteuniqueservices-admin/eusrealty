import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String, required: true },
  performedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
  },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
