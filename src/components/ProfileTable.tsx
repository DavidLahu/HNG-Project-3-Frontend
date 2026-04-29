"use client";

import Link from "next/link";

export interface Profile {
  id: string;
  name: string;
  gender: "male" | "female";
  gender_probability: number;
  age: number;
  age_group: "child" | "teenager" | "adult" | "senior";
  country_id: string;
  country_probability: number;
  created_at: string;
}

export interface ProfileListResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  data: Profile[];
}

interface ProfileTableProps {
  profiles: Profile[];
}

export default function ProfileTable({ profiles }: ProfileTableProps) {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No profiles found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-800/50 text-gray-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Gender</th>
            <th className="px-5 py-3">Age</th>
            <th className="px-5 py-3">Age Group</th>
            <th className="px-5 py-3">Country</th>
            <th className="px-5 py-3">Created</th>
            <th className="px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {profiles.map((p) => (
            <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
              <td className="px-5 py-3 text-white font-medium">{p.name}</td>
              <td className="px-5 py-3 text-gray-400 capitalize">{p.gender}</td>
              <td className="px-5 py-3 text-gray-400">{p.age}</td>
              <td className="px-5 py-3 text-gray-400 capitalize">{p.age_group}</td>
              <td className="px-5 py-3 text-gray-400">{p.country_id}</td>
              <td className="px-5 py-3 text-gray-400">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
              <td className="px-5 py-3">
                <Link
                  href={`/profiles/${p.id}`}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
