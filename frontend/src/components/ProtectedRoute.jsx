"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (
        allowedRoles.length > 0 &&
        userData &&
        !allowedRoles.includes(userData.role)
      ) {
        // User ko uske apne role ke dashboard par redirect karein
        if (userData.role === "admin") router.push("/dashboard/admin");
        else if (userData.role === "recruiter") router.push("/dashboard/recruiter");
        else router.push("/dashboard/student");
      }
    }
  }, [user, userData, loading, allowedRoles, router]);

  if (loading || !user || (allowedRoles.length > 0 && !userData)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-600">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading your workspace...</p>
      </div>
    );
  }

  return <>{children}</>;
}