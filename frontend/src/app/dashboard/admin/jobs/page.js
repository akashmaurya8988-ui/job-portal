"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { CheckCircle2, Ban } from "lucide-react";

export default function AdminJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadJobs = async () => {
      try {
        const data = await apiFetch("/admin/jobs");
        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch admin jobs:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [user]);

  const handleStatusChange = async (jobId, status) => {
    try {
      await apiFetch(`/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setJobs((prev) =>
        prev.map((j) => (j.jobId === jobId ? { ...j, status } : j))
      );
    } catch (err) {
      alert(err.message || "Failed to update job status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="admin" />

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">Moderate Jobs</h1>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Approve or remove job postings across JobConnect.
            </p>

            {loading ? (
              <p className="text-sm text-slate-500">Loading all jobs...</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.jobId}
                    className="p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {job.companyName} &bull; {job.location}
                      </p>
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 text-xs font-bold rounded-full capitalize ${
                          job.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(job.jobId, "approved")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(job.jobId, "removed")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
                      >
                        <Ban className="w-4 h-4" />
                        Remove
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