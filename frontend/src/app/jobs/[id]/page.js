"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  Building2,
  Loader2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user, userData } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Application Form States
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadJob = async () => {
      try {
        const data = await apiFetch(`/jobs/${id}`);
        setJob(data.job);
      } catch (err) {
        setError(err.message || "Job not found");
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const handleFileChange = (e) => {
    setApplyError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setApplyError("Please upload your resume in PDF format only.");
      setResumeFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setApplyError("Resume file size must be less than 5 MB.");
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError("");

    if (!resumeFile) {
      setApplyError("Please select your PDF resume before submitting.");
      return;
    }

    setApplying(true);
    try {
      // 1. Upload PDF to Firebase Storage
      const storageRef = ref(
        storage,
        `resumes/${user.uid}/${Date.now()}_${resumeFile.name}`
      );
      await uploadBytes(storageRef, resumeFile);
      const resumeUrl = await getDownloadURL(storageRef);

      // 2. Submit application to Express REST API
      await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({
          jobId: job.jobId,
          resumeUrl,
          coverLetter,
        }),
      });

      setAppliedSuccess(true);
      setResumeFile(null);
      setCoverLetter("");
    } catch (err) {
      setApplyError(err.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-2 text-slate-600">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-sm">Loading job details...</span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Job Not Found</h1>
        <p className="text-sm text-slate-600 mt-2">{error}</p>
        <Link
          href="/jobs"
          className="inline-block mt-5 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl"
        >
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Jobs
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span>{job.companyName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-slate-400" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {job.jobType}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Exp: {job.experience}
              </span>
            </div>
          </div>

          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start">
            {job.jobType}
          </span>
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="py-6 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="py-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 mb-3">Job Description</h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Apply Section */}
        <div className="pt-6">
          {!user ? (
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Sign in as Student to Apply
            </Link>
          ) : userData?.role !== "student" ? (
            <p className="text-xs text-slate-500">
              Logged in as <strong>{userData?.role}</strong>. Only Student accounts can apply for jobs.
            </p>
          ) : appliedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Application Submitted Successfully!</span>
              </div>
              <p className="text-sm">
                The recruiter has been notified and can now review your resume.
              </p>
              <Link
                href="/dashboard/student/applications"
                className="inline-block mt-2 text-sm font-semibold text-emerald-700 underline"
              >
                Track Application Status &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Apply for this Position</h2>

              {applyError && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{applyError}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Upload Resume (PDF only, max 5MB) *
                </label>
                <label className="flex items-center justify-center gap-2.5 px-4 py-4 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:border-blue-400 cursor-pointer transition">
                  <UploadCloud className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-slate-700 font-medium">
                    {resumeFile ? resumeFile.name : "Choose a PDF file..."}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cover Letter (Optional)
                </label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly explain why you're a great fit for this role..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={applying}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition"
              >
                {applying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading &amp; Applying...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}