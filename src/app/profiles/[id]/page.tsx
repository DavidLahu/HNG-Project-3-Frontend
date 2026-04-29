"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { apiFetch } from "@/lib/api";
import { Profile } from "@/components/ProfileTable";

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<{ status: string; data: Profile }>(`/api/profiles/${id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const fields: { label: string; value: string }[] = profile
    ? [
        { label: "ID", value: profile.id },
        { label: "Name", value: profile.name },
        { label: "Gender", value: profile.gender },
        { label: "Gender Probability", value: `${(profile.gender_probability * 100).toFixed(1)}%` },
        { label: "Age", value: String(profile.age) },
        { label: "Age Group", value: profile.age_group },
        { label: "Country", value: profile.country_id },
        { label: "Country Probability", value: `${(profile.country_probability * 100).toFixed(1)}%` },
        { label: "Created At", value: new Date(profile.created_at).toLocaleString() },
      ]
    : [];

  return (
    <AuthenticatedLayout>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/profiles")}
          className="text-sm text-gray-400 hover:text-white mb-6 transition-colors flex items-center gap-1"
        >
          ← Back to Profiles
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">Profile Details</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : profile ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {fields.map((field, idx) => (
              <div
                key={field.label}
                className={`flex flex-col sm:flex-row sm:items-center px-6 py-4 ${
                  idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800/30"
                }`}
              >
                <span className="text-xs uppercase tracking-wider text-gray-500 sm:w-48 sm:flex-shrink-0 mb-1 sm:mb-0">
                  {field.label}
                </span>
                <span className="text-sm text-white">{field.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Profile not found.</div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
