"use client";

import { useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import ProfileTable, { ProfileListResponse } from "@/components/ProfileTable";
import Pagination from "@/components/Pagination";
import { apiFetch } from "@/lib/api";
import { Profile } from "@/components/ProfileTable";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent, searchPage = 1) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setPage(searchPage);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        page: String(searchPage),
        limit: "10",
      });
      const res = await apiFetch<ProfileListResponse>(
        `/api/profiles/search?${params.toString()}`
      );
      setResults(res.data ?? []);
      setTotal(res.total ?? 0);
      setTotalPages(res.total_pages ?? 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(undefined, newPage);
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Search Profiles</h1>
          <p className="text-gray-400 text-sm mt-1">
            Use natural language — e.g. &quot;young males from nigeria&quot; or &quot;female seniors&quot;
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, etc."
              className="flex-1 rounded-xl bg-gray-900 border border-gray-800 text-white px-5 py-3 text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : searched ? (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {total.toLocaleString()} result{total !== 1 ? "s" : ""} found
            </p>
            <ProfileTable profiles={results} />
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </>
        ) : null}
      </div>
    </AuthenticatedLayout>
  );
}
