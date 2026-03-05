"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiAward } from "react-icons/fi";
import { fetchLeaderboard } from "@/services/leaderboardService";

export default function LeaderboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      fetchLeaderboard()
        .then((data) => setRows(data.rows || []))
        .catch((err) => setError(err.message || "Unable to load leaderboard"));
    }
  }, [status, router]);

  return (
    <section className="space-y-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-zinc-900">
        <FiAward /> Leaderboard
      </h1>
      {error ? <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{error}</p> : null}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Quiz</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No leaderboard entries yet.
                </td>
              </tr>
            ) : null}
            {rows.map((row, index) => (
              <tr key={row._id} className="border-t border-zinc-100">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 text-zinc-800">{row.userId?.name || row.userId?.email}</td>
                <td className="px-4 py-3">{row.quizId?.title}</td>
                <td className="px-4 py-3 font-semibold">{row.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}