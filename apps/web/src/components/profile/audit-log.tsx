"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";

export const AuditLog = () => {
  const { user } = useAuth();
  const auditLogs = useQuery(
    api.audit.getAuditLogsByUser,
    user?.id ? { userId: user.id, limit: 20 } : "skip"
  );

  if (!auditLogs) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "badge-error";
      case "error":
        return "badge-warning";
      case "warning":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return "lucide--log-in";
    if (action.includes("logout")) return "lucide--log-out";
    if (action.includes("created")) return "lucide--plus-circle";
    if (action.includes("updated")) return "lucide--edit";
    if (action.includes("deleted")) return "lucide--trash-2";
    if (action.includes("password")) return "lucide--key";
    return "lucide--activity";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Activity Log</h3>

      {auditLogs.length === 0 ? (
        <div className="alert alert-info">
          <span className="iconify lucide--info size-5" />
          <span>No activity recorded yet</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Date</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className={`iconify ${getActionIcon(log.action)} size-4`}
                      />
                      <span className="font-mono text-sm">{log.action}</span>
                    </div>
                  </td>
                  <td>
                    {log.details ? (
                      <div className="max-w-xs truncate text-sm text-base-content/70">
                        {log.details}
                      </div>
                    ) : (
                      <span className="text-base-content/50">—</span>
                    )}
                  </td>
                  <td>
                    <div className="space-y-1">
                      {log.ipAddress && (
                        <div className="font-mono text-xs">{log.ipAddress}</div>
                      )}
                      {log.geolocation && (
                        <div className="text-xs text-base-content/70">
                          {log.geolocation.city}, {log.geolocation.country}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-sm">{formatDate(log.timestamp)}</td>
                  <td>
                    <span className={`badge badge-sm ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
