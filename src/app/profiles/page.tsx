"use client";

import { useEffect, useState, useCallback } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import ProfileTable, { Profile, ProfileListResponse } from "@/components/ProfileTable";
import Pagination from "@/components/Pagination";
import { apiFetch } from "@/lib/api";

const LIMIT = 10;

const genderOptions = ["", "male", "female"];
const ageGroupOptions = ["", "child", "teenager", "adult", "senior"];

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [gender, setGender] = useState("");
  const [countryId, setCountryId] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  const fetchProfiles = useCallback(() => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });
    if (gender) params.set("gender", gender);
    if (countryId) params.set("country_id", countryId);
    if (ageGroup) params.set("age_group", ageGroup);

    apiFetch<ProfileListResponse>(`/api/profiles?${params.toString()}`)
      .then((res) => {
        setProfiles(res.data ?? []);
        setTotal(res.total ?? 0);
        setTotalPages(res.total_pages ?? 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, gender, countryId, ageGroup]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleFilter = () => {
    setPage(1);
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Profiles</h1>
            <p className="text-gray-400 text-sm mt-1">
              {total.toLocaleString()} profiles in database
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {genderOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt || "All"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                Country
              </label>
              <input
                type="text"
                value={countryId}
                onChange={(e) => setCountryId(e.target.value.toUpperCase())}
                placeholder="e.g. NG, US, GH"
                maxLength={2}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                Age Group
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {ageGroupOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt ? opt.charAt(0).toUpperCase() + opt.slice(1) : "All"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <ProfileTable profiles={profiles} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
