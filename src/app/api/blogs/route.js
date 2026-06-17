import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import BlogPost from '@/models/BlogPost';
import { logAdminAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function GET(req) {
  try {
    await dbConnect();
    // Parse query params to optionally filter by status
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const blogs = await BlogPost.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Failed to fetch blogs:', error.message);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export const POST = auth(async function POST(req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    
    // Automatically calculate reading time if not provided
    if (!data.readTime && data.content) {
      const wordsPerMinute = 200;
      const textLength = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      data.readTime = Math.ceil(textLength / wordsPerMinute) || 1;
    }

    const blog = await BlogPost.create(data);

    // Trigger cache revalidations on additions
    revalidatePath('/blog');
    revalidatePath('/');

    // Log the change
    await logAdminAction(req, 'Blog Created', `Blog post "${blog.title}" created.`);

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
});
