import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { auth } from '@/auth';
import { logAdminAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export const PUT = auth(async function PUT(req, { params }) {
  try {
    if (!req.auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    const data = await req.json();

    // Automatically recalculate reading time if content is updated
    if (data.content) {
      const wordsPerMinute = 200;
      const textLength = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      data.readTime = Math.ceil(textLength / wordsPerMinute) || 1;
    }

    const blog = await BlogPost.findByIdAndUpdate(id, data, { new: true });
    
    if (!blog) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    
    // Trigger cache revalidation
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath('/');

    await logAdminAction(req, 'Blog Updated', `Blog post "${blog.title}" (ID: ${id}) updated.`);
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
});

export const DELETE = auth(async function DELETE(req, { params }) {
  try {
    if (!req.auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    const blog = await BlogPost.findByIdAndDelete(id);
    
    if (!blog) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    
    // Trigger cache revalidation
    revalidatePath('/blog');
    revalidatePath(`/blog/${blog.slug}`);
    revalidatePath('/');

    await logAdminAction(req, 'Blog Deleted', `Blog post "${blog.title}" (ID: ${id}) deleted.`);
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
});
