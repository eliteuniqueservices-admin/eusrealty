import dbConnect from "@/lib/mongodb";
import JobPost from "@/models/JobPost";
import CareersPageClient from "@/components/CareersPageClient";

export const revalidate = 3600; // Revalidate page cache every hour

export const metadata = {
  title: "Careers & Open Positions | EUS Realty",
  description: "Join Pune's premier real estate consultancy. Explore lucrative career opportunities, direct builder mandates, and high performance commissions in West Pune.",
  alternates: {
    canonical: "https://eusrealty.co.in/careers",
  }
};

const MOCK_JOBS = [
  {
    _id: "mockjob1",
    title: "Relationship Manager",
    department: "Sales",
    location: "Wakad, Pune",
    salary: "₹8L Base + 20% Commission",
    type: "Full Time",
    mode: "On-site",
    experience: "Mid-Level (3-5 Yrs)",
    skills: ["B2B Sales", "Negotiation", "Real Estate"],
    description: "Looking for an experienced closer to manage premium client portfolios and drive site visits for grade-A builder projects.",
    status: "Active",
    deadline: "2026-07-31"
  },
  {
    _id: "mockjob2",
    title: "Digital Marketing Executive",
    department: "Growth",
    location: "Tathawade, Pune",
    salary: "₹6L Fixed + Performance",
    type: "Full Time",
    mode: "Hybrid",
    experience: "Junior (1-3 Yrs)",
    skills: ["SEO", "Meta Ads", "Google Analytics"],
    description: "Lead digital marketing lead generation campaigns across Meta ads, Google ads, and SEO optimization projects.",
    status: "Active",
    deadline: "2026-08-15"
  },
  {
    _id: "mockjob3",
    title: "Sourcing Manager",
    department: "Inventory",
    location: "West Pune",
    salary: "₹10L + High Incentives",
    type: "Full Time",
    mode: "On-site",
    experience: "Senior (5-8 Yrs)",
    skills: ["Builder Relations", "Real Estate Market", "Procurement"],
    description: "Manage exclusive builder mandates, inventory allocations, and builder relationship programs in Hinjewadi/Balewadi.",
    status: "Active",
    deadline: "2026-07-15"
  }
];

export default async function CareersPage() {
  let jobs = [];

  try {
    await dbConnect();
    const jobsData = await JobPost.find({ status: "Active" }).sort({ createdAt: -1 }).lean();
    
    // Serialize objects for client components
    jobs = jobsData.map(job => ({
      ...job,
      _id: job._id.toString(),
      createdAt: job.createdAt ? job.createdAt.toString() : null,
      updatedAt: job.updatedAt ? job.updatedAt.toString() : null,
    }));
  } catch (error) {
    console.warn("Careers page database fetch failed. Falling back to MOCK_JOBS.", error.message);
    jobs = MOCK_JOBS;
  }

  return <CareersPageClient initialJobPosts={jobs} />;
}