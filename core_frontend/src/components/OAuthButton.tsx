"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { frontendUrl } from "@/lib/config";

// PUBLIC_INTERFACE
export const OAuthButton: React.FC<{
  connectorKey: string;
  connectionId?: number | null;
  className?: string;
}> = ({ connectorKey, connectionId, className }) => {
  /** Button that calls backend to initiate OAuth and redirects to provider */
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await apiClient.initiateOAuth(connectorKey, connectionId ?? undefined);
      window.location.href = res.authorization_url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start OAuth";
      setErr(msg);
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
        aria-busy={loading}
      >
        {loading ? "Redirecting..." : "Connect with OAuth"}
      </button>
      {err && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {err}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        You will be redirected back to {frontendUrl("/oauth/callback")}
      </p>
    </div>
  );
};
