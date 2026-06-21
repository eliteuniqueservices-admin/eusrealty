import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import JobPost from '@/models/JobPost';
import BlogPost from '@/models/BlogPost';
import { seoLandingPages, builderPages, comparisonPages } from '@/lib/seoData';
import { TOP_CALCULATORS, SQM_TO_OTHERS, LENGTH_CONVERSIONS } from '@/lib/converters';
import { getPropertySlug } from '@/lib/propertyUrls';

export default async function sitemap() {
  const baseUrl = 'https://eusrealty.co.in';

  // 1. Base static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/properties',
    '/careers',
    '/home-loans',
    '/calculator',
    '/blog',
    '/pune-real-estate', // City Data Hub
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : route === '/pune-real-estate' ? 0.9 : 0.8,
  }));

  // 2. Locality guides routes (8 localities)
  const localities = ['baner', 'wakad', 'hinjawadi', 'tathawade', 'aundh', 'balewadi', 'pimpri', 'chinchwad'];
  const localityRoutes = localities.map((slug) => ({
    url: `${baseUrl}/localities/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Locality properties landing pages
  const localityPropertyRoutes = localities.map((slug) => ({
    url: `${baseUrl}/properties/location/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 4. Programmatic SEO landing pages (BHK, budget, status, etc.)
  const programmaticRoutes = Object.keys(seoLandingPages).map((slug) => ({
    url: `${baseUrl}/properties/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 4.5. Combinatorial Programmatic SEO routes (Catch-All)
  const localitiesList = ['baner', 'wakad', 'hinjawadi', 'tathawade', 'aundh', 'balewadi', 'pimpri', 'chinchwad', 'pune'];
  const bhksList = ['1-bhk', '2-bhk', '3-bhk', '4-bhk', '5-bhk'];
  const typesList = ['flats', 'villas', 'projects'];
  const budgetsList = ['', 'under-50-lakhs-', 'under-1-cr-', 'under-2-cr-'];
  
  const combinatorialRoutes = [];
  localitiesList.forEach(loc => {
    bhksList.forEach(bhk => {
      typesList.forEach(type => {
        budgetsList.forEach(budget => {
          // Avoid weird grammar like 1-bhk-villas
          if (bhk === '1-bhk' && type === 'villas') return;
          
          combinatorialRoutes.push({
            url: `${baseUrl}/properties/search/${bhk}-${type}-${budget}in-${loc}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      });
    });
  });

  // 5. Builder/Developer pages
  const builderRoutes = Object.keys(builderPages).map((slug) => ({
    url: `${baseUrl}/builders/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // 6. Comparison pages
  const comparisonRoutes = Object.keys(comparisonPages).map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // 7. Base Calculator pages
  const baseCalculatorRoutes = [
    '/calculator/emi',
    '/calculator/affordability',
    '/calculator/eligibility',
    '/calculator/rent-value',
    '/calculator/valuation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 8. Unit Converter pages (combining top, sqm, and length converters)
  const allConversions = [...TOP_CALCULATORS, ...SQM_TO_OTHERS, ...LENGTH_CONVERSIONS];
  const uniqueConverterSlugs = new Set(allConversions.map(item => `${item.from}-to-${item.to}`));
  
  const converterRoutes = Array.from(uniqueConverterSlugs).map((slug) => ({
    url: `${baseUrl}/calculator/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  // 9. Dynamic property details pages (using clean SEO slugs)
  let propertyRoutes = [];
  try {
    await dbConnect();
    const dbProperties = await Property.find({}).lean();
    propertyRoutes = dbProperties.map((prop) => ({
      url: `${baseUrl}/properties/${getPropertySlug(prop)}`,
      lastModified: prop.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap generation properties database error:', error);
  }

  // 10. Dynamic career details pages
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

  // 11. Dynamic blog post pages
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

  return [
    ...staticRoutes,
    ...localityRoutes,
    ...localityPropertyRoutes,
    ...programmaticRoutes,
    ...combinatorialRoutes,
    ...builderRoutes,
    ...comparisonRoutes,
    ...baseCalculatorRoutes,
    ...converterRoutes,
    ...propertyRoutes,
    ...careerRoutes,
    ...blogRoutes,
  ];
}
