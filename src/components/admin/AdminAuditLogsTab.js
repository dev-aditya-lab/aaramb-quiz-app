import { FiClipboard, FiUser, FiActivity, FiCalendar } from "react-icons/fi";

export default function AdminAuditLogsTab({ rows }) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 md:p-8 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-white flex items-center gap-2">
          <FiClipboard className="h-5 w-5 text-cyan-400" />
          Manager Logs
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-700/30">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Manager</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Target</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {!safeRows.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                    No manager logs found yet.
                  </td>
                </tr>
              ) : null}

              {safeRows.map((row) => (
                <tr key={row._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-sm text-white">
                    <div className="inline-flex items-center gap-2">
                      <FiUser className="h-3.5 w-3.5 text-slate-500" />
                      <span>{row.actorUserId?.name || row.actorUserId?.email || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    <div className="inline-flex items-center gap-2">
                      <FiActivity className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="uppercase tracking-wide text-xs font-semibold">{row.action || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    <span className="capitalize">{row.targetType || "-"}</span>
                    {row.targetId ? <span className="ml-2 text-slate-500">({row.targetId})</span> : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <FiCalendar className="h-3.5 w-3.5 text-slate-600" />
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                    </span>
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
