import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'], 
    default: 'New' 
  },
  education: { type: String, default: 'Not specified' }
}, { timestamps: true });

export default mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);
