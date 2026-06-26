import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: String, default: 'Admin' },
  addedAt: { type: Date, default: Date.now },
}, { _id: false });

const FollowUpSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['call', 'email', 'whatsapp', 'site_visit', 'meeting'],
    required: true,
  },
  scheduledAt: { type: Date, required: true },
  completedAt: { type: Date, default: null },
  outcome: { type: String, default: '' },
  notes: { type: String, default: '' },
  addedBy: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
});

const PropertySentSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  propertyName: { type: String, default: '' },
  channel: { type: String, enum: ['whatsapp', 'email'], default: 'whatsapp' },
  sentAt: { type: Date, default: Date.now },
  sentBy: { type: String, default: 'Admin' },
}, { _id: false });

const LeadSchema = new mongoose.Schema({
  // Core contact info
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  telegramUsername: { type: String, default: '' },

  // Property interest
  budget: { type: String, default: '' },
  preferredLocation: { type: String, default: '' },
  propertyType: { type: String, default: '' },
  possession: { type: String, default: '' },
  objective: { type: String, default: '' },
  position: { type: String, default: '' },

  // Handover & Context details
  conversationSummary: { type: String, default: '' },
  reasonForEscalation: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', ''], default: '' },
  requiredAction: { type: String, default: '' },

  // Lead intelligence
  leadScore: { type: Number, default: 0, min: 0, max: 100 },
  leadQuality: { 
    type: String, 
    enum: ['Cold', 'Warm', 'Hot'], 
    default: 'Cold' 
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Interested', 'Escalated', 'Converted', 'Lost', 'Waiting for Sales Consultant'],
    default: 'New',
  },

  // Source tracking
  source: { 
    type: String, 
    enum: ['chatbot', 'contact_form', 'careers_page', 'manual', 'whatsapp', 'homepage', 'exit_popup'],
    default: 'chatbot',
  },
  sessionId: { type: String, default: '' },

  // Flags
  siteVisitRequested: { type: Boolean, default: false },
  callbackRequested: { type: Boolean, default: false },

  // Admin notes
  notes: [NoteSchema],

  // Follow-up CRM
  followUps: [FollowUpSchema],
  nextFollowUp: { type: Date, default: null },
  lastContactedAt: { type: Date, default: null },
  propertiesSent: [PropertySentSchema],

  // Assignment
  assignedTo: { type: String, default: '' },
}, { timestamps: true });

// Index for common queries
LeadSchema.index({ leadQuality: 1, status: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ nextFollowUp: 1 });
LeadSchema.index({ lastContactedAt: 1 });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
