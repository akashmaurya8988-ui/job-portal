"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import JobCard from "@/components/JobCard";
import { Search, MapPin, Filter, RotateCcw, Loader2, Briefcase } from "lucide-react";

function JobsContent() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (overrides = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const qVal = overrides.q !== undefined ? overrides.q : keyword;
      const locVal = overrides.location !== undefined ? overrides.location : location;
      const typeVal = overrides.jobType !== undefined ? overrides.jobType : jobType;
      const expVal = overrides.experience !== undefined ? overrides.experience : experience;

      if (qVal.trim()) params.set("q", qVal.trim());
      if (locVal.trim()) params.set("location", locVal.trim());
      if (typeVal) params.set("jobType", typeVal);
      if (expVal) params.set("experience", expVal);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/jobs${queryString}`);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to load jobs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    setJobType("");
    setExperience("");
    fetchJobs({ q: "", location: "", jobType: "", experience: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Search */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Find Your Next Role</h1>
        <p className="text-sm text-slate-600 mt-1">
          Search across verified openings by title, skills, location, or experience.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="mt-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3"
        >
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Title, skill, or company..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Exp</option>
              <option value="Fresher">Fresher</option>
              <option value="0-2 Years">0-2 Years</option>
              <option value="2-5 Years">2-5 Years</option>
              <option value="5+ Years">5+ Years</option>
            </select>
          </div>

          <div className="md:col-span-1 flex gap-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center"
              title="Apply Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </form>

        {(keyword || location || jobType || experience) && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-500 gap-2">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          <p className="text-sm">Searching live jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900">No matching jobs found</h2>
          <p className="text-sm text-slate-500 mt-1">
            Try clearing filters or searching a different keyword.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.jobId} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-slate-500">Loading jobs...</div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}