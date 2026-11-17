"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadUsers = async () => {
      try {
        const data = await apiFetch("/admin/users");
        setUsers(data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [user]);

  const filteredUsers =
    filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role="admin" />

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Manage Users</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Total {filteredUsers.length} users shown
                </p>
              </div>
              <div className="flex gap-2">
                {["all", "student", "recruiter", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilterRole(r)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                      filterRole === r
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">Phone</th>
                      <th className="py-3">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid}>
                        <td className="py-3 pr-4 font-semibold text-slate-900">
                          {u.fullName || "User"}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{u.email}</td>
                        <td className="py-3 pr-4 text-slate-500">{u.phone || "-"}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full capitalize bg-blue-50 text-blue-700">
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}