import { ShieldCheck, Zap, Users } from "lucide-react";

export default function AboutPage() {
  const pillars = [
    {
      icon: Zap,
      title: "Fast & Frictionless Hiring",
      desc: "Students can apply with a single click using their saved PDF resume, while recruiters shortlist candidates effortlessly.",
    },
    {
      icon: ShieldCheck,
      title: "Verified & Secure",
      desc: "Every job posting and user role is protected by Firebase Authentication and strict server-side authorization.",
    },
    {
      icon: Users,
      title: "Built for Campuses & Startups",
      desc: "Designed specifically to bridge the gap between college graduates and fast-growing engineering teams.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          About <span className="text-blue-600">JobConnect</span>
        </h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          JobConnect is a modern full-stack recruitment platform built to make job discovery, resume management, and candidate shortlisting transparent and simple.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}