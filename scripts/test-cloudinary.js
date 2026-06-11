import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary Connection...');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key: ${process.env.CLOUDINARY_API_KEY}`);
    
    const result = await cloudinary.api.ping();
    console.log('Success! Cloudinary is working:', result);
  } catch (error) {
    console.error('\nERROR: Failed to connect to Cloudinary.');
    console.error('Details:', error.error ? error.error.message : error.message);
    if (error.error && error.error.message.includes('Must supply cloud_name')) {
      console.log('Hint: Your cloud name is invalid or missing.');
    } else if (error.error && error.error.message.includes('Invalid Signature') || error.error?.message.includes('Unknown API key')) {
      console.log('Hint: Your API Key or API Secret is incorrect.');
    } else if (error.message.includes('Missing required parameter - cloud_name')) {
        console.log('Hint: Cloud name is completely missing.');
    }
  }
}

testCloudinary();
