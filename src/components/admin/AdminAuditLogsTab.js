import { FiList } from "react-icons/fi";

export default function AdminAuditLogsTab({ logs }) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
        <FiList className="h-5 w-5 text-cyan-400" />
        Manager Activity Logs
      </h2>

      {!logs?.length ? (
        <div className="rounded-xl border border-slate-700/30 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
          No manager activity logs yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700/30">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Manager</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Action</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Target</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Details</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-slate-200">{log.actorUserId?.name || log.actorUserId?.email || "Unknown"}</td>
                  <td className="px-4 py-3 text-slate-300">{log.action}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {log.targetType} {log.targetId ? `(${log.targetId})` : ""}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500" title={JSON.stringify(log.details || {})}>
                    {JSON.stringify(log.details || {})}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
