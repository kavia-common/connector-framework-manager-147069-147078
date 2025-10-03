"use client";

import React, { useState } from "react";
import type { ConnectionCreate, ConnectionUpdate, ConnectorResponse } from "@/lib/api-client";

type JsonRecord = Record<string, unknown>;

type SchemaProps = Record<
  string,
  {
    type?: string;
    title?: string;
    description?: string;
  }
>;

// PUBLIC_INTERFACE
export const ConnectionForm: React.FC<{
  connector: ConnectorResponse;
  initial?: JsonRecord | null;
  onSubmit: (data: ConnectionCreate | ConnectionUpdate) => Promise<void>;
  onOAuth?: () => Promise<void> | void;
  submitLabel?: string;
}> = ({ connector, initial, onSubmit, onOAuth, submitLabel = "Save" }) => {
  /**
   * Simple JSON key/value editor for config_data until per-connector plugins provide richer UIs.
   * Reads config_schema properties when present to hint inputs.
   */
  const [config, setConfig] = useState<JsonRecord>({ ...(initial ?? {}) });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const schemaProps: SchemaProps =
    (connector.config_schema && (connector.config_schema.properties as SchemaProps)) || {};

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        connector_key: connector.key,
        config_data: config,
      } as ConnectionCreate);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save connection";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFields = () => {
    const keys = Object.keys(schemaProps);
    if (keys.length === 0) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Config (JSON)</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2 text-sm"
            rows={5}
            value={JSON.stringify(config, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value || "{}") as JsonRecord;
                setConfig(parsed);
                setError(null);
              } catch {
                setError("Invalid JSON in config");
              }
            }}
          />
          <p className="text-xs text-gray-500">No schema provided. Edit raw JSON.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {keys.map((key) => {
          const prop = schemaProps[key] || {};
          const type = prop.type ?? "string";
          const label = prop.title ?? key;
          const placeholder = prop.description ?? "";
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type === "integer" ? "number" : "text"}
                placeholder={placeholder}
                value={(config[key] as string) ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2 text-sm"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 ring-1 ring-gray-200">
      <div className="space-y-4">
        {renderFields()}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
          {connector.supports_oauth && onOAuth && (
            <button
              type="button"
              onClick={() => onOAuth()}
              className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Connect OAuth
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
