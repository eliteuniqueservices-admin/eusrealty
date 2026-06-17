import mongoose from 'mongoose';

const ConfigDetailSchema = new mongoose.Schema({
  type: { type: String },
  carpet: { type: String },
  price: { type: String }
}, { _id: false });

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  developer: { type: String },
  location: { type: String, required: true },
  rera: { type: String },
  possession: { type: String },
  status: { type: String },
  landParcel: { type: String },
  openSpace: { type: String },
  totalFloors: { type: String },
  floorBreakdown: { type: String },
  configurations: [{ type: String }],
  configDetails: [ConfigDetailSchema],
  description: { type: String },
  amenities: { type: String },
  usp: { type: String },
  launchYear: { type: String },
  images: [{ type: String }], // Optional for future image uploads
  propertyType: { type: String, default: 'Apartments' },
  isFeatured: { type: Boolean, default: false },
  isSignature: { type: Boolean, default: false },
  isMandate: { type: Boolean, default: false }
}, { timestamps: true });

PropertySchema.index({ location: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ isFeatured: 1, isSignature: 1, isMandate: 1 });
PropertySchema.index({ createdAt: -1 });

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);
