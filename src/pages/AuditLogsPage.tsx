import React from "react";
import { UserRole } from "../types";
import { Activity } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";

export default function AuditLogsPage() {
  const { auditLogs } = useAppContext();

  return (
    <div className="space-y-6" id="audit-logs-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Operational System Audit Trail</h2>
          <p className="text-slate-500 text-xs mt-1">
            An immutable log tracking user actions, login sessions, and inventory adjustments across RSIA Bina Medika.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold uppercase">
          <Activity className="w-4 h-4" /> Traceability Logging Active
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs">
        <div className="p-4 bg-slate-900 text-slate-300 font-bold flex items-center justify-between">
          <span>UNBROKEN SECURITY TRAIL</span>
          <span className="text-[10px] text-teal-400 font-mono">ENFORCE LEVEL 3 RLS</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {auditLogs.map((log) => {
            let roleBadge = "bg-slate-100 text-slate-700";
            if (log.userRole === UserRole.SUPER_ADMIN) roleBadge = "bg-rose-50 text-rose-700 border border-rose-200/50";
            if (log.userRole === UserRole.ENTRY_DATA) roleBadge = "bg-blue-50 text-blue-700 border border-blue-200/50";

            return (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${roleBadge}`}>
                      {log.userRole}
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">
                      {log.module}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">{log.details}</p>
                </div>

                <div className="shrink-0 text-right space-y-0.5">
                  <div className="text-slate-800 font-bold">{log.userName}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase font-mono">
                    {new Date(log.timestamp).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
