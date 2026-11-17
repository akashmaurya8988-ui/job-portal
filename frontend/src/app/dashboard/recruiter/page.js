"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  Briefcase,
  Building2,
  PlusCircle,
  Save,
  CheckCircle2,
  Loader2,
  Users,
} from "lucide-react";

export default function RecruiterDashboardPage() {
  const { user, userData } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [companyDocId, setCompanyDocId] = useState("");
  const [company, setCompany] = useState({
    companyName: "",
    location: "",
    website: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const loadRecruiterData = async () => {
      try {
        // 1. Fetch recruiter's jobs from Express API
        const jobsData = await apiFetch(`/jobs?recruiterId=${user.uid}`);
        setJobs(jobsData.jobs || []);

        // 2. Fetch recruiter's company profile from Firestore
        const q = query(
          collection(db, "companies"),
          where("recruiterId", "==", user.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docSnap = snap.docs[0];
          setCompanyDocId(docSnap.id);
          const data = docSnap.data();
          setCompany({
            companyName: data.companyName || "",
            location: data.location || "",
            website: data.website || "",
            description: data.description || "",
          });
        }
      } catch (err) {
        console.error("Failed to load recruiter data:", err);
      }
    };

    loadRecruiterData();
  }, [user]);

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    if (!companyDocId) return;
    setSaving(true);
    setMessage("");
    try {
      await updateDoc(doc(db, "companies", companyDocId), {
        companyName: company.companyName.trim(),
        location: company.location.trim(),
        website: company.website.trim(),
        description: company.description.trim(),
      });
      setMessage("Company profile updated successfully!");
    } catch (err) {
      console.error("Error updating company:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="recruiter" />

          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Recruiter Dashboard
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome back, {userData?.fullName || "Recruiter"}! Manage your company &amp; job postings.
                </p>
              </div>
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Post a New Job
              </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Active Jobs
                  </span>
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">
                  {jobs.filter((j) => j.status === "approved").length}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Total Posted
                  </span>
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{jobs.length}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Company
                  </span>
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-base font-bold text-slate-900 mt-2 truncate">
                  {company.companyName || "Not Set"}
                </p>
              </div>
            </div>

            {/* Company Profile Editor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Company Profile</h2>
              <p className="text-xs text-slate-500 mb-5">
                Students see these details when viewing your job openings.
              </p>

              {message && (
                <div className="mb-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={company.companyName}
                      onChange={(e) =>
                        setCompany({ ...company, companyName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Headquarters Location
                    </label>
                    <input
                      type="text"
                      value={company.location}
                      onChange={(e) =>
                        setCompany({ ...company, location: e.target.value })
                      }
                      placeholder="Bengaluru, India"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={company.website}
                    onChange={(e) =>
                      setCompany({ ...company, website: e.target.value })
                    }
                    placeholder="https://technova.in"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Description
                  </label>
                  <textarea
                    rows={3}
                    value={company.description}
                    onChange={(e) =>
                      setCompany({ ...company, description: e.target.value })
                    }
                    placeholder="Briefly describe your company and culture..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Company Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}