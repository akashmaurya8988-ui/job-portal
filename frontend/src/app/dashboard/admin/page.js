"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Users, GraduationCap, Briefcase, Building2, FileText, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadStats = async () => {
      try {
        const data = await apiFetch("/admin/dashboard");
        setStats(data.stats);
      } catch (err) {
        console.error("Admin stats error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [user]);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-600" },
    { label: "Students", value: stats?.totalStudents ?? 0, icon: GraduationCap, color: "text-emerald-600" },
    { label: "Recruiters", value: stats?.totalRecruiters ?? 0, icon: Briefcase, color: "text-purple-600" },
    { label: "Companies", value: stats?.totalCompanies ?? 0, icon: Building2, color: "text-amber-600" },
    { label: "Total Jobs", value: stats?.totalJobs ?? 0, icon: ShieldCheck, color: "text-indigo-600" },
    { label: "Applications", value: stats?.totalApplications ?? 0, icon: FileText, color: "text-rose-600" },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="admin" />

          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900">Admin Control Panel</h1>
              <p className="text-sm text-slate-600 mt-1">
                Monitor platform activity, manage users, and moderate job listings.
              </p>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading platform statistics...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.label}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          {card.label}
                        </span>
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <p className="text-3xl font-extrabold text-slate-900 mt-2">
                        {card.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/admin/users"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition"
              >
                <h2 className="text-base font-bold text-slate-900">Manage Users &rarr;</h2>
                <p className="text-xs text-slate-500 mt-1">
                  View all registered students and recruiters
                </p>
              </Link>
              <Link
                href="/dashboard/admin/jobs"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition"
              >
                <h2 className="text-base font-bold text-slate-900">Moderate Jobs &rarr;</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Approve or remove job postings across the platform
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}