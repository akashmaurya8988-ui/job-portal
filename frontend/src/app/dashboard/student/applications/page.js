"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { FileText, ExternalLink } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  reviewed: "bg-blue-50 text-blue-700 border-blue-200",
  shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchApps = async () => {
      try {
        const data = await apiFetch("/applications/my");
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="student" />

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">My Applications</h1>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Track the real-time status of all jobs you have applied to.
            </p>

            {loading ? (
              <p className="text-sm text-slate-500">Loading your applications...</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">No applications found yet.</p>
                <Link
                  href="/jobs"
                  className="inline-block mt-3 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                  Find Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-200 transition"
                  >
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{app.jobTitle}</h2>
                      <p className="text-sm text-slate-600">{app.companyName}</p>
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline mt-2"
                        >
                          View Submitted Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border capitalize self-start sm:self-center ${
                        statusStyles[app.status] || statusStyles.pending
                      }`}
                    >
                      {app.status}
                    </span>
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