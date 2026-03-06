import { useState, useMemo } from "react";
import { FiCheckSquare, FiDownload, FiPlayCircle, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";

const selectClass = "rounded-xl border border-slate-600/50 bg-slate-700/50 px-4 py-2.5 text-sm text-white transition-colors focus:border-cyan-500/50 focus:bg-slate-700";
const btnOutline = "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-600/50 bg-slate-700/30 px-3.5 py-2 text-sm font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white";

export default function AdminResultsTab({
    results,
    quizzes,
    onUnlockAttempt,
    onResetAttempt
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [exportQuizId, setExportQuizId] = useState("all");
    const [exportStatus, setExportStatus] = useState("joined");
    const [exportSortBy, setExportSortBy] = useState("latest");
    const [rankedQuizId, setRankedQuizId] = useState("all");

    const filteredExportHref = useMemo(() => {
        const params = new URLSearchParams();
        if (exportQuizId !== "all") params.set("quizId", exportQuizId);
        if (exportStatus !== "all") params.set("status", exportStatus);
        if (exportSortBy !== "latest") params.set("sortBy", exportSortBy);
        return `/api/admin/results/export${params.toString() ? `?${params.toString()}` : ""}`;
    }, [exportQuizId, exportStatus, exportSortBy]);

    const quickExportHref = (status) => {
        const params = new URLSearchParams();
        if (exportQuizId !== "all") params.set("quizId", exportQuizId);
        params.set("status", status);
        if (exportSortBy !== "latest") params.set("sortBy", exportSortBy);
        return `/api/admin/results/export?${params.toString()}`;
    };

    const rankedExportHref = useMemo(() => {
        const params = new URLSearchParams();
        params.set("mode", "ranked");
        if (rankedQuizId !== "all") params.set("quizId", rankedQuizId);
        return `/api/admin/results/export?${params.toString()}`;
    }, [rankedQuizId]);

    const filteredResults = useMemo(() => {
        return results.filter(row => {
            // Build searchable string from user name/email + quiz title
            const userStr = `${row.userId?.name || ""} ${row.userId?.email || ""}`.toLowerCase();
            const quizStr = (row.quizId?.title || "").toLowerCase();

            const matchesSearch = userStr.includes(searchQuery.toLowerCase()) || quizStr.includes(searchQuery.toLowerCase());

            const matchesFilter =
                statusFilter === "all" ? true :
                    statusFilter === "locked" ? row.isLocked :
                        statusFilter === "disqualified" ? row.status === "disqualified" :
                            statusFilter === "submitted" ? row.status === "submitted" :
                                statusFilter === "in_progress" ? row.status === "in_progress" : true;

            return matchesSearch && matchesFilter;
        });
    }, [results, searchQuery, statusFilter]);

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 md:p-8 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 shrink-0">
                        <FiCheckSquare className="h-5 w-5 text-cyan-400" />
                        Results & Requests
                    </h2>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <p className="text-sm font-semibold text-cyan-300">Ranked Quiz Export</p>
                        <p className="mt-1 text-xs text-slate-400">Download rank-wise results with full user details and score (submitted attempts only).</p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <select
                                value={rankedQuizId}
                                onChange={(e) => setRankedQuizId(e.target.value)}
                                className={`${selectClass} min-w-[220px]`}
                            >
                                <option value="all">All quizzes</option>
                                {(quizzes || []).map((quiz) => (
                                    <option key={quiz._id} value={quiz._id}>
                                        {quiz.title}
                                    </option>
                                ))}
                            </select>
                            <a href={rankedExportHref} className={`${btnOutline} shrink-0`}>
                                <FiDownload className="h-3.5 w-3.5" />
                                Export Ranked CSV
                            </a>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-4">
                        <p className="text-sm font-semibold text-white">Filtered Export</p>
                        <p className="mt-1 text-xs text-slate-400">Download all joined users or specific result status like submitted/disqualified (with reason)/expired.</p>
                        <div className="mt-3 flex flex-col gap-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <select
                                    value={exportQuizId}
                                    onChange={(e) => setExportQuizId(e.target.value)}
                                    className={`${selectClass} min-w-[220px]`}
                                >
                                    <option value="all">All quizzes</option>
                                    {(quizzes || []).map((quiz) => (
                                        <option key={quiz._id} value={quiz._id}>
                                            {quiz.title}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={exportStatus}
                                    onChange={(e) => setExportStatus(e.target.value)}
                                    className={`${selectClass} min-w-[220px]`}
                                >
                                    <option value="joined">All Joined</option>
                                    <option value="submitted">Submitted Only</option>
                                    <option value="disqualified">Disqualified Only</option>
                                    <option value="expired">Expired Only</option>
                                    <option value="in_progress">In Progress Only</option>
                                    <option value="locked">Locked Only</option>
                                </select>
                                <select
                                    value={exportSortBy}
                                    onChange={(e) => setExportSortBy(e.target.value)}
                                    className={`${selectClass} min-w-[220px]`}
                                >
                                    <option value="latest">Sort: Latest</option>
                                    <option value="oldest">Sort: Oldest</option>
                                    <option value="score_desc">Sort: Score High → Low</option>
                                    <option value="score_asc">Sort: Score Low → High</option>
                                    <option value="rank">Sort: Rank</option>
                                </select>
                            </div>

                            <a href={filteredExportHref} className={`${btnOutline} w-fit`}>
                                <FiDownload className="h-3.5 w-3.5" />
                                Export Filtered CSV
                            </a>

                            <div className="mt-2 flex flex-wrap gap-2">
                                <a href={quickExportHref("joined")} className={btnOutline}>Export All Joined</a>
                                <a href={quickExportHref("submitted")} className={btnOutline}>Export Submitted Only</a>
                                <a href={quickExportHref("disqualified")} className={btnOutline}>Export Disqualified + Reason</a>
                                <a href={quickExportHref("expired")} className={btnOutline}>Export Expired Only</a>
                                <a href={quickExportHref("in_progress")} className={btnOutline}>Export In Progress</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by user email, name, or quiz title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-600/50 bg-slate-900/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                        />
                    </div>
                    <div className="relative shrink-0">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-56 rounded-xl border border-slate-600/50 bg-slate-900/50 py-2.5 pl-11 pr-4 text-sm text-white focus:border-cyan-500/50 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="locked">Action Needed (Locked)</option>
                            <option value="disqualified">Disqualified</option>
                            <option value="submitted">Submitted</option>
                            <option value="in_progress">In Progress</option>
                        </select>
                        {/* Custom dropdown arrow to replace native one since we used padding */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-700/30">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-slate-900/50">
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">User</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Quiz</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Score</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Warnings</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Submitted</th>
                                <th className="px-4 py-3 text-xs text-right font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!filteredResults.length ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FiCheckSquare className="h-8 w-8 text-slate-600 mb-2" />
                                            <p>No results found matching your filters.</p>
                                            <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="text-cyan-400 hover:underline mt-2">Clear Filters</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            {filteredResults.map((row) => (
                                <tr key={row._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium text-white max-w-[200px] truncate" title={row.userId?.email}>
                                        {row.userId?.name || row.userId?.email || "Unknown"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-400 max-w-[200px] truncate" title={row.quizId?.title}>
                                        {row.quizId?.title || "Unknown"}
                                        {row.isLocked && (
                                            <span className="ml-2 inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-rose-400">
                                                Locked
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${row.status === "submitted"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : row.status === "in_progress"
                                                ? "bg-amber-500/10 text-amber-400"
                                                : row.status === "disqualified"
                                                    ? "bg-rose-500/10 text-rose-400"
                                                    : "bg-slate-500/10 text-slate-400"
                                            }`}>
                                            {row.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-sm font-bold text-cyan-400">
                                            {row.totalScore ?? 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {(row.warnings ?? 0) > 0 ? (
                                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                                                {row.warnings}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-slate-600">0</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                                        {row.submittedAt ? new Date(row.submittedAt).toLocaleString() : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {(row.status === "disqualified" || row.status === "in_progress" || row.isLocked) && (
                                                <button
                                                    type="button"
                                                    title="Unlock/Resume Attempt (Forgive User)"
                                                    onClick={() => onUnlockAttempt(row._id)}
                                                    className="inline-flex items-center rounded-lg bg-emerald-500/10 p-2 text-emerald-400 transition-colors hover:bg-emerald-500/20"
                                                >
                                                    <FiPlayCircle className="h-4 w-4" />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                title="Delete Attempt (Allow Re-Attempt from scratch)"
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this attempt? This lets the user start over completely.")) {
                                                        onResetAttempt(row._id);
                                                    }
                                                }}
                                                className="inline-flex items-center rounded-lg bg-rose-500/10 p-2 text-rose-400 transition-colors hover:bg-rose-500/20"
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
