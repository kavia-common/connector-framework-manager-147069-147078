"use client";

import React, { useEffect, useState } from "react";
import { apiClient, type ConnectionResponse, type ConnectorResponse } from "@/lib/api-client";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { ConnectionForm } from "@/components/ConnectionForm";

export default function ConnectionsPage() {
  const [loading, setLoading] = useState(true);
  const [connectors, setConnectors] = useState<ConnectorResponse[]>([]);
  const [connections, setConnections] = useState<ConnectionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    setLoading(true);
    try {
      const [cxs, cs] = await Promise.all([
        apiClient.listConnections(),
        apiClient.getConnectors(),
      ]);
      setConnections(cxs);
      setConnectors(cs);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleCreate = async (
    connector: ConnectorResponse,
    data: { connector_key?: string; config_data?: Record<string, unknown> | null } | Record<string, unknown>
  ) => {
    const payload =
      "config_data" in data
        ? (data as { config_data?: Record<string, unknown> | null })
        : { config_data: data as Record<string, unknown> };
    await apiClient.createConnection(
      {
        connector_key: connector.key,
        config_data: payload.config_data ?? null,
      },
    );
    await refresh();
  };

  const handleUpdate = async (
    cx: ConnectionResponse,
    data: { config_data?: Record<string, unknown> | null } | Record<string, unknown>
  ) => {
    const payload =
      "config_data" in data
        ? (data as { config_data?: Record<string, unknown> | null })
        : { config_data: data as Record<string, unknown> };
    await apiClient.updateConnection(cx.id, {
      config_data: payload.config_data ?? null,
    });
    await refresh();
  };

  const handleDelete = async (cx: ConnectionResponse) => {
    if (!confirm(`Delete connection ${cx.id} for ${cx.connector.name}?`)) return;
    await apiClient.deleteConnection(cx.id);
    await refresh();
  };

  const handleTest = async (cx: ConnectionResponse) => {
    try {
      const res = await apiClient.testConnection(cx.id);
      alert(`Test succeeded: ${JSON.stringify(res)}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Test failed: ${msg}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Connections</h1>
            <p className="text-sm text-gray-600">Create and manage connections to connectors.</p>
          </div>
          <nav>
            <Link className="text-sm text-blue-700 hover:text-blue-800 underline" href="/">
              Back to Connectors
            </Link>
          </nav>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 bg-white rounded-xl ring-1 ring-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <section aria-labelledby="existing-connections" className="space-y-3">
              <h2 id="existing-connections" className="text-lg font-medium text-gray-900">
                Existing Connections
              </h2>
              {connections.length === 0 ? (
                <div className="rounded-xl bg-white ring-1 ring-gray-200 p-6 text-gray-600">
                  No connections yet. Create one below.
                </div>
              ) : (
                <div className="space-y-3">
                  {connections.map((cx) => (
                    <div
                      key={cx.id}
                      className="bg-white rounded-xl ring-1 ring-gray-200 p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="font-semibold text-gray-900">
                            {cx.connector.name} (#{cx.id})
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <StatusBadge
                              status={
                                cx.status === "active"
                                  ? "active"
                                  : cx.status === "error"
                                  ? "error"
                                  : cx.status === "pending"
                                  ? "pending"
                                  : "inactive"
                              }
                            />
                            {cx.has_oauth_token ? (
                              <span className="text-xs text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2 py-1 rounded-full">
                                OAuth linked
                              </span>
                            ) : cx.connector.supports_oauth ? (
                              <span className="text-xs text-gray-500">No OAuth token</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTest(cx)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            Test
                          </button>
                          <button
                            onClick={() => handleDelete(cx)}
                            className="rounded-lg bg-white ring-1 ring-red-300 px-3 py-2 text-red-700 hover:bg-red-50 focus:ring-2 focus:ring-red-400 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <ConnectionForm
                        connector={cx.connector}
                        initial={cx.config_data ?? {}}
                        onSubmit={(data) => handleUpdate(cx, data)}
                        onOAuth={
                          cx.connector.supports_oauth
                            ? async () => {
                                // Initiate OAuth for existing connection
                                const res = await apiClient.initiateOAuth(
                                  cx.connector.key,
                                  cx.id
                                );
                                window.location.href = res.authorization_url;
                              }
                            : undefined
                        }
                        submitLabel="Update"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section aria-labelledby="new-connection" className="space-y-3">
              <h2 id="new-connection" className="text-lg font-medium text-gray-900">
                Create New Connection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectors.map((connector) => (
                  <div key={connector.key} className="bg-white rounded-xl ring-1 ring-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{connector.name}</h3>
                        <p className="text-xs text-gray-500">Key: {connector.key}</p>
                      </div>
                      {connector.supports_oauth && (
                        <span className="text-xs text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2 py-1 rounded-full">
                          OAuth
                        </span>
                      )}
                    </div>

                    <ConnectionForm
                      connector={connector}
                      initial={{}}
                      onSubmit={(data) => handleCreate(connector, data)}
                      onOAuth={
                        connector.supports_oauth
                          ? async () => {
                              const res = await apiClient.initiateOAuth(connector.key, null);
                              window.location.href = res.authorization_url;
                            }
                          : undefined
                      }
                      submitLabel="Create"
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
