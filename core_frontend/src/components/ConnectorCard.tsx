import React from "react";
import type { ConnectorResponse } from "@/lib/api-client";

// PUBLIC_INTERFACE
export const ConnectorCard: React.FC<{
  connector: ConnectorResponse;
  children?: React.ReactNode;
}> = ({ connector, children }) => {
  /** Card presenting connector basics with themed styling */
  return (
    <div className="group bg-white rounded-xl shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-gray-50 flex items-center justify-center ring-1 ring-blue-200">
          <span className="text-blue-600 font-semibold">{connector.name[0]}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 font-semibold">{connector.name}</h3>
            {connector.supports_oauth && (
              <span className="text-xs text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2 py-1 rounded-full">
                OAuth
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Key: {connector.key}</p>
          {connector.oauth_scopes && connector.oauth_scopes.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              Scopes: {connector.oauth_scopes.join(", ")}
            </p>
          )}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
