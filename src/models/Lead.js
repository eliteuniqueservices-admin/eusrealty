import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: String, default: 'Admin' },
  addedAt: { type: Date, default: Date.now },
}, { _id: false });

const LeadSchema = new mongoose.Schema({
  // Core contact info
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },

  // Property interest
  budget: { type: String, default: '' },
  preferredLocation: { type: String, default: '' },
  propertyType: { type: String, default: '' },
  possession: { type: String, default: '' },

  // Lead intelligence
  leadScore: { type: Number, default: 0, min: 0, max: 100 },
  leadQuality: { 
    type: String, 
    enum: ['Cold', 'Warm', 'Hot'], 
    default: 'Cold' 
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Interested', 'Escalated', 'Converted', 'Lost'],
    default: 'New',
  },

  // Source tracking
  source: { 
    type: String, 
    enum: ['chatbot', 'contact_form', 'careers_page', 'manual', 'whatsapp'],
    default: 'chatbot',
  },
  sessionId: { type: String, default: '' },

  // Flags
  siteVisitRequested: { type: Boolean, default: false },
  callbackRequested: { type: Boolean, default: false },

  // Admin notes
  notes: [NoteSchema],

  // Assignment
  assignedTo: { type: String, default: '' },
}, { timestamps: true });

// Index for common queries
LeadSchema.index({ leadQuality: 1, status: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ phone: 1 });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
