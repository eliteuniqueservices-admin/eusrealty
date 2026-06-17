import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/auth';

// Configure Cloudinary if keys are present
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const POST = auth(async function POST(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Validate File Size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 5MB limit.' }, { status: 400 });
    }

    // 2. Validate MIME Type
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PNG, JPEG, JPG, WEBP, and AVIF images are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (hasCloudinary) {
      // Upload to Cloudinary using a Promise wrapper
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'eusrealty' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      return NextResponse.json({ url: uploadResult.secure_url });
    } else {
      // Fallback: Upload locally to public/uploads
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      
      const fileUrl = `/uploads/${fileName}`;
      return NextResponse.json({ url: fileUrl });
    }
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
});
