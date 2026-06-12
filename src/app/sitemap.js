import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';

export default async function sitemap() {
  const baseUrl = 'https://eusrealty.com';

  // Base static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/properties',
    '/careers',
    '/home-loans',
    '/calculator',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
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
    console.error('Sitemap generation database error:', error);
  }

  return [...staticRoutes, ...propertyRoutes];
}
