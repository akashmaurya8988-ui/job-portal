"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { apiFetch } from "@/lib/api";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";

export default function JobApplicantsPage() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    const fetchApplicants = async () => {
      try {
        const data = await apiFetch(`/applications/job/${jobId}`);
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applicants:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await apiFetch(`/applications/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="recruiter" />

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <Link
              href="/dashboard/recruiter/manage-jobs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Manage Jobs
            </Link>

            <h1 className="text-2xl font-extrabold text-slate-900">Job Applicants</h1>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Review resumes and shortlist or reject candidates.
            </p>

            {loading ? (
              <p className="text-sm text-slate-500">Loading applicants...</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-600">No applications received for this job yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="p-5 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          {app.studentName || "Candidate"}
                        </h2>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3.5 h-3.5" />
                          {app.studentEmail}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-bold rounded-full capitalize bg-slate-100 text-slate-700 self-start">
                        Status: {app.status}
                      </span>
                    </div>

                    {app.coverLetter && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {app.coverLetter}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Resume
                      </a>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.applicationId, "shortlisted")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Shortlist
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.applicationId, "rejected")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
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