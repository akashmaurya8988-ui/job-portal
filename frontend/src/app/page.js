"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Building2, ArrowRight, Sparkles } from "lucide-react";
import { categories, featuredCompanies, latestJobs } from "@/data/mockJobs";
import CategoryCard from "@/components/CategoryCard";
import JobCard from "@/components/JobCard";

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Over 3,500+ Active Tech &amp; Corporate Roles</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Find Your Next{" "}
            <span className="text-blue-600">Dream Career</span> Faster
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            JobConnect connects ambitious students and professionals with verified recruiters. Build your profile, upload your PDF resume, and apply in one click.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-3xl mx-auto bg-white p-2.5 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skill, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="City or Remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
            >
              Search Jobs
            </button>
          </form>

          {/* Quick Stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
            <div>
              <span className="font-bold text-slate-900 text-lg">1,200+</span> Companies
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg">15,000+</span> Students Placed
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg">100%</span> Verified Listings
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-sm text-slate-600 mt-1">
              Browse roles tailored to your specialization
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Latest Job Openings</h2>
              <p className="text-sm text-slate-600 mt-1">
                Fresh opportunities posted by top employers
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Featured Hiring Companies</h2>
          <p className="text-sm text-slate-600 mt-1">
            Trusted teams actively recruiting on JobConnect
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div
                className={`w-12 h-12 rounded-xl font-bold flex items-center justify-center mb-4 ${company.badgeColor}`}
              >
                {company.initials}
              </div>
              <h3 className="text-base font-bold text-slate-900">{company.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {company.industry}
              </p>
              <p className="text-xs text-slate-500 mt-1">{company.location}</p>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link
                  href={`/jobs?q=${encodeURIComponent(company.name)}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {company.openJobs} Open Positions &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to take the next step?
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl">
              Whether you are a student looking for your first break or a recruiter hiring top talent, JobConnect gets you started in minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/register"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition"
            >
              Create Account
            </Link>
            <Link
              href="/post-job"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}