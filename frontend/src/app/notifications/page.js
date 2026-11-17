"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Bell, CheckCheck, Check } from "lucide-react";

export default function NotificationsPage() {
  const { user, userData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadNotifications = async () => {
      try {
        const data = await apiFetch("/notifications");
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar role={userData?.role || "student"} />

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
                <p className="text-sm text-slate-600 mt-1">
                  You have {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition self-start"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All as Read
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.notificationId}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                      notif.isRead
                        ? "bg-white border-slate-200"
                        : "bg-blue-50/60 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          notif.isRead ? "bg-slate-300" : "bg-blue-600"
                        }`}
                      />
                      <p className="text-sm text-slate-800 font-medium">{notif.message}</p>
                    </div>

                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notif.notificationId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shrink-0 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}