"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  github_id?: string;
  username: string;
  email: string;
  avatar_url: string;
  role: "admin" | "analyst";
  is_active?: boolean;
  last_login_at?: string;
  created_at?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    apiFetch<{ status: string; user: User }>("/auth/me")
      .then((res) => setUser(res.user))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiFetch("/auth/logout-web", { method: "POST" });
    } catch {
      // Even if logout fails, redirect to login
    }
    router.push("/");
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Account</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gray-800 animate-pulse" />
              <div className="space-y-2">
                <div className="w-40 h-5 bg-gray-800 rounded animate-pulse" />
                <div className="w-56 h-4 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            {/* Avatar + name */}
            <div className="flex items-center gap-5 mb-8">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-white">{user.username}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                  user.role === "admin"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-indigo-500/10 text-indigo-400"
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">User ID</span>
                <span className="text-sm text-white font-mono text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Username</span>
                <span className="text-sm text-white">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Role</span>
                <span className="text-sm text-white capitalize">{user.role}</span>
              </div>
              {user.last_login_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Login</span>
                  <span className="text-sm text-white">
                    {new Date(user.last_login_at).toLocaleString()}
                  </span>
                </div>
              )}
              {user.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Account Created</span>
                  <span className="text-sm text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-800 mt-8 pt-6">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {loggingOut ? "Logging out…" : "Log Out"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Unable to load user information.
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
