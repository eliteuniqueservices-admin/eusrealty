import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  author: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String }
  },
  readTime: { type: Number },
  image: { type: String },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  faqs: [{
    q: { type: String },
    a: { type: String }
  }]
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
