import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  type: { 
    type: String, 
    enum: ['Full Time', 'Part Time', 'Contract', 'Internship'], 
    default: 'Full Time' 
  },
  mode: { 
    type: String, 
    enum: ['On-site', 'Hybrid', 'Remote'], 
    default: 'On-site' 
  },
  experience: { type: String },
  skills: [{ type: String }],
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Closed'], 
    default: 'Active' 
  },
  deadline: { type: String } // Store as YYYY-MM-DD
}, { timestamps: true });

export default mongoose.models.JobPost || mongoose.model('JobPost', jobPostSchema);
