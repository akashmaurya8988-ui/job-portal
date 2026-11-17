"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">
                Job<span className="text-blue-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting talented students and professionals with top hiring companies across India.
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Candidates
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Create Student Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student" className="hover:text-white transition">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Recruiters
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/post-job" className="hover:text-white transition">
                  Post a Vacancy
                </Link>
              </li>
              <li>
                <Link href="/dashboard/recruiter" className="hover:text-white transition">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About JobConnect
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@jobconnect.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Bengaluru, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {year} JobConnect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}