"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { apiFetch } from "@/lib/api";
import { ProfileListResponse } from "@/components/ProfileTable";

export default function DashboardPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<ProfileListResponse>("/api/profiles?page=1&limit=1")
      .then((res) => setTotal(res.total ?? 0))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { href: "/profiles", label: "Browse Profiles", icon: "👥", desc: "View and filter all profiles" },
    { href: "/search", label: "Search", icon: "🔍", desc: "Natural language profile search" },
    { href: "/account", label: "Account", icon: "👤", desc: "Manage your account" },
  ];

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Welcome to Insighta Labs+ — your profile intelligence hub.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <div className="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-800 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-5" />
            <div className="relative">
              <span className="text-2xl">👥</span>
              <p className="text-sm text-gray-400 mt-3">Total Profiles</p>
              <p className="text-3xl font-bold text-white mt-1">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-gray-800 rounded animate-pulse" />
                ) : (
                  total?.toLocaleString() ?? "—"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl bg-gray-900 border border-gray-800 p-6 hover:border-indigo-500/50 transition-all"
            >
              <span className="text-2xl">{link.icon}</span>
              <h3 className="text-white font-semibold mt-3 group-hover:text-indigo-400 transition-colors">
                {link.label}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
