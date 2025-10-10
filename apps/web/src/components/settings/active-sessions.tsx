"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const ActiveSessions = () => {
  const { user } = useAuth();
  const sessions = useQuery(
    api.sessions.getActiveSessions,
    user?.id ? { userId: user.id } : "skip"
  );
  const revokeSession = useMutation(api.sessions.revokeSession);
  const revokeOtherSessions = useMutation(api.sessions.revokeOtherSessions);

  const handleRevokeSession = async (sessionToken: string) => {
    if (!user?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to revoke this session? You will be logged out on that device."
    );

    if (!confirmed) return;

    try {
      await revokeSession({ sessionToken, userId: user.id });
      toast.success("Session revoked successfully");
    } catch (error) {
      toast.error("Failed to revoke session");
      console.error(error);
    }
  };

  const handleRevokeAllOthers = async () => {
    if (!user?.id || !sessions || sessions.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to revoke all other sessions? This will log you out on ${sessions.length - 1} device(s).`
    );

    if (!confirmed) return;

    try {
      // Precisamos do token da sessão atual - em produção, pegar do cookie
      const currentSessionToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("better-auth.session_token="))
        ?.split("=")[1];

      if (!currentSessionToken) {
        toast.error("Could not identify current session");
        return;
      }

      const result = await revokeOtherSessions({
        userId: user.id,
        currentSessionToken,
      });

      toast.success(`Revoked ${result.revokedCount} session(s)`);
    } catch (error) {
      toast.error("Failed to revoke sessions");
      console.error(error);
    }
  };

  if (!sessions) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return "lucide--smartphone";
      case "tablet":
        return "lucide--tablet";
      default:
        return "lucide--monitor";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Sessions ({sessions.length})</h3>
        {sessions.length > 1 && (
          <button
            type="button"
            onClick={handleRevokeAllOthers}
            className="btn btn-error btn-sm"
          >
            <span className="iconify lucide--log-out size-4" />
            Revoke All Others
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="alert alert-info">
          <span className="iconify lucide--info size-5" />
          <span>No active sessions found</span>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const isCurrentSession =
              session.sessionToken ===
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("better-auth.session_token="))
                ?.split("=")[1];

            return (
              <div
                key={session._id}
                className="card bg-base-200 shadow-sm border border-base-300"
              >
                <div className="card-body p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span
                        className={`iconify ${getDeviceIcon(session.device.type)} size-6 text-primary`}
                      />

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {session.device.browser} on {session.device.os}
                          </span>
                          {isCurrentSession && (
                            <span className="badge badge-success badge-sm">
                              Current
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-base-content/70 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="iconify lucide--map-pin size-3" />
                            <span>
                              {session.geolocation?.city || "Unknown city"},{" "}
                              {session.geolocation?.country || "Unknown country"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="iconify lucide--globe size-3" />
                            <span className="font-mono text-xs">
                              {session.ipAddress}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="iconify lucide--clock size-3" />
                            <span>
                              Last active: {formatDate(session.lastActivityAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="iconify lucide--calendar size-3" />
                            <span>Created: {formatDate(session.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isCurrentSession && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(session.sessionToken)}
                        className="btn btn-ghost btn-sm btn-square"
                        title="Revoke this session"
                      >
                        <span className="iconify lucide--x size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
