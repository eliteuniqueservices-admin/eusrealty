import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import JobPost from '@/models/JobPost';
import BlogPost from '@/models/BlogPost';

export default async function sitemap() {
  const baseUrl = 'https://eusrealty.co.in';

  // Base static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/properties',
    '/careers',
    '/home-loans',
    '/calculator',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : route === '/blog' ? 0.85 : 0.8,
  }));

  // Locality guides routes
  const localities = ['baner', 'wakad', 'hinjawadi', 'tathawade', 'aundh', 'balewadi', 'pimpri', 'chinchwad'];
  const localityRoutes = localities.map((slug) => ({
    url: `${baseUrl}/localities/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Locality properties landing pages
  const localityPropertyRoutes = localities.map((slug) => ({
    url: `${baseUrl}/properties/location/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Dynamic property details pages
  let propertyRoutes = [];
  try {
    await dbConnect();
    const properties = await Property.find({}).select('_id updatedAt').lean();
    propertyRoutes = properties.map((prop) => ({
      url: `${baseUrl}/properties/${prop._id?.toString()}`,
      lastModified: prop.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap generation properties database error:', error);
  }

  // Dynamic career details pages
  let careerRoutes = [];
  try {
    await dbConnect();
    const jobs = await JobPost.find({ status: 'Active' }).select('_id updatedAt').lean();
    careerRoutes = jobs.map((job) => ({
      url: `${baseUrl}/careers/${job._id?.toString()}`,
      lastModified: job.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap generation jobs database error:', error);
  }

  // Dynamic blog post pages
  let blogRoutes = [];
  try {
    await dbConnect();
    const blogs = await BlogPost.find({ status: 'Published' }).select('slug updatedAt').lean();
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    }));
  } catch (error) {
    console.error('Sitemap generation blogs database error:', error);
  }

  return [...staticRoutes, ...localityRoutes, ...localityPropertyRoutes, ...propertyRoutes, ...careerRoutes, ...blogRoutes];
}
