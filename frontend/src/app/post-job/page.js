"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { PlusCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [companyId, setCompanyId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    salary: "",
    jobType: "Full-Time",
    experience: "Fresher",
    skillsText: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    const fetchCompany = async () => {
      try {
        const q = query(
          collection(db, "companies"),
          where("recruiterId", "==", user.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docSnap = snap.docs[0];
          setCompanyId(docSnap.id);
          setFormData((prev) => ({
            ...prev,
            companyName: docSnap.data().companyName || "",
            location: docSnap.data().location || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load company:", err);
      }
    };
    fetchCompany();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.location.trim() || !formData.salary.trim() || !formData.description.trim()) {
      setError("Please fill in all required job fields.");
      return;
    }

    setLoading(true);
    try {
      const skills = formData.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await apiFetch("/jobs", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          companyId,
          companyName: formData.companyName || "Hiring Company",
          location: formData.location,
          salary: formData.salary,
          jobType: formData.jobType,
          experience: formData.experience,
          skills,
          description: formData.description,
        }),
      });

      router.push("/dashboard/recruiter/manage-jobs");
    } catch (err) {
      setError(err.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="recruiter" />

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">Post a New Job</h1>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Publish a job opening to reach thousands of qualified candidates.
            </p>

            {error && (
              <div className="mb-5 flex items-center gap-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Frontend Next.js Developer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="TechNova Systems"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bengaluru (Hybrid) or Remote"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Salary / Stipend *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="₹8 - ₹14 LPA"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Experience Required
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="0-2 Years">0-2 Years</option>
                    <option value="2-5 Years">2-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsText}
                  onChange={(e) =>
                    setFormData({ ...formData, skillsText: e.target.value })
                  }
                  placeholder="React, Next.js, Tailwind CSS, Node.js"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe responsibilities, qualifications, and perks..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing Job...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Publish Job
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}