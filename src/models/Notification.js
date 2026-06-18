import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['lead', 'escalation', 'hot_lead', 'system', 'loan_application', 'job_application'],
    default: 'lead',
  },
  isRead: { type: Boolean, default: false },
  relatedId: { type: String, default: '' }, // sessionId or leadId or applicationId
  relatedModel: { type: String, enum: ['ChatSession', 'Lead', 'LoanApplication', 'JobApplication', ''], default: '' },
  icon: { type: String, default: '🏠' },
}, { timestamps: true });

NotificationSchema.index({ isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
