"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Trash2, Users, PlusCircle, MapPin, Briefcase } from "lucide-react";

export default function ManageJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    if (!user?.uid) return;
    try {
      const data = await apiFetch(`/jobs?recruiterId=${user.uid}`);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [user]);

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await apiFetch(`/jobs/${jobId}`, { method: "DELETE" });
      setJobs(jobs.filter((j) => j.jobId !== jobId));
    } catch (err) {
      alert(err.message || "Failed to delete job");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="recruiter" />

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Manage Jobs</h1>
                <p className="text-sm text-slate-600 mt-1">
                  View applicants or remove your active job listings.
                </p>
              </div>
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Post Job
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading your job postings...</p>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">
                  You haven&apos;t posted any jobs yet.
                </p>
                <Link
                  href="/post-job"
                  className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.jobId}
                    className="p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition"
                  >
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span>{job.jobType}</span>
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/dashboard/recruiter/applicants/${job.jobId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition"
                      >
                        <Users className="w-4 h-4" />
                        Applicants
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.jobId)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}