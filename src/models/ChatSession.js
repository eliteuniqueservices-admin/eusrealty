import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  matches: { type: Array, default: [] }
}, { _id: false });

const LeadDataSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  budget: { type: String, default: '' },
  preferredLocation: { type: String, default: '' },
  propertyType: { type: String, default: '' },
  possession: { type: String, default: '' },
  siteVisitRequested: { type: Boolean, default: false },
  callbackRequested: { type: Boolean, default: false },
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  messages: [MessageSchema],
  leadData: { type: LeadDataSchema, default: () => ({}) },
  leadScore: { type: Number, default: 0, min: 0, max: 100 },
  leadQuality: { 
    type: String, 
    enum: ['Cold', 'Warm', 'Hot'], 
    default: 'Cold' 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Escalated', 'Closed'], 
    default: 'Active' 
  },
  source: { type: String, default: 'chatbot' },
  userAgent: { type: String },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
  telegramMessageMappings: [{
    chatId: { type: Number },
    messageId: { type: Number }
  }]
}, { timestamps: true });

export default mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);
