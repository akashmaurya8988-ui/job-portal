import Link from "next/link";
import { MapPin, Clock, IndianRupee, ArrowRight } from "lucide-react";

export default function JobCard({ job }) {
  const id = job.jobId || job.id;
  const initials =
    job.companyInitials ||
    (job.companyName ? job.companyName.slice(0, 2).toUpperCase() : "JC");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-100 shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{job.companyName}</p>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {job.title}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            {job.jobType}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            {job.salary}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {job.postedAt || "Recently"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {job.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">Exp: {job.experience}</span>
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}