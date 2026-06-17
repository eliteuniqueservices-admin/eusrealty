import dbConnect from "@/lib/mongodb";
import JobPost from "@/models/JobPost";
import JobDetailPageClient from "@/components/JobDetailPageClient";
import { notFound } from "next/navigation";

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

export async function generateStaticParams() {
  try {
    await dbConnect();
    const jobs = await JobPost.find({ status: "Active" }).select("_id").lean();
    return jobs.map(job => ({ id: job._id.toString() }));
  } catch (error) {
    console.warn("Failed to generate static params for careers details:", error.message);
    // Return mock IDs to ensure static pre-rendering passes during build phase
    return [
      { id: "mockjob1" },
      { id: "mockjob2" },
      { id: "mockjob3" }
    ];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  let job = null;

  const mockJob = MOCK_JOBS.find(j => j._id === id);
  if (mockJob) {
    job = mockJob;
  } else {
    try {
      await dbConnect();
      job = await JobPost.findById(id).lean();
    } catch (error) {
      console.warn("Metadata DB fetch failed for job id:", id, error.message);
    }
  }

  if (!job) {
    return {
      title: "Career Opportunity | EUS Realty",
    };
  }

  return {
    title: `${job.title} - Careers | EUS Realty`,
    description: job.description,
    alternates: {
      canonical: `https://eusrealty.co.in/careers/${id}`,
    }
  };
}

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  let job = null;

  const mockJob = MOCK_JOBS.find(j => j._id === id);
  if (mockJob) {
    job = mockJob;
  } else {
    try {
      await dbConnect();
      const jobData = await JobPost.findById(id).lean();
      if (jobData) {
        job = {
          ...jobData,
          _id: jobData._id.toString(),
          createdAt: jobData.createdAt ? jobData.createdAt.toString() : null,
          updatedAt: jobData.updatedAt ? jobData.updatedAt.toString() : null,
        };
      }
    } catch (error) {
      console.warn("Database fetch failed for career details id:", id, error.message);
    }
  }

  if (!job) {
    notFound();
  }

  return <JobDetailPageClient job={job} />;
}
