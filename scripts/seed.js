// Seed script: Creates test users and initial mock data for all modules
// Run: node scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// 1. Schemas Definition (Self-contained for Node compatibility)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const JobPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  type: { type: String, enum: ['Full Time', 'Part Time', 'Contract', 'Internship'], default: 'Full Time' },
  mode: { type: String, enum: ['On-site', 'Hybrid', 'Remote'], default: 'On-site' },
  experience: { type: String },
  skills: [{ type: String }],
  description: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  deadline: { type: String }
}, { timestamps: true });

const JobPost = mongoose.models.JobPost || mongoose.model('JobPost', JobPostSchema);

// 2. Seed Data
const users = [
  { name: 'Admin User', email: 'admin@eusrealty.com', password: 'Admin@123', role: 'admin' },
];

const jobs = [
  { 
    title: "Relationship Manager", department: "Sales", location: "Wakad, Pune", 
    salary: "₹8L Base + 20% Commission", type: "Full Time", mode: "On-site", experience: "Mid-Level (3-5 Yrs)",
    status: "Active", skills: ["B2B Sales", "Negotiation", "Real Estate"], 
    description: "Looking for an experienced closer to manage premium client portfolios and drive site visits for grade-A builder projects.",
    deadline: "2026-07-31"
  },
  { 
    title: "Digital Marketing Executive", department: "Growth", location: "Tathawade, Pune", 
    salary: "₹6L Fixed + Performance", type: "Full Time", mode: "Hybrid", experience: "Junior (1-3 Yrs)",
    status: "Active", skills: ["SEO", "Meta Ads", "Google Analytics"], 
    description: "Lead digital marketing lead generation campaigns across Meta ads, Google ads, and SEO optimization projects.",
    deadline: "2026-08-15"
  },
  { 
    title: "Sourcing Manager", department: "Inventory", location: "West Pune", 
    salary: "₹10L + High Incentives", type: "Full Time", mode: "On-site", experience: "Senior (5-8 Yrs)",
    status: "Active", skills: ["Builder Relations", "Real Estate Market", "Procurement"], 
    description: "Manage exclusive builder mandates, inventory allocations, and builder relationship programs in Hinjewadi/Balewadi.",
    deadline: "2026-07-15"
  },
  { 
    title: "Customer Success Associate", department: "CRM", location: "Hinjewadi, Pune", 
    salary: "₹5L Fixed", type: "Full Time", mode: "Remote", experience: "Fresher (0-1 Yrs)",
    status: "Closed", skills: ["Communication", "CRM", "Problem Solving"], 
    description: "Manage post-sales client onboarding, property registration paperwork, and CRM pipeline database tracking.",
    deadline: "2026-05-30"
  }
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  // Seed Users
  console.log('\n--- Seeding Users ---');
  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`✓ User exists: ${u.email}`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`✓ Created user: ${u.email}`);
  }

  // Seed Job Posts
  console.log('\n--- Seeding Job Postings ---');
  const existingJobsCount = await JobPost.countDocuments();
  if (existingJobsCount === 0) {
    await JobPost.insertMany(jobs);
    console.log(`✓ Seeded ${jobs.length} job posts`);
  } else {
    console.log(`✓ ${existingJobsCount} job posts already exist`);
  }

  console.log('\n✅ Database Seed Complete!');
  console.log('Use credentials to log in:');
  console.log('   admin@eusrealty.com  / Admin@123    (Admin)');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
