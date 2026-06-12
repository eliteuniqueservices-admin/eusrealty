import mongoose from 'mongoose';

const LoanApplicationSchema = new mongoose.Schema({
  applicationNumber: { type: String, required: true, unique: true },
  
  // Step 1: Personal Details
  personalDetails: {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },

  // Step 2: Employment Information
  employment: {
    employmentType: { type: String, enum: ['Salaried', 'Self Employed Professional', 'Self Employed Business'], required: true },
    companyOrBusiness: { type: String, required: true },
    grossSalary: { type: Number },
    netSalary: { type: Number },
    annualIncome: { type: Number },
    experience: { type: Number },
    vintage: { type: Number }, // Business Vintage in years
    gstNumber: { type: String },
  },

  // Step 3: Existing Obligations
  obligations: {
    personalLoanEmi: { type: Number, default: 0 },
    carLoanEmi: { type: Number, default: 0 },
    creditCardEmi: { type: Number, default: 0 },
    otherEmi: { type: Number, default: 0 },
    totalExistingEmi: { type: Number, required: true, default: 0 },
  },

  // Step 4: Property Details
  property: {
    propertyType: { type: String, enum: ['Flat', 'Apartment', 'Villa', 'Plot + Construction', 'Resale Property'], required: true },
    propertyValue: { type: Number, required: true },
    location: { type: String, required: true },
    downPayment: { type: Number, required: true },
    loanRequirement: { type: Number, required: true }, // value - downPayment
  },

  // Step 5: Credit Information
  creditInfo: {
    creditScore: { type: Number, required: true },
    existingHomeLoan: { type: String, enum: ['Yes', 'No'], required: true },
    defaults: { type: String, enum: ['Yes', 'No'], required: true },
  },

  // Banking Engine Results
  calculatedMetrics: {
    foir: { type: Number, required: true },
    ltv: { type: Number, required: true },
    maxEligibleEmi: { type: Number, required: true },
    eligibleLoanAmount: { type: Number, required: true },
    suggestedEmi: { type: Number, required: true },
    riskLevel: { type: String, enum: ['Excellent', 'Good', 'Average', 'High Risk'], required: true },
  },

  eligibilityStatus: { 
    type: String, 
    enum: ['Eligible', 'Conditionally Eligible', 'Not Eligible'],
    required: true 
  },
  applicationStatus: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  internalRemarks: { type: String, default: '' },
}, { timestamps: true });

// Avoid schema overwrite in Next.js Hot Reloading
export default mongoose.models.LoanApplication || mongoose.model('LoanApplication', LoanApplicationSchema);
