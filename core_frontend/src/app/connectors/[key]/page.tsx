import { apiClient } from "@/lib/api-client";
import { PluginScreen } from "@/components/PluginScreen";
import Link from "next/link";

// Do not add a compile-time type to props to avoid Next's PageProps constraint conflicts.
export default async function ConnectorPluginPage(props: any) {
  // Safely derive the connector key from props.params
  let connectorKey = "";
  try {
    const params = props?.params;
    if (params && typeof params === "object") {
      connectorKey = (params as { key?: string })?.key ?? "";
    }
  } catch {
    connectorKey = "";
  }

  const connector = connectorKey
    ? await apiClient.getConnector(connectorKey).catch(() => null)
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500/10 to-gray-50">
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {connector ? connector.name : "Connector"}
            </h1>
            <p className="text-sm text-gray-600">
              {connector ? `Key: ${connector.key}` : "Could not load connector details."}
            </p>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/" className="text-sm text-blue-700 hover:text-blue-800 underline">
              All Connectors
            </Link>
            <Link href="/connections" className="text-sm text-blue-700 hover:text-blue-800 underline">
              Connections
            </Link>
          </nav>
        </header>

        {!connector ? (
          <div className="rounded-xl bg-white ring-1 ring-gray-200 p-6 text-gray-600">
            Failed to load connector.
          </div>
        ) : (
          <PluginScreen
            title={`${connector.name} Plugin`}
            description="Example plugin area. Replace with connector-specific UI."
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This section can render tables, charts, task lists, etc. based on the connector.
              </p>

              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Field</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    <tr>
                      <td className="px-3 py-2 text-gray-600">ID</td>
                      <td className="px-3 py-2">{connector.id}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">Key</td>
                      <td className="px-3 py-2">{connector.key}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">Name</td>
                      <td className="px-3 py-2">{connector.name}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-600">Supports OAuth</td>
                      <td className="px-3 py-2">{connector.supports_oauth ? "Yes" : "No"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {connector.supports_oauth && (
                <div className="pt-2">
                  <a
                    href={`/connections`}
                    className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    Connect OAuth via Connections
                  </a>
                </div>
              )}
            </div>
          </PluginScreen>
        )}
      </div>
    </main>
  );
}
