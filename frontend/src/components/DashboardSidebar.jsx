"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  PlusCircle,
  Bell,
  Users,
  ShieldCheck,
} from "lucide-react";

export default function DashboardSidebar({ role = "student" }) {
  const pathname = usePathname();

  const menus = {
    student: [
      { name: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
      { name: "My Profile", href: "/dashboard/student/profile", icon: User },
      { name: "My Applications", href: "/dashboard/student/applications", icon: FileText },
      { name: "Browse Jobs", href: "/jobs", icon: Briefcase },
      { name: "Notifications", href: "/notifications", icon: Bell },
    ],
    recruiter: [
      { name: "Overview", href: "/dashboard/recruiter", icon: LayoutDashboard },
      { name: "Post a Job", href: "/post-job", icon: PlusCircle },
      { name: "Manage Jobs", href: "/dashboard/recruiter/manage-jobs", icon: Briefcase },
      { name: "Notifications", href: "/notifications", icon: Bell },
    ],
    admin: [
      { name: "Admin Overview", href: "/dashboard/admin", icon: ShieldCheck },
      { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Manage Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
    ],
  };

  const links = menus[role] || menus.student;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          {role} Menu
        </p>
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}