"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { FileText, CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";

export default function StudentDashboardPage() {
  const { user, userData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadApps = async () => {
      try {
        const data = await apiFetch("/applications/my");
        setApplications(data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, [user]);

  const totalApplied = applications.length;
  const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
  const pending = applications.filter((a) => a.status === "pending").length;
  const skillsCount = userData?.skills?.length || 0;

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="student" />

          <div className="flex-1 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Welcome, {userData?.fullName || "Student"}!
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Track your job applications and keep your profile updated for recruiters.
                </p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
              >
                Browse Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Applied</span>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalApplied}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Shortlisted</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{shortlisted}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Pending</span>
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{pending}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Skills Added</span>
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{skillsCount}</p>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
                <Link
                  href="/dashboard/student/applications"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500">Loading applications...</p>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-600">You haven&apos;t applied to any jobs yet.</p>
                  <Link
                    href="/jobs"
                    className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Explore Open Positions &rarr;
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.applicationId} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{app.jobTitle}</p>
                        <p className="text-xs text-slate-500">{app.companyName}</p>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full capitalize bg-blue-50 text-blue-700">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}